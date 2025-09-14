const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../../../packages/shared/src/supabaseAdminClient.js');

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub; // Supabase JWTs use 'sub' for subject (user ID)

    if (!userId) {
        return res.status(401).json({ message: 'Invalid token: no user ID' });
    }

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('*, role, privileges')
      .eq('id', userId)
      .single();

    if (error || !user) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'User not found or error fetching profile.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
}

const RoleOrder = { user: 0, editor: 1, manager: 2, admin: 3, 'super_admin': 4 };

function authorize(requiredRole, requiredPrivileges = []) {
  return (req, res, next) => {
    const { role, privileges } = req.user;

    const userRole = role.toLowerCase();
    const reqRole = requiredRole.toLowerCase();

    if (RoleOrder[userRole] === undefined || RoleOrder[userRole] < RoleOrder[reqRole]) {
      return res.status(403).json({ message: 'Insufficient role' });
    }

    if(requiredPrivileges && requiredPrivileges.length > 0) {
        const userPrivileges = privileges || [];
        const hasAll = requiredPrivileges.every(p => userPrivileges.includes(p));
        if (!hasAll) {
            return res.status(403).json({ message: 'Missing privileges' });
        }
    }

    next();
  };
}

module.exports = {
    authenticate,
    authorize,
};
