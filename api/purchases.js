const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../apps/backend/.env') });
} catch (e) {
  require('dotenv').config();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { user_id, product_id, price_id, status = 'completed' } = req.body;

  if (!user_id || !product_id || !price_id) {
    return res.status(400).json({ error: 'Missing required fields: user_id, product_id, price_id.' });
  }

  try {
    // Check if the user already owns this product
    const { data: existingPurchase, error: existingPurchaseError } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (existingPurchaseError && existingPurchaseError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw existingPurchaseError;
    }

    if (existingPurchase) {
      return res.status(409).json({ message: 'User already owns this product.' });
    }

    // Insert new purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert([
        {
          user_id,
          product_id,
          price_id,
          status,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting purchase:', error);
      throw error;
    }

    res.status(201).json({ message: 'Product added to library successfully.', purchase: data[0] });

  } catch (error) {
    console.error('Error in purchases API:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
