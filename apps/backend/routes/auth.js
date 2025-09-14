const express = require('express');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../../../packages/shared/src/supabaseAdminClient.js');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // First, authenticate with Supabase
  const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return res.status(401).json({ message: authError?.message || 'Invalid credentials' });
  }

  // If auth is successful, fetch profile to get role and privileges
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role, privileges')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    return res.status(500).json({ message: 'Could not find user profile.' });
  }

  // Create a custom JWT
  const token = jwt.sign(
    {
        sub: profile.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    role: profile.role,
    privileges: profile.privileges
  });
});

module.exports = router;
