import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sign up endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    console.log('Auth: Attempting signup for email:', email);
    
    // Create user in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData || {}
    });
    
    if (authError) {
      console.error('Auth: Supabase user creation error:', authError);
      throw authError;
    }
    
    console.log('Auth: User created successfully:', authData.user.id);
    
    // Create user profile if needed
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        role: 'user'
      })
      .select()
      .single();

    if (profileError && profileError.code !== '23505') { // 23505 is duplicate key error
      console.warn('Auth: Profile creation warning:', profileError);
    }
    
    console.log('Auth: Signup completed for user:', authData.user.id);
    
    res.json({ 
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile?.role || 'user'
      },
      access_token: authData.session?.access_token || '',
      refresh_token: authData.session?.refresh_token || '',
      expires_at: authData.session?.expires_at || 0
    });
  } catch (error) {
    console.error('Auth: Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Sign in endpoint  
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    console.log('Auth: Attempting signin for email:', email);
    
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error('Auth: Supabase signin error:', authError);
      throw authError;
    }
    
    console.log('Auth: Signin successful for user:', authData.user.id);
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();
    
    res.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile?.role || 'user'
      },
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at
    });
  } catch (error) {
    console.error('Auth: Signin error:', error);
    res.status(401).json({ error: error.message });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    console.log('Auth: Attempting token refresh');
    
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });
    
    if (error) {
      console.error('Auth: Token refresh error:', error);
      throw error;
    }
    
    console.log('Auth: Token refresh successful');
    
    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    });
  } catch (error) {
    console.error('Auth: Refresh token error:', error);
    res.status(401).json({ error: error.message });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Auth: Getting user info with token');
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth: Invalid token:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('Auth: User info retrieved for:', user.id);

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: profile?.role || 'user'
      }
    });
  } catch (error) {
    console.error('Auth: Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sign out endpoint
router.post('/signout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Auth: Signing out user');
    
    const { error } = await supabase.auth.admin.signOut(token);
    
    if (error) {
      console.warn('Auth: Signout warning:', error);
    }
    
    console.log('Auth: User signed out successfully');
    
    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Auth: Signout error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;