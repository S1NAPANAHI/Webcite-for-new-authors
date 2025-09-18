import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,x-session-id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product_id, variant_id, quantity = 1 } = req.body;
    const sessionId = req.headers['x-session-id'];
    
    // Get user from token if available
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    if (!product_id || !variant_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'product_id and variant_id are required'
      });
    }

    // Check if product variant exists
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('*, products(*)')
      .eq('id', variant_id)
      .eq('product_id', product_id)
      .single();

    if (variantError || !variant) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'Product variant not found'
      });
    }

    // Get or create cart
    let cart;
    const cartQuery = supabase
      .from('carts')
      .select('*')
      .eq('status', 'active');
    
    if (userId) {
      cartQuery.eq('user_id', userId);
    } else {
      cartQuery.eq('session_id', sessionId);
    }

    const { data: existingCart } = await cartQuery.single();

    if (existingCart) {
      cart = existingCart;
    } else {
      // Create new cart
      const { data: newCart, error: cartError } = await supabase
        .from('carts')
        .insert({
          user_id: userId,
          session_id: sessionId,
          status: 'active',
          currency: 'usd'
        })
        .select()
        .single();

      if (cartError) {
        throw new Error('Failed to create cart');
      }
      cart = newCart;
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_variant_id', variant_id)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) {
        throw new Error('Failed to update cart item');
      }

      return res.json({
        success: true,
        cart_id: cart.id,
        item_updated: true,
        quantity: newQuantity
      });
    } else {
      // Add new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_variant_id: variant_id,
          quantity,
          unit_price: variant.price
        });

      if (insertError) {
        throw new Error('Failed to add item to cart');
      }

      return res.json({
        success: true,
        cart_id: cart.id,
        item_updated: false,
        quantity
      });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      error: 'Failed to add item to cart',
      message: error.message
    });
  }
}