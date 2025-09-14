const { supabaseAdmin } = require('../../../packages/shared/src/supabaseAdminClient.js');

async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Malformed token' });
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
      return res.status(401).json({ error: error?.message || 'Invalid token' });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

  if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
  }

  // The user's plan specifies role 'admin'. The enum has 'admin' and 'super_admin'.
  // I will allow both.
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }

  req.user = { ...user, role: profile.role };
  return next();
}

module.exports = { requireAdmin };
