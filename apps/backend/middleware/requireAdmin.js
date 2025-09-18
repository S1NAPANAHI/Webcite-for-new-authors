import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';

async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('requireAdmin: No authorization token provided');
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('requireAdmin: Malformed token');
    return res.status(401).json({ error: 'Malformed token' });
  }

  console.log('requireAdmin: Token received:', token);
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
      console.log('requireAdmin: Supabase auth.getUser error:', error);
      console.log('requireAdmin: Supabase auth.getUser user:', user);
      return res.status(401).json({ error: error?.message || 'Invalid token' });
  }

  console.log('requireAdmin: User from token:', user);
  const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

  if (profileError || !profile) {
      console.log('requireAdmin: Profile fetch error:', profileError);
      console.log('requireAdmin: Profile fetched:', profile);
      return res.status(404).json({ error: 'User profile not found' });
  }

  console.log('requireAdmin: User profile role:', profile.role);
  // The user's plan specifies role 'admin'. The enum has 'admin' and 'super_admin'.
  // I will allow both.
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
      console.log('requireAdmin: Forbidden: Insufficient permissions. Role:', profile.role);
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }

  req.user = { ...user, role: profile.role };
  return next();
}

export { requireAdmin };
