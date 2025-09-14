const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.js');
const { supabaseAdmin } = require('../../../packages/shared/src/supabaseAdminClient.js');
const router = express.Router();

router.get(
  '/data',
  authenticate,
  authorize('ADMIN', ['manage_users']),
  async (req, res) => {
    const { data: users, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, role, privileges');

    if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Error fetching users' });
    }

    res.json({
        secret: 'Admin-only data',
        users: users
    });
  }
);

module.exports = router;
