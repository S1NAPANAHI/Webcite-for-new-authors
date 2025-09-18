const express = require('express');
const { supabaseAdmin } = require('../supabaseAdminClient');
const { generateDownloadUrl } = require('../services/s3Service');

const router = express.Router();

// Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, provider, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT o.*, 
             p.title as product_title,
             p.slug as product_slug,
             pr.amount_cents,
             pr.currency
      FROM orders o
      LEFT JOIN prices pr ON o.price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
    `;
    
    const whereConditions = [];
    const queryParams = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      whereConditions.push(`o.status = $${paramCount}`);
      queryParams.push(status);
    }
    
    if (provider) {
      paramCount++;
      whereConditions.push(`o.provider = $${paramCount}`);
      queryParams.push(provider);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += `
      ORDER BY o.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const orders = await getRows(query, queryParams);
    
    res.json({
      orders,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: orders.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await getRow(`
      SELECT o.*, 
             p.title as product_title,
             p.slug as product_slug,
             p.description as product_description,
             pr.amount_cents,
             pr.currency,
             pr.interval
      FROM orders o
      LEFT JOIN prices pr ON o.price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE o.id = $1
    `, [id]);
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the specified ID'
      });
    }
    
    res.json({ order });
    
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT o.*, 
             p.title as product_title,
             p.slug as product_slug,
             p.cover_image_url,
             pr.amount_cents,
             pr.currency,
             pr.interval
      FROM orders o
      LEFT JOIN prices pr ON o.price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE o.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;
    
    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      queryParams.push(status);
    }
    
    query += `
      ORDER BY o.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const orders = await getRows(query, queryParams);
    
    res.json({
      orders,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: orders.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({
      error: 'Failed to fetch user orders',
      message: error.message
    });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { 
      user_id, 
      provider, 
      provider_session_id, 
      provider_payment_intent_id, 
      price_id, 
      amount_cents, 
      currency, 
      customer_email,
      metadata 
    } = req.body;
    
    if (!provider || !price_id || !amount_cents || !currency) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Provider, price_id, amount_cents, and currency are required'
      });
    }
    
    const order = await insert(`
      INSERT INTO orders (
        user_id, provider, provider_session_id, provider_payment_intent_id,
        price_id, status, amount_cents, currency, customer_email, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      user_id || null,
      provider,
      provider_session_id || null,
      provider_payment_intent_id || null,
      price_id,
      'pending',
      amount_cents,
      currency,
      customer_email || null,
      metadata || {}
    ]);
    
    res.status(201).json({ order });
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, metadata } = req.body;
    
    if (!status) {
      return res.status(400).json({
        error: 'Missing status',
        message: 'Status is required'
      });
    }
    
    // Check if order exists
    const existingOrder = await getRow('SELECT id FROM orders WHERE id = $1', [id]);
    if (!existingOrder) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the specified ID'
      });
    }
    
    const updateData = { status };
    if (metadata) {
      updateData.metadata = metadata;
    }
    
    const order = await update(`
      UPDATE orders 
      SET status = $1, 
          metadata = COALESCE($2, metadata),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, metadata, id]);
    
    res.json({ order });
    
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      error: 'Failed to update order status',
      message: error.message
    });
  }
});

// Generate download links for completed order
router.post('/:id/download-links', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order with product details
    const order = await getRow(`
      SELECT o.*, 
             p.id as product_id,
             p.title as product_title,
             pr.product_id as price_product_id
      FROM orders o
      LEFT JOIN prices pr ON o.price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE o.id = $1
    `, [id]);
    
    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'No order found with the specified ID'
      });
    }
    
    if (order.status !== 'completed') {
      return res.status(400).json({
        error: 'Order not completed',
        message: 'Download links can only be generated for completed orders'
      });
    }
    
    // Get product files
    const files = await getRows(`
      SELECT id, format, content_type, s3_key, is_primary
      FROM files 
      WHERE product_id = $1
      ORDER BY is_primary DESC, format
    `, [order.product_id]);
    
    if (files.length === 0) {
      return res.status(404).json({
        error: 'No files found',
        message: 'No files found for this product'
      });
    }
    
    // Generate download URLs
    const downloadUrls = [];
    for (const file of files) {
      const downloadUrl = await generateDownloadUrl(file.s3_key, file.content_type, 3600); // 1 hour expiry
      downloadUrls.push({
        format: file.format,
        url: downloadUrl,
        expiresIn: '1 hour',
        contentType: file.content_type
      });
    }
    
    // Track download request
    await insert(`
      INSERT INTO downloads (order_id, file_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
    `, [id, files[0].id, req.ip, req.get('User-Agent')]);
    
    res.json({
      orderId: id,
      productTitle: order.product_title,
      downloadUrls,
      expiresIn: '1 hour'
    });
    
  } catch (error) {
    console.error('❌ Error generating download links:', error);
    res.status(500).json({
      error: 'Failed to generate download links',
      message: error.message
    });
  }
});

// Get order analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const queryParams = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
      queryParams.push(start_date, end_date);
    }
    
    // Total orders and revenue
    const summary = await getRow(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_orders,
        SUM(CASE WHEN status = 'completed' THEN amount_cents ELSE 0 END) as total_revenue_cents,
        AVG(CASE WHEN status = 'completed' THEN amount_cents ELSE NULL END) as average_order_value_cents
      FROM orders
      ${dateFilter}
    `, queryParams);
    
    // Orders by status
    const statusBreakdown = await getRows(`
      SELECT status, COUNT(*) as count
      FROM orders
      ${dateFilter}
      GROUP BY status
      ORDER BY count DESC
    `, queryParams);
    
    // Orders by provider
    const providerBreakdown = await getRows(`
      SELECT provider, COUNT(*) as count
      FROM orders
      ${dateFilter}
      GROUP BY provider
      ORDER BY count DESC
    `, queryParams);
    
    res.json({
      summary: {
        totalOrders: parseInt(summary.total_orders),
        completedOrders: parseInt(summary.completed_orders),
        failedOrders: parseInt(summary.failed_orders),
        totalRevenueCents: parseInt(summary.total_revenue_cents || 0),
        averageOrderValueCents: parseInt(summary.average_order_value_cents || 0)
      },
      statusBreakdown,
      providerBreakdown
    });
    
  } catch (error) {
    console.error('❌ Error fetching order analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch order analytics',
      message: error.message
    });
  }
});

module.exports = router;
