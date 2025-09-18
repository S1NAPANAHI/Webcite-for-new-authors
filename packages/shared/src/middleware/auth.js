const { supabase } = require('../services/userService'); // Import supabase from userService

const authenticateAdmin = async (req, res, next) => {
  console.log('authenticateAdmin middleware called for:', req.originalUrl);
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received token:', token ? 'Token present' : 'No token'); // Add this line

    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    // Verify the token using the service role key
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('Supabase getUser result - user:', user ? 'User found' : 'No user', 'error:', authError); // Add this line

    if (authError || !user) {
      console.error('Authentication error:', authError?.message || 'User not found.');
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    // Check if user is an admin from the user_roles table
    const { data: adminUserRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .in('role', ['admin', 'super_admin']) // Assuming 'admin' and 'super_admin' are admin roles
      .single();
    console.log('Supabase role check result - adminUserRole:', adminUserRole ? 'Role found' : 'No role', 'error:', roleError); // Add this line

    if (roleError || !adminUserRole) {
      console.error('Authorization error:', roleError?.message || 'User does not have admin role.');
      return res.status(403).json({ error: 'Access denied: Not an admin.' });
    }

    req.user = user;
    req.adminUserRole = adminUserRole; // Attach the admin role details
    next();
  } catch (error) {
    console.error('Unexpected error in authenticateAdmin middleware:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

module.exports = authenticateAdmin;
