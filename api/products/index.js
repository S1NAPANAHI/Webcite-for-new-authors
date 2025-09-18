import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, limit = 20, offset = 0, featured } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_categories(name)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    // Filter by category if specified
    if (category) {
      query = query.eq('category_id', category);
    }

    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: products, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Format the response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      featured: product.featured,
      active: product.active,
      category: product.product_categories?.name,
      created_at: product.created_at,
      variants: product.product_variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: variant.price,
        sku: variant.sku,
        stock_quantity: variant.stock_quantity,
        active: variant.active
      })),
      // Get the minimum price from variants
      min_price: Math.min(...product.product_variants.map(v => v.price))
    }));

    res.json({
      products: formattedProducts,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: formattedProducts.length
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error.message
    });
  }
}