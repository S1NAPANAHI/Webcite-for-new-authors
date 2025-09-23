import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';

const router = express.Router();

// Get all customers with their subscription and activity data
router.get('/customers', requireAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching customers for admin panel...');
    
    // Get all profiles with subscription information
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        email,
        role,
        subscription_status,
        subscription_type,
        stripe_customer_id,
        created_at,
        updated_at,
        last_active_at
      `)
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return res.status(500).json({ error: 'Failed to fetch customer data' });
    }

    // Get user statistics for each customer
    const customersWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        try {
          // Get user statistics
          const { data: userStats } = await supabaseAdmin
            .from('user_statistics')
            .select('total_reading_minutes, books_completed, chapters_read')
            .eq('user_id', profile.id)
            .single();

          // Get recent activity count (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const { count: recentActivityCount } = await supabaseAdmin
            .from('user_activities')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .gte('timestamp', thirtyDaysAgo.toISOString());

          return {
            ...profile,
            total_reading_minutes: userStats?.total_reading_minutes || 0,
            books_completed: userStats?.books_completed || 0,
            chapters_read: userStats?.chapters_read || 0,
            recent_activity_count: recentActivityCount || 0
          };
        } catch (error) {
          console.error(`Error fetching stats for user ${profile.id}:`, error);
          return {
            ...profile,
            total_reading_minutes: 0,
            books_completed: 0,
            chapters_read: 0,
            recent_activity_count: 0
          };
        }
      })
    );

    console.log(`✅ Successfully fetched ${customersWithStats.length} customers`);
    
    res.json({
      customers: customersWithStats,
      total_count: customersWithStats.length
    });

  } catch (error) {
    console.error('❌ Commerce customers API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific customer by ID
router.get('/customers/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👤 Fetching customer details for ID: ${id}`);

    // Get profile with all details
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        email,
        role,
        subscription_status,
        subscription_type,
        stripe_customer_id,
        created_at,
        updated_at,
        last_active_at
      `)
      .eq('id', id)
      .single();

    if (profileError) {
      console.error('❌ Error fetching profile:', profileError);
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get detailed user statistics
    const { data: userStats } = await supabaseAdmin
      .from('user_statistics')
      .select('*')
      .eq('user_id', id)
      .single();

    // Get recent orders
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get subscription details if they have one
    let subscriptionDetails = null;
    if (profile.stripe_customer_id) {
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('user_id', id)
        .eq('status', 'active')
        .single();
      
      subscriptionDetails = subscription;
    }

    const customerDetails = {
      ...profile,
      statistics: userStats || {
        total_reading_minutes: 0,
        books_completed: 0,
        chapters_read: 0,
        total_bookmarks: 0,
        total_notes: 0
      },
      recent_orders: orders || [],
      subscription_details: subscriptionDetails
    };

    console.log(`✅ Successfully fetched customer details for ${profile.username}`);
    res.json(customerDetails);

  } catch (error) {
    console.error('❌ Error fetching customer details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer role
router.put('/customers/:id/role', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    console.log(`🔧 Updating role for customer ${id} to: ${role}`);

    if (!['user', 'beta_user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating customer role:', error);
      return res.status(500).json({ error: 'Failed to update customer role' });
    }

    console.log(`✅ Successfully updated role for customer ${id}`);
    res.json({ success: true, customer: data });

  } catch (error) {
    console.error('❌ Error updating customer role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer subscription status (manual override)
router.put('/customers/:id/subscription', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription_status, subscription_type } = req.body;
    
    console.log(`💳 Updating subscription for customer ${id}:`, { subscription_status, subscription_type });

    const validStatuses = ['active', 'inactive', 'past_due', 'canceled', 'trial', 'incomplete'];
    const validTypes = ['free', 'premium_monthly', 'premium_annual', 'lifetime'];

    if (subscription_status && !validStatuses.includes(subscription_status)) {
      return res.status(400).json({ error: 'Invalid subscription status' });
    }

    if (subscription_type && !validTypes.includes(subscription_type)) {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (subscription_status) updateData.subscription_status = subscription_status;
    if (subscription_type) updateData.subscription_type = subscription_type;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating customer subscription:', error);
      return res.status(500).json({ error: 'Failed to update customer subscription' });
    }

    console.log(`✅ Successfully updated subscription for customer ${id}`);
    res.json({ success: true, customer: data });

  } catch (error) {
    console.error('❌ Error updating customer subscription:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;