const path = require('path');
// Try to load .env from multiple locations
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../../apps/backend/.env') });
} catch (e) {
  // Fallback for production
  require('dotenv').config();
}

const { createClient } = require('@supabase/supabase-js');
const { getRow, update, remove, getRows } = require('../../packages/shared/src/database/connection');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  const { method, query: { id } } = req;
  
  try {
    switch (method) {
      case 'GET':
        await handleGetProduct(req, res, id);
        break;
      case 'PUT':
        await handleUpdateProduct(req, res, id);
        break;
      case 'DELETE':
        await handleDeleteProduct(req, res, id);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ Product API Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}

async function handleGetProduct(req, res, id) {
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
  
  // Get available file formats
  try {
    const files = await getRows(`
      SELECT id, format, content_type, file_size, is_primary
      FROM files 
      WHERE product_id = $1
      ORDER BY is_primary DESC, format
    `, [product.id]);
    
    product.files = files;
  } catch (fileError) {
    console.log('No files table or error fetching files:', fileError.message);
    product.files = [];
  }
  
  res.json({ product });
}

async function handleUpdateProduct(req, res, id) {
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
}

async function handleDeleteProduct(req, res, id) {
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
}
