const express = require('express');
const router = express.Router();
const { supabase } = require('../../services/userService'); // Import supabase from userService

// GET all products and their prices
router.get('/', async (req, res) => {
  try {
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return res.status(500).json({ error: 'Failed to fetch products.' });
    }

    // Fetch all prices
    const { data: prices, error: pricesError } = await supabase
      .from('prices')
      .select('*');

    if (pricesError) {
      console.error('Error fetching prices:', pricesError);
      return res.status(500).json({ error: 'Failed to fetch prices.' });
    }

    // Combine products with their prices
    const plans = products.map(product => {
      const productPrices = prices.filter(price => price.product_id === product.id);
      return {
        ...product,
        prices: productPrices,
      };
    });

    res.json({ plans });
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/plans:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
