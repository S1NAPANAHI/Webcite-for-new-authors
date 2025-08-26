const express = require('express');
const { getAllUsers } = require('../../services/userService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('❌ Error in GET /admin/users:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;