import express from 'express';
// import { getAllUsers } from '../services/userService'; // Removed as it's unused

function createAdminRoutes(supabase: any) {
  const router = express.Router();

  // Test endpoint
  router.get('/test', async (_req: any, res: any) => {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .limit(5);

    if (error) return res.status(500).json({ error });
    return res.json({ message: 'Admin route works!', data });
  });

  // Add users endpoint
  router.get('/users', async (_req: any, res: any) => {
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
      const combinedUsers = authUsers.users.map((authUser: any) => {
        const userProfile = profiles.find((p: any) => p.id === authUser.id);
        const userSubscriptions = subscriptions.filter((s: any) => s.user_id === authUser.id);

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
      return res.json(combinedUsers);
    } catch (err: any) {
      console.error('❌ [Admin API] Error in GET /admin/users:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Orders management endpoints
  router.get('/orders', async (_req: any, res: any) => {
    try {
      const { limit = 20, offset = 0, status, search, dateFrom, dateTo } = _req.query;
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products ( name, description ),
            product_variants ( name, attributes )
          )
        `);

      if (status) query = query.eq('status', status);
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', dateTo);
      if (search) {
        query = query.or(`id.ilike.%${search}%,user_id.ilike.%${search}%,stripe_session_id.ilike.%${search}%`);
      }

      const { data: orders, error, count } = await query
        .order('created_at', { ascending: false })
        .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

      if (error) throw error;

      return res.json({
        orders: orders || [],
        pagination: { total: count, limit: parseInt(limit as string), offset: parseInt(offset as string) }
      });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Inventory management endpoints
  router.get('/inventory', async (_req: any, res: any) => {
    try {
      const { data: inventory, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products ( name, category )
        `);

      if (error) throw error;

      return res.json({ inventory: inventory || [] });
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/inventory/movements', async (_req: any, res: any) => {
    try {
      const { limit = 50 } = _req.query;
      
      const { data: movements, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          products ( name ),
          product_variants ( name )
        `)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit as string));

      if (error) throw error;

      return res.json({ movements: movements || [] });
    } catch (err: any) {
      console.error('Error fetching inventory movements:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/inventory/alerts', async (_req: any, res: any) => {
    try {
      const { data: alerts, error } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          products ( name ),
          product_variants ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.json({ alerts: alerts || [] });
    } catch (err: any) {
      console.error('Error fetching stock alerts:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Analytics endpoints
  router.get('/analytics/sales', async (_req: any, res: any) => {
    try {
      const { range = '30d' } = _req.query;
      
      // Calculate date range
      const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch sales metrics
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          total_amount,
          status,
          created_at,
          order_items (
            quantity,
            unit_price,
            products ( name ),
            product_variants ( name )
          )
        `)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const completedOrders = orders.filter((o: any) => o.status === 'completed');
      const totalRevenue = completedOrders.reduce((acc: any, o: any) => acc + o.total_amount, 0);
      const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

      // Group orders by status
      const ordersByStatus = orders.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      return res.json({
        totalRevenue,
        totalOrders: orders.length,
        averageOrderValue,
        conversionRate: 5.2, // Placeholder
        ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({ status, count })),
        topProducts: [], // TODO: Implement
        revenueOverTime: [], // TODO: Implement
        customerInsights: {
          newCustomers: 0, // TODO: Implement
          returningCustomers: 0, // TODO: Implement
          customerLifetimeValue: 0 // TODO: Implement
        }
      });
    } catch (err: any) {
      console.error('Error fetching sales analytics:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/analytics/inventory', async (_req: any, res: any) => {
    try {
      const { data: inventory, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products ( name, category )
        `);

      if (error) throw error;

      return res.json({ inventory: inventory || [] });
    } catch (err: any) {
      console.error('Error fetching inventory analytics:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Webhook management endpoints
  router.get('/webhooks/events', async (_req: any, res: any) => {
    try {
      const { limit = 50, offset = 0, eventType, status, search, dateFrom, dateTo } = _req.query;
      
      let query = supabase
        .from('webhook_events')
        .select('*');

      if (eventType) query = query.ilike('event_type', `%${eventType}%`);
      if (status === 'success') query = query.eq('success', true).eq('processed', true);
      if (status === 'failed') query = query.eq('success', false).eq('processed', true);
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', dateTo);
      if (search) {
        query = query.or(`stripe_event_id.ilike.%${search}%,event_type.ilike.%${search}%`);
      }

      const { data: events, error, count } = await query
        .order('created_at', { ascending: false })
        .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

      if (error) throw error;

      return res.json({
        events: events || [],
        pagination: { total: count, limit: parseInt(limit as string), offset: parseInt(offset as string) }
      });
    } catch (err: any) {
      console.error('Error fetching webhook events:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/webhooks/stats', async (_req: any, res: any) => {
    try {
      const { data: events, error } = await supabase
        .from('webhook_events')
        .select('event_type, processed, success, processing_time_ms, error_message, created_at');

      if (error) throw error;

      const totalEvents = events.length;
      const successfulEvents = events.filter((e: any) => e.processed && e.success).length;
      const failedEvents = events.filter((e: any) => e.processed && !e.success).length;
      const pendingEvents = events.filter((e: any) => !e.processed).length;
      
      const processedEvents = events.filter((e: any) => e.processed && e.processing_time_ms);
      const averageProcessingTime = processedEvents.length > 0 
        ? processedEvents.reduce((acc: any, e: any) => acc + e.processing_time_ms, 0) / processedEvents.length
        : 0;

      // Group by event type
      const eventsByType = events.reduce((acc: any, event: any) => {
        if (!acc[event.event_type]) {
          acc[event.event_type] = { total: 0, successful: 0 };
        }
        acc[event.event_type].total++;
        if (event.processed && event.success) {
          acc[event.event_type].successful++;
        }
        return acc;
      }, {});

      const eventTypeStats = Object.entries(eventsByType).map(([event_type, stats]: [string, any]) => ({
        event_type,
        count: stats.total,
        success_rate: stats.total > 0 ? (stats.successful / stats.total) * 100 : 0
      }));

      // Recent errors
      const recentErrors = events
        .filter((e: any) => e.processed && !e.success && e.error_message)
        .slice(0, 10)
        .map((e: any) => ({
          event_type: e.event_type,
          error_message: e.error_message,
          created_at: e.created_at
        }));

      return res.json({
        totalEvents,
        successfulEvents,
        failedEvents,
        pendingEvents,
        averageProcessingTime,
        eventsByType: eventTypeStats,
        recentErrors
      });
    } catch (err: any) {
      console.error('Error fetching webhook stats:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}

export default createAdminRoutes;
