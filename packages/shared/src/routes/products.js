const express = require('express');
const multer = require('multer');
const { getRows, getRow, insert, update, remove } = require('../database/connection');
const { uploadFile, generateSecureKey, validateFile } = require('../services/s3Service');

module.exports = (supabase) => {
  const router = express.Router();

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedFormats = ['pdf', 'epub', 'mobi'];
      const format = file.originalname.split('.').pop().toLowerCase();
      
      if (allowedFormats.includes(format)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`));
      }
    }
  });

  // Get all products
  router.get('/', async (req, res) => {
  try {
    const { active, product_type, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.id, p.name, p.description, p.product_type, p.active, p.created_at, p.updated_at, p.work_id, p.content_grants,
             COALESCE(array_agg(DISTINCT pr.id) FILTER (WHERE pr.id IS NOT NULL), '{}') as price_ids,
             COALESCE(array_agg(DISTINCT pr.unit_amount) FILTER (WHERE pr.unit_amount IS NOT NULL), '{}') as unit_amounts,
             COALESCE(array_agg(DISTINCT pr.currency) FILTER (WHERE pr.currency IS NOT NULL), '{}') as currencies
      FROM products p
      LEFT JOIN prices pr ON p.id = pr.product_id AND pr.active = true
    `;
    
    const whereConditions = [];
    const queryParams = [];
    let paramCount = 0;
    
    if (active !== undefined) {
      paramCount++;
      whereConditions.push(`p.active = ${paramCount}`);
      queryParams.push(active === 'true'); // Convert string to boolean
    }
    
    if (product_type) {
      paramCount++;
      whereConditions.push(`p.product_type = ${paramCount}`);
      queryParams.push(product_type);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += `
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ${paramCount + 1} OFFSET ${paramCount + 2}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const products = await getRows(query, queryParams);
    
    res.json({
      products,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: products.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message,
      details: error // Add the full error object here
    });
  }
});

// Get product by slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await getRow(`
      SELECT p.id, p.name, p.description, p.product_type, p.active, p.created_at, p.updated_at, p.work_id, p.content_grants,
             COALESCE(array_agg(DISTINCT pr.id) FILTER (WHERE pr.id IS NOT NULL), '{}') as price_ids,
             COALESCE(array_agg(DISTINCT pr.unit_amount) FILTER (WHERE pr.unit_amount IS NOT NULL), '{}') as unit_amounts,
             COALESCE(array_agg(DISTINCT pr.currency) FILTER (WHERE pr.currency IS NOT NULL), '{}') as currencies,
             array_agg(DISTINCT pr.interval) as intervals,
             array_agg(DISTINCT pr.trial_days) as trial_days
      FROM products p
      LEFT JOIN prices pr ON p.id = pr.product_id AND pr.active = true
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'No product found with the specified ID'
      });
    }
    
    // Get available file formats (if applicable, assuming files table still exists and is relevant)
    // This part of the code is kept for now, but might need further review based on file management strategy.
    const files = await getRows(`
      SELECT id, format, content_type, file_size, is_primary
      FROM files 
      WHERE product_id = $1
      ORDER BY is_primary DESC, format
    `, [product.id]);
    
    product.files = files;
    
    res.json({ product });
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, description, product_type, active = true, work_id = null, content_grants = [] } = req.body;
    
    if (!name || !product_type) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and product_type are required'
      });
    }
    
    const product = await insert(`
      INSERT INTO products (name, description, product_type, active, work_id, content_grants)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, product_type, active, work_id, JSON.stringify(content_grants)]);
    
    res.status(201).json({ product });
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, product_type, active, work_id, content_grants } = req.body;
    
    // Check if product exists
    const existingProduct = await getRow('SELECT id FROM products WHERE id = $1', [id]);
    if (!existingProduct) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'No product found with the specified ID'
      });
    }
    
    const product = await update(`
      UPDATE products 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          product_type = COALESCE($3, product_type),
          active = COALESCE($4, active),
          work_id = COALESCE($5, work_id),
          content_grants = COALESCE($6, content_grants::jsonb),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [name, description, product_type, active, work_id, JSON.stringify(content_grants), id]);
    
    res.json({ product });
    
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await getRow('SELECT id FROM products WHERE id = $1', [id]);
    if (!existingProduct) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'No product found with the specified ID'
      });
    }
    
    // Soft delete by setting active to false
    await update('UPDATE products SET active = false, updated_at = NOW() WHERE id = $1', [id]);
    
    res.json({ message: 'Product archived successfully' });
    
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// Upload file for product
router.post('/:id/files', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { format, is_primary = false } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a file'
      });
    }
    
    // Check if product exists
    const product = await getRow('SELECT id, slug FROM products WHERE id = $1', [id]);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'No product found with the specified ID'
      });
    }
    
    // Validate file
    const fileValidation = validateFile(format || req.file.originalname.split('.').pop(), req.file.size);
    if (!fileValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid file',
        message: Object.values(fileValidation.errors).filter(Boolean).join(', ')
      });
    }
    
    // Generate secure S3 key
    const s3Key = generateSecureKey(id, format || req.file.originalname.split('.').pop(), req.file.originalname);
    
    // Upload file to S3
    const uploadResult = await uploadFile(
      req.file.buffer,
      s3Key,
      req.file.mimetype,
      {
        originalName: req.file.originalname,
        productId: id,
        format: format || req.file.originalname.split('.').pop()
      }
    );
    
    // Save file record to database
    const file = await insert(`
      INSERT INTO files (product_id, s3_key, content_type, file_size, format, is_primary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      id,
      s3Key,
      req.file.mimetype,
      req.file.size,
      format || req.file.originalname.split('.').pop(),
      is_primary
    ]);
    
    
    
    res.status(201).json({ 
      file,
      message: 'File uploaded successfully',
      s3Key: uploadResult.key
    });
    
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      message: error.message
    });
  }
});

// Get product files
router.get('/:id/files', async (req, res) => {
  try {
    const { id } = req.params;
    
    const files = await getRows(`
      SELECT id, format, content_type, file_size, is_primary, created_at
      FROM files 
      WHERE product_id = $1
      ORDER BY is_primary DESC, format
    `, [id]);
    
    res.json({ files });
    
  } catch (error) {
    console.error('❌ Error fetching product files:', error);
    res.status(500).json({
      error: 'Failed to fetch product files',
      message: error.message
    });
  }
});

// Delete product file
router.delete('/:id/files/:fileId', async (req, res) => {
  try {
    const { id, fileId } = req.params;
    
    // Check if file exists and belongs to product
    const file = await getRow('SELECT * FROM files WHERE id = $1 AND product_id = $2', [fileId, id]);
    if (!file) {
      return res.status(404).json({
        error: 'File not found',
        message: 'No file found with the specified ID for this product'
      });
    }
    
    // Delete from S3
    // Note: In production, you might want to implement soft delete or move to archive bucket
    // await deleteFile(file.s3_key);
    
    // Remove from database
    await remove('DELETE FROM files WHERE id = $1', [fileId]);
    
    res.json({ message: 'File deleted successfully' });
    
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      message: error.message
    });
  }
});

  return router;
};
