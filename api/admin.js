const path = require('path');
// Try to load .env from multiple locations
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../apps/backend/.env') });
} catch (e) {
  // Fallback for production
  require('dotenv').config();
}

const { createClient } = require('@supabase/supabase-js');
const express = require('express'); // Add express
const router = express.Router(); // Add router

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sales analytics endpoints
router.get('/analytics/sales', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(price))');

    if (error) throw error;

    const totalRevenue = orders.reduce((acc, order) => {
      return acc + order.order_items.reduce((itemAcc, item) => itemAcc + (item.quantity * item.products.price), 0);
    }, 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Group orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
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
  } catch (err) {
    console.error('Error fetching sales analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/inventory', async (req, res) => {
  try {
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products ( name, category )
      `);

    if (error) throw error;

    const totalProducts = inventory.length;
    const lowStockItems = inventory.filter((item) => item.available_quantity <= item.low_stock_threshold).length;
    const outOfStockItems = inventory.filter((item) => item.available_quantity === 0).length;

    res.json({
      totalProducts,
      lowStockItems,
      outOfStockItems,
      inventoryTurnover: 2.5, // Placeholder
      topMovingProducts: [], // TODO: Implement
      stockLevels: [] // TODO: Implement
    });
  } catch (err) {
    console.error('Error fetching inventory analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook management endpoints
router.get('/webhooks/events', async (req, res) => {
  try {
    const { limit = 50, offset = 0, eventType, status, search, dateFrom, dateTo } = req.query;

    let query = supabase
      .from('webhook_events')
      .select('*');

    if (eventType) query = query.ilike('event_type', `%${eventType}%`);
    if (status === 'success') query = query.eq('success', true).eq('processed', true);
    if (status === 'failed') query = query.eq('success', false).eq('processed', true);
    if (status === 'pending') query = query.eq('processed', false);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo);
    if (search) {
      query = query.or(`stripe_event_id.ilike.%${search}%,event_type.ilike.%${search}%`);
    }

    const { data: events, error, count } = await query
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    res.json({
      events: events || [],
      pagination: { total: count, limit: parseInt(limit), offset: parseInt(offset) }
    });
  } catch (err) {
    console.error('Error fetching webhook events:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/webhooks/stats', async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('webhook_events')
      .select('event_type, processed, success, processing_time_ms, error_message, created_at');

    if (error) throw error;

    const totalEvents = events.length;
    const successfulEvents = events.filter((e) => e.processed && e.success).length;
    const failedEvents = events.filter((e) => e.processed && !e.success).length;
    const pendingEvents = events.filter((e) => !e.processed).length;

    const processedEvents = events.filter((e) => e.processed && e.processing_time_ms);
    const averageProcessingTime = processedEvents.length > 0
      ? processedEvents.reduce((acc, e) => acc + e.processing_time_ms, 0) / processedEvents.length
      : 0;

    // Group by event type
    const eventsByType = events.reduce((acc, event) => {
      if (!acc[event.event_type]) {
        acc[event.event_type] = { total: 0, successful: 0 };
      }
      acc[event.event_type].total++;
      if (event.processed && event.success) {
        acc[event.event_type].successful++;
      }
      return acc;
    }, {});

    const eventTypeStats = Object.entries(eventsByType).map(([event_type, stats]) => ({
      event_type,
      count: stats.total,
      success_rate: stats.total > 0 ? (stats.successful / stats.total) * 100 : 0
    }));

    // Recent errors
    const recentErrors = events
      .filter((e) => e.processed && !e.success && e.error_message)
      .slice(0, 10)
      .map((e) => ({
        event_type: e.event_type,
        error_message: e.error_message,
        created_at: e.created_at
      }));

    res.json({
      totalEvents,
      successfulEvents,
      failedEvents,
      pendingEvents,
      averageProcessingTime,
      eventsByType: eventTypeStats,
      recentErrors
    });
  } catch (err) {
    console.error('Error fetching webhook stats:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; // Export the router
