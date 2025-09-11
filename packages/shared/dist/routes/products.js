import express from 'express';
// import multer from 'multer'; // Commented out as file functionality is disabled
// const { getRows, getRow, insert, update, remove } = require('../database/connection');
// const { uploadFile, generateSecureKey, validateFile } = require('../services/s3Service');
export default (supabase) => {
    const router = express.Router();
    // Configure multer for file uploads (Commented out as file functionality is disabled)
    // const upload = multer({
    //   storage: multer.memoryStorage(),
    //   limits: {
    //     fileSize: 100 * 1024 * 1024, // 100MB limit
    //   },
    //   fileFilter: (req, file, cb) => {
    //     const allowedFormats = ['pdf', 'epub', 'mobi'];
    //     const format = file.originalname.split('.').pop()?.toLowerCase();
    //     
    //     if (allowedFormats.includes(format || '')) {
    //       cb(null, true);
    //     } else {
    //       cb(new Error(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`));
    //     }
    //   }
    // });
    // Get all products
    router.get('/', async (_req, res) => {
        try {
            const { active, product_type, limit = 50, offset = 0 } = _req.query;
            console.log('🔍 [Products API] Fetching products with filters:', { active, product_type, limit, offset });
            let query = supabase
                .from('products')
                .select(`
        id, slug, name, title, description, product_type, active, created_at, updated_at,
        prices:prices!inner(
          id, price_id, currency, amount_cents, unit_amount, interval, interval_count, trial_period_days, active
        )
      `);
            if (active !== undefined) {
                query = query.eq('active', active === 'true');
            }
            if (product_type) {
                query = query.eq('product_type', product_type);
            }
            query = query
                .order('created_at', { ascending: false })
                .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
            const { data: products, error } = await query;
            if (error) {
                console.error('❌ [Products API] Supabase error:', error);
                throw error;
            }
            console.log('✅ [Products API] Found products:', products?.length || 0);
            return res.json({
                products: products || [],
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: products?.length || 0
                }
            });
        }
        catch (error) {
            console.error('❌ Error fetching products:', error);
            return res.status(500).json({
                error: 'Failed to fetch products',
                message: error.message
            });
        }
    });
    // Get product by ID
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            console.log('🔍 [Products API] Fetching product by ID:', id);
            const { data: product, error } = await supabase
                .from('products')
                .select(`
        id, slug, name, title, description, product_type, active, created_at, updated_at,
        prices:prices(
          id, price_id, currency, amount_cents, unit_amount, interval, interval_count, trial_period_days, active
        )
      `)
                .eq('id', id)
                .single();
            if (error) {
                console.error('❌ [Products API] Error fetching product:', error);
                if (error.code === 'PGRST116') {
                    return res.status(404).json({
                        error: 'Product not found',
                        message: 'No product found with the specified ID'
                    });
                }
                throw error;
            }
            console.log('✅ [Products API] Found product:', product?.name);
            return res.json({ product });
        }
        catch (error) {
            console.error('❌ Error fetching product:', error);
            return res.status(500).json({
                error: 'Failed to fetch product',
                message: error.message
            });
        }
    });
    // Simplified endpoints - files functionality disabled for now
    // TODO: Implement file upload functionality later
    return router;
};
//# sourceMappingURL=products.js.map