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
        await handleGetProducts(req, res);
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
  const { active, product_type, work_id, limit = 50, offset = 0 } = req.query;
  
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
    whereConditions.push(`p.active = $${paramCount}`);
    queryParams.push(active === 'true');
  }
  
  if (product_type) {
    paramCount++;
    whereConditions.push(`p.product_type = ${paramCount}`);
    queryParams.push(product_type);
  }

  if (work_id) {
    paramCount++;
    whereConditions.push(`p.work_id = ${paramCount}`);
    queryParams.push(work_id);
  }
  
  if (whereConditions.length > 0) {
    query += ` WHERE ${whereConditions.join(' AND ')}`;
  }
  
  query += `
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
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
