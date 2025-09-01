const express = require('express');
const { getAllUsers } = require('../services/userService');

function createAdminRoutes(supabase) {
  const router = express.Router();

  router.get('/test', async (req, res) => {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .limit(5);

    if (error) return res.status(500).json({ error });
    res.json({ message: 'Admin route works!', data });
  });

  // Add users endpoint
  router.get('/users', async (req, res) => {
    try {
      console.log('🔍 [Admin API] Fetching all users...');
      
      // Get auth users from Supabase Auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error('❌ [Admin API] Auth error:', authError);
        throw authError;
      }

      console.log('✅ [Admin API] Got auth users:', authUsers.users?.length || 0);

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, role, subscription_status, subscription_tier, current_period_end');
      
      if (profilesError) {
        console.error('❌ [Admin API] Profiles error:', profilesError);
        throw profilesError;
      }

      console.log('✅ [Admin API] Got profiles:', profiles?.length || 0);

      // Fetch subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('id, user_id, status, plan_id, current_period_start, current_period_end');
      
      if (subscriptionsError) {
        console.error('❌ [Admin API] Subscriptions error:', subscriptionsError);
        throw subscriptionsError;
      }

      console.log('✅ [Admin API] Got subscriptions:', subscriptions?.length || 0);

      // Combine the data
      const combinedUsers = authUsers.users.map(authUser => {
        const userProfile = profiles.find(p => p.id === authUser.id);
        const userSubscriptions = subscriptions.filter(s => s.user_id === authUser.id);

        return {
          id: authUser.id,
          email: authUser.email,
          profile: {
            display_name: userProfile?.display_name || null,
            avatar_url: null
          },
          role: userProfile?.role || 'user',
          created_at: authUser.created_at,
          last_sign_in: authUser.last_sign_in_at,
          subscriptions: userSubscriptions
        };
      });

      console.log('✅ [Admin API] Combined users:', combinedUsers.length);
      res.json(combinedUsers);
    } catch (err) {
      console.error('❌ [Admin API] Error in GET /admin/users:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createAdminRoutes;