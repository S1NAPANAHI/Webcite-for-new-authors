const express = require('express');
const { requireAdmin } = require('../middleware/requireAdmin.js');

const router = express.Router();

router.get('/stats', requireAdmin, (req, res) => {
  res.json({ message: 'Admin stats here' });
});

module.exports = router;
