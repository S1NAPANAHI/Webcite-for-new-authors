import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';

const router = express.Router();

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // --- TEMPORARY CHECK FOR content_works TABLE ---
    const { data: contentWorksCheck, error: contentWorksError } = await supabaseAdmin
      .from('content_works')
      .select('id, title')
      .limit(5); // Limit to 5 to avoid large output

    if (contentWorksError) {
      console.error('TEMPORARY CHECK: Error accessing content_works table:', contentWorksError);
    } else {
      console.log('TEMPORARY CHECK: Successfully accessed content_works table. Sample data:', contentWorksCheck);
    }
    // --- END TEMPORARY CHECK ---

    // Get various metrics
    const [
      { count: totalUsers },
      { count: totalOrders },
      { count: totalEbooks },
      { count: betaAppsCount },
      { count: recentViews }
    ] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'), // Using products table instead of ebooks
      supabaseAdmin.from('beta_applications').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('user_activities') // Using user_activities instead of analytics_events
        .select('*', { count: 'exact', head: true })
        .eq('activity_type', 'page_view')
        .gte('timestamp', sevenDaysAgo.toISOString())
    ]);

    // Get revenue
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('total_amount') // Using total_amount instead of total_cents
      .eq('status', 'paid');

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    res.json({
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalEbooks: totalEbooks || 0,
      betaApplications: betaAppsCount || 0,
      totalRevenue: Math.round(totalRevenue / 100), // Assuming total_amount is in cents
      recentPageViews: recentViews || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics data for charts
router.get('/analytics/charts', requireAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      { data: blogViews },
      { data: chaptersRead },
      { data: betaApplications },
      { data: orders }
    ] = await Promise.all([
        supabaseAdmin.from('user_activities').select('timestamp::date as date, count(*)').eq('activity_type', 'page_view').gte('timestamp', startDate.toISOString()).group('date'),
        supabaseAdmin.from('user_activities').select('timestamp::date as date, count(*)').eq('activity_type', 'chapter_read').gte('timestamp', startDate.toISOString()).group('date'),
        supabaseAdmin.from('beta_applications').select('created_at::date as date, count(*)').gte('created_at', startDate.toISOString()).group('date'),
        supabaseAdmin.from('orders').select('created_at::date as date, count(*)').eq('status', 'paid').gte('created_at', startDate.toISOString()).group('date')
    ]);

    const formatChartData = (data) => {
        const chartData = {};
        data?.forEach(metric => {
            if (!chartData[metric.date]) {
                chartData[metric.date] = 0;
            }
            chartData[metric.date] += metric.count;
        });
        return Object.entries(chartData).map(([date, value]) => ({ date, value }));
    }

    res.json({
        blog_views: formatChartData(blogViews),
        chapters_read: formatChartData(chaptersRead),
        beta_applications: formatChartData(betaApplications),
        orders: formatChartData(orders)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
