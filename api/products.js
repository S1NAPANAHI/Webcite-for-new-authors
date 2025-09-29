const path = require('path');
// Try to load .env from multiple locations
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../apps/backend/.env') });
} catch (e) {
  // Fallback for production
  require('dotenv').config();
}

const { createClient } = require('@supabase/supabase-js');
const { getRows } = require('../packages/shared/src/database/connection');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  const { method } = req;
  
  try {
    switch (method) {
      case 'GET':
        // Add a simple router for different GET requests
        if (req.url.includes('/user/loyalty')) {
          await handleGetUserLoyalty(req, res);
        } else {
          await handleGetProducts(req, res);
        }
        break;
      case 'POST':
        await handleCreateProduct(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}

async function handleGetProducts(req, res) {
  const {
    limit = 50, 
    offset = 0, 
    category, 
    subcategory, 
    price_max, 
    difficulty_level, 
    language, 
    related_characters, 
    mythology_themes,
    active = true,
  } = req.query;
  
  let query = `
    SELECT p.*,
           pc.name as category_name,
           pc.color_scheme,
           (SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id) as avg_rating,
           (SELECT COUNT(pr.id) FROM product_reviews pr WHERE pr.product_id = p.id) as review_count
    FROM products p
    LEFT JOIN product_categories pc ON pc.slug = p.category
  `;
  
  const whereConditions = [];
  const queryParams = [];
  let paramCount = 1;

  if (active !== undefined) {
    whereConditions.push(`p.active = $${paramCount++}`);
    queryParams.push(active === 'true');
  }

  if (category) {
    whereConditions.push(`p.category = $${paramCount++}`);
    queryParams.push(category);
  }

  if (subcategory) {
    whereConditions.push(`p.subcategory = $${paramCount++}`);
    queryParams.push(subcategory);
  }

  if (price_max) {
    whereConditions.push(`p.price <= $${paramCount++}`);
    queryParams.push(price_max);
  }

  if (difficulty_level) {
    whereConditions.push(`p.difficulty_level = $${paramCount++}`);
    queryParams.push(difficulty_level);
  }

  if (language) {
    whereConditions.push(`p.language = $${paramCount++}`);
    queryParams.push(language);
  }

  if (related_characters) {
    whereConditions.push(`$${paramCount++} = ANY(p.related_characters)`);
    queryParams.push(related_characters);
  }

  if (mythology_themes) {
    whereConditions.push(`$${paramCount++} = ANY(p.mythology_themes)`);
    queryParams.push(mythology_themes);
  }
  
  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }
  
  query += `
    GROUP BY p.id, pc.id
    ORDER BY p.created_at DESC
    LIMIT $${paramCount++} OFFSET $${paramCount++}
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
}

async function handleGetUserLoyalty(req, res) {
  // In a real application, you would get the user ID from the request
  // and fetch the loyalty data from the database.
  // For now, we'll return static data.
  res.json({
    user_id: 'static_user_id',
    sacred_fire_points: 150,
    current_tier: 'initiate',
    tier_progress: 30, // 30% to next tier
    total_purchases: 42.50,
    total_orders: 2,
    achievements: ['first_purchase']
  });
}

async function handleCreateProduct(req, res) {
  const { productData } = req.body;
  const { name, description, product_type, active = true, work_id = null, content_grants = [] } = productData;
  
  if (!name || !product_type) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name and product_type are required'
    });
  }
  
  const { insert } = require('../packages/shared/src/database/connection');
  
  const product = await insert(`
    INSERT INTO products (name, description, product_type, active, work_id, content_grants)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [name, description, product_type, active, work_id, JSON.stringify(content_grants)]);
  
  res.status(201).json({ product });
}