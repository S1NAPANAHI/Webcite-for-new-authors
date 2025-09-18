import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,x-session-id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return await getCart(req, res);
  } else if (req.method === 'DELETE') {
    return await clearCart(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getCart(req, res) {
  try {
    const sessionId = req.headers['x-session-id'];
    
    // Get user from token if available
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Find active cart
    const cartQuery = supabase
      .from('carts')
      .select(`
        *,
        cart_items(
          *,
          product_variants(
            *,
            products(*)
          )
        )
      `)
      .eq('status', 'active');
    
    if (userId) {
      cartQuery.eq('user_id', userId);
    } else {
      cartQuery.eq('session_id', sessionId);
    }

    const { data: cart } = await cartQuery.single();

    if (!cart) {
      return res.json({
        cart_id: null,
        items: [],
        subtotal: 0,
        item_count: 0,
        currency: 'usd'
      });
    }

    // Calculate totals
    const items = cart.cart_items || [];
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.unit_price * item.quantity);
    }, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      cart_id: cart.id,
      items: items.map(item => ({
        id: item.id,
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        product: {
          id: item.product_variants.products.id,
          name: item.product_variants.products.name,
          description: item.product_variants.products.description,
          image_url: item.product_variants.products.image_url
        },
        variant: {
          id: item.product_variants.id,
          name: item.product_variants.name,
          price: item.product_variants.price,
          sku: item.product_variants.sku
        }
      })),
      subtotal,
      item_count: itemCount,
      currency: cart.currency || 'usd'
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      error: 'Failed to fetch cart',
      message: error.message
    });
  }
}

async function clearCart(req, res) {
  try {
    const sessionId = req.headers['x-session-id'];
    
    // Get user from token if available
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Find active cart
    const cartQuery = supabase
      .from('carts')
      .select('*')
      .eq('status', 'active');
    
    if (userId) {
      cartQuery.eq('user_id', userId);
    } else {
      cartQuery.eq('session_id', sessionId);
    }

    const { data: cart } = await cartQuery.single();

    if (cart) {
      // Delete all cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);

      // Update cart status to cleared or delete it
      await supabase
        .from('carts')
        .delete()
        .eq('id', cart.id);
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      error: 'Failed to clear cart',
      message: error.message
    });
  }
}