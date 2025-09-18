const express = require('express');
const router = express.Router();
const userService = require('../services/userService'); // Path to the new service
const { supabase } = require('../supabaseClient'); // Assuming supabaseClient is available in backend

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const authUsers = await userService.listUsers();

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, role');
    if (profilesError) throw profilesError;

    // Fetch subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id, user_id, status, plan_id, current_period_start, current_period_end');
    if (subscriptionsError) throw subscriptionsError;

    const combinedUsers = authUsers.map(authUser => {
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

    res.json(combinedUsers);
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post('/', async (req, res, next) => {
  try {
    const { email, password, displayName, role } = req.body;
    const newUser = await userService.createUser(email, password, { user_role: role });

    // Insert into profiles table
    const { error: profileError } = await supabase.from('profiles').insert({
      id: newUser.id, // Use newUser.id as it's the auth.user ID
      display_name: displayName || null,
      role: role,
    });
    if (profileError) throw profileError;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Update user details
router.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { displayName, role } = req.body;

    // Update profile display name and role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ display_name: displayName || null, role: role })
      .eq('id', userId);
    if (profileError) throw profileError;

    // Update user role in auth.users app_metadata (optional, but good for consistency)
    const updatedAuthUser = await userService.updateUser(userId, { app_metadata: { user_role: role } });

    res.json(updatedAuthUser);
  } catch (error) {
    next(error);
  }
});

// Delete a user
router.delete('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;