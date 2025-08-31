module.exports = async function handler(req, res) {
  res.json({ 
    message: 'Zoroasterverse API is running!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      admin: '/api/admin'
    }
  });
};
