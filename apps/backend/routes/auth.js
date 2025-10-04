import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Google OAuth sign-in endpoint
router.post('/signin/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }
    
    console.log('Auth: Attempting Google OAuth signin');
    
    // Verify Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (verifyError) {
      console.error('Auth: Google token verification failed:', verifyError);
      return res.status(401).json({ error: 'Invalid Google ID token' });
    }
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    if (!email) {
      return res.status(400).json({ error: 'Email not provided by Google' });
    }
    
    console.log('Auth: Google OAuth verified for email:', email);
    
    // Check if user exists in Supabase
    const { data: existingUser } = await supabase.auth.admin.getUserById(googleId);
    
    let authData;
    
    if (existingUser?.user) {
      // User exists, create session
      console.log('Auth: Existing Google user found:', existingUser.user.id);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email
      });
      
      if (sessionError) {
        console.error('Auth: Session creation error:', sessionError);
        throw sessionError;
      }
      
      authData = {
        user: existingUser.user,
        session: sessionData.properties?.session
      };
    } else {
      // Create new user with Google OAuth
      console.log('Auth: Creating new Google user for email:', email);
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: {
          provider: 'google',
          google_id: googleId,
          name: name,
          picture: picture
        }
      });
      
      if (createError) {
        console.error('Auth: Google user creation error:', createError);
        throw createError;
      }
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email: email,
          role: 'user'
        });
      
      if (profileError && profileError.code !== '23505') {
        console.warn('Auth: Google profile creation warning:', profileError);
      }
      
      authData = newUser;
    }
    
    // Get user profile for response
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();
    
    console.log('Auth: Google signin successful for user:', authData.user.id);
    
    // For now, generate a JWT-like response (you might want to implement proper JWT)
    // Since this is for mobile app integration, we'll create a session token
    const sessionToken = Buffer.from(JSON.stringify({
      userId: authData.user.id,
      email: authData.user.email,
      provider: 'google',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    })).toString('base64');
    
    res.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile?.role || 'user'
      },
      access_token: sessionToken,
      refresh_token: sessionToken, // For simplicity, using same token
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    });
    
  } catch (error) {
    console.error('Auth: Google signin error:', error);
    res.status(500).json({ error: error.message || 'Google sign-in failed' });
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
    
    // Try to decode as base64 first (for Google OAuth tokens)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.userId && decoded.email) {
        // Check if token is expired
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          return res.status(401).json({ error: 'Token expired' });
        }
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', decoded.userId)
          .single();
        
        return res.json({
          user: {
            id: decoded.userId,
            email: decoded.email,
            role: profile?.role || 'user'
          }
        });
      }
    } catch (decodeError) {
      // Fall through to Supabase token verification
    }
    
    // Try Supabase token verification
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
    
    // For base64 tokens (Google OAuth), we just acknowledge the signout
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.userId) {
        console.log('Auth: Google OAuth user signed out successfully');
        return res.json({ message: 'Signed out successfully' });
      }
    } catch (decodeError) {
      // Fall through to Supabase signout
    }
    
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