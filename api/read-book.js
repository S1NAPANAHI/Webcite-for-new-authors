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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { file_key } = req.query;

  if (!file_key) {
    return res.status(400).json({ error: 'Missing file_key parameter.' });
  }

  // --- Authentication and Authorization ---
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    console.error('Authentication error:', userError);
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }

  const userId = userData.user.id;

  try {
    // 1. Get product_id associated with the file_key
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('file_key', file_key)
      .single();

    if (productError || !productData) {
      console.error('Product not found for file_key:', file_key, productError);
      return res.status(404).json({ error: 'Book not found.' });
    }

    const productId = productData.id;

    // 2. Check if user has purchased this product
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (purchaseError || !purchaseData) {
      console.error('User not entitled to this book:', userId, productId, purchaseError);
      return res.status(403).json({ error: 'Forbidden: User not entitled to this book.' });
    }

    // 3. Fetch the EPUB file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('epubs')
      .download(file_key);

    if (downloadError) {
      console.error('Supabase download error:', downloadError);
      return res.status(500).json({ error: 'Failed to download file from storage.', details: downloadError.message });
    }

    // Set headers for EPUB file download
    res.setHeader('Content-Type', 'application/epub+zip');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(file_key)}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Stream the file content
    res.send(fileData);

  } catch (error) {
    console.error('Error in read-book API:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
