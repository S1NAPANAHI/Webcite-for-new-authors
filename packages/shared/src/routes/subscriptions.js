const express = require('express');
const { getRows, getRow, insert, update } = require('../database/connection');
const EntitlementService = require('../services/entitlementService');

const router = express.Router();

// Get all subscriptions (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, provider, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT s.*, 
             u.email as user_email,
             p.title as product_title,
             p.slug as product_slug,
             pr.amount_cents,
             pr.currency,
             pr.interval
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN prices pr ON s.plan_price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
    `;
    
    const whereConditions = [];
    const queryParams = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      whereConditions.push(`s.status = $${paramCount}`);
      queryParams.push(status);
    }
    
    if (provider) {
      paramCount++;
      whereConditions.push(`s.provider = $${paramCount}`);
      queryParams.push(provider);
    }
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    query += `
      ORDER BY s.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const subscriptions = await getRows(query, queryParams);
    
    res.json({
      subscriptions,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: subscriptions.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching subscriptions:', error);
    res.status(500).json({
      error: 'Failed to fetch subscriptions',
      message: error.message
    });
  }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscription = await getRow(`
      SELECT s.*, 
             u.email as user_email,
             p.title as product_title,
             p.slug as product_slug,
             p.description as product_description,
             pr.amount_cents,
             pr.currency,
             pr.interval,
             pr.trial_period_days
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN prices pr ON s.plan_price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE s.id = $1
    `, [id]);
    
    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'No subscription found with the specified ID'
      });
    }
    
    res.json({ subscription });
    
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription',
      message: error.message
    });
  }
});

// Get user's subscriptions
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT s.*, 
             p.title as product_title,
             p.slug as product_slug,
             p.cover_image_url,
             pr.amount_cents,
             pr.currency,
             pr.interval,
             pr.trial_period_days
      FROM subscriptions s
      LEFT JOIN prices pr ON s.plan_price_id = pr.id
      LEFT JOIN products p ON pr.product_id = p.id
      WHERE s.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;
    
    if (status) {
      paramCount++;
      query += ` AND s.status = $${paramCount}`;
      queryParams.push(status);
    }
    
    query += `
      ORDER BY s.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const subscriptions = await getRows(query, queryParams);
    
    res.json({
      subscriptions,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: subscriptions.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user subscriptions:', error);
    res.status(500).json({
      error: 'Failed to fetch user subscriptions',
      message: error.message
    });
  }
});

// Create new subscription
router.post('/', async (req, res) => {
  try {
    const { 
      user_id, 
      provider, 
      provider_subscription_id, 
      status = 'active',
      current_period_start,
      current_period_end,
      plan_price_id,
      metadata 
    } = req.body;
    
    if (!provider || !provider_subscription_id || !plan_price_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Provider, provider_subscription_id, and plan_price_id are required'
      });
    }
    
    const subscription = await insert(`
      INSERT INTO subscriptions (
        user_id, provider, provider_subscription_id, status,
        current_period_start, current_period_end, plan_price_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      user_id || null,
      provider,
      provider_subscription_id,
      status,
      current_period_start ? new Date(current_period_start) : null,
      current_period_end ? new Date(current_period_end) : null,
      plan_price_id,
      metadata || {}
    ]);
    
    // --- NEW LOGIC FOR ENTITLEMENTS ---
    if (subscription.status === 'active') {
      // Get product_id from price
      const price = await getRow('SELECT product_id FROM prices WHERE id = $1', [plan_price_id]);
      if (price && price.product_id) {
        // Get product_type from product
        const product = await getRow('SELECT id, product_type FROM products WHERE id = $1', [price.product_id]);
        if (product && product.product_type) {
          const worksToEntitle = await EntitlementService.getWorksForProduct(product.id, product.product_type);
          for (const work of worksToEntitle) {
            await EntitlementService.grantEntitlement(
              subscription.user_id,
              work.id,
              'subscription',
              subscription.id,
              subscription.current_period_end // Entitlement expires with subscription period
            );
          }
        } else {
          console.warn(`Product or product_type not found for price_id: ${plan_price_id}`);
        }
      } else {
        console.warn(`Product ID not found for price_id: ${plan_price_id}`);
      }
    }
    // --- END NEW LOGIC ---
    
    res.status(201).json({ subscription });
    
  } catch (error) {
    console.error('❌ Error creating subscription:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      message: error.message
    });
  }
});

// Update subscription
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      current_period_start, 
      current_period_end, 
      cancel_at_period_end,
      metadata 
    } = req.body;
    
    // Check if subscription exists
    const existingSubscription = await getRow('SELECT id, user_id, plan_price_id, status FROM subscriptions WHERE id = $1', [id]);
    if (!existingSubscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'No subscription found with the specified ID'
      });
    }
    
    const subscription = await update(`
      UPDATE subscriptions 
      SET status = COALESCE($1, status),
          current_period_start = COALESCE($2, current_period_start),
          current_period_end = COALESCE($3, current_period_end),
          cancel_at_period_end = COALESCE($4, cancel_at_period_end),
          metadata = COALESCE($5, metadata),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [
      status,
      current_period_start ? new Date(current_period_start) : null,
      current_period_end ? new Date(current_period_end) : null,
      cancel_at_period_end,
      metadata,
      id
    ]);
    
    // --- NEW LOGIC FOR ENTITLEMENTS ON UPDATE ---
    // If status changes to active, grant entitlements
    if (subscription.status === 'active' && existingSubscription.status !== 'active') {
      const price = await getRow('SELECT product_id FROM prices WHERE id = $1', [subscription.plan_price_id]);
      if (price && price.product_id) {
        const product = await getRow('SELECT id, product_type FROM products WHERE id = $1', [price.product_id]);
        if (product && product.product_type) {
          const worksToEntitle = await EntitlementService.getWorksForProduct(product.id, product.product_type);
          for (const work of worksToEntitle) {
            await EntitlementService.grantEntitlement(
              subscription.user_id,
              work.id,
              'subscription',
              subscription.id,
              subscription.current_period_end
            );
          }
        }
      }
    }
    // If status changes from active to anything else (e.g., canceled, past_due), revoke entitlements
    else if (existingSubscription.status === 'active' && subscription.status !== 'active') {
      // For simplicity, we'll revoke all entitlements associated with this subscription.
      // A more sophisticated approach might involve checking if the user has other active subscriptions
      // that still grant access to the same works.
      const userEntitlements = await EntitlementService.getUserEntitlements(subscription.user_id);
      for (const entitlement of userEntitlements) {
        if (entitlement.source_id === subscription.id) { // Only revoke entitlements granted by this specific subscription
          await EntitlementService.revokeEntitlement(entitlement.user_id, entitlement.work_id);
        }
      }
    }
    // --- END NEW LOGIC ---
    
    res.json({ subscription });
    
  } catch (error) {
    console.error('❌ Error updating subscription:', error);
    res.status(500).json({
      error: 'Failed to update subscription',
      message: error.message
    });
  }
});

// Cancel subscription
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancel_at_period_end = true } = req.body;
    
    // Check if subscription exists
    const existingSubscription = await getRow('SELECT id FROM subscriptions WHERE id = $1', [id]);
    if (!existingSubscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'No subscription found with the specified ID'
      });
    }
    
    const subscription = await update(`
      UPDATE subscriptions 
      SET cancel_at_period_end = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [cancel_at_period_end, id]);
    
    res.json({ 
      subscription,
      message: cancel_at_period_end 
        ? 'Subscription will be canceled at the end of the current period'
        : 'Subscription cancellation has been reversed'
    });
    
  } catch (error) {
    console.error('❌ Error canceling subscription:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      message: error.message
    });
  }
});

// Reactivate subscription
router.post('/:id/reactivate', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if subscription exists
    const existingSubscription = await getRow('SELECT id FROM subscriptions WHERE id = $1', [id]);
    if (!existingSubscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'No subscription found with the specified ID'
      });
    }
    
    const subscription = await update(`
      UPDATE subscriptions 
      SET cancel_at_period_end = false,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    res.json({ 
      subscription,
      message: 'Subscription has been reactivated'
    });
    
  } catch (error) {
    console.error('❌ Error reactivating subscription:', error);
    res.status(500).json({
      error: 'Failed to reactivate subscription',
      message: error.message
    });
  }
});

// Get subscription analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const queryParams = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
      queryParams.push(start_date, end_date);
    }
    
    // Total subscriptions and revenue
    const summary = await getRow(`
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceled_subscriptions,
        COUNT(CASE WHEN status = 'past_due' THEN 1 END) as past_due_subscriptions,
        COUNT(CASE WHEN cancel_at_period_end = true THEN 1 END) as pending_cancellations
      FROM subscriptions
      ${dateFilter}
    `, queryParams);
    
    // Subscriptions by status
    const statusBreakdown = await getRows(`
      SELECT status, COUNT(*) as count
      FROM subscriptions
      ${dateFilter}
      GROUP BY status
      ORDER BY count DESC
    `, queryParams);
    
    // Subscriptions by provider
    const providerBreakdown = await getRows(`
      SELECT provider, COUNT(*) as count
      FROM subscriptions
      ${dateFilter}
      GROUP BY provider
      ORDER BY count DESC
    `, queryParams);
    
    // Monthly recurring revenue (MRR) calculation
    const mrr = await getRow(`
      SELECT 
        SUM(pr.amount_cents) as total_mrr_cents
      FROM subscriptions s
      LEFT JOIN prices pr ON s.plan_price_id = pr.id
      WHERE s.status = 'active' 
        AND pr.interval = 'month'
        ${dateFilter ? 'AND s.created_at BETWEEN $1 AND $2' : ''}
    `, queryParams);
    
    res.json({
      summary: {
        totalSubscriptions: parseInt(summary.total_subscriptions),
        activeSubscriptions: parseInt(summary.active_subscriptions),
        canceledSubscriptions: parseInt(summary.canceled_subscriptions),
        pastDueSubscriptions: parseInt(summary.past_due_subscriptions),
        pendingCancellations: parseInt(summary.pending_cancellations)
      },
      statusBreakdown,
      providerBreakdown,
      mrr: {
        totalMrrCents: parseInt(mrr.total_mrr_cents || 0),
        totalMrr: (parseInt(mrr.total_mrr_cents || 0) / 100).toFixed(2)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching subscription analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription analytics',
      message: error.message
    });
  }
});

// Get subscription metrics for dashboard
router.get('/analytics/metrics', async (req, res) => {
  try {
    // Current month metrics
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // New subscriptions this month
    const newSubscriptions = await getRow(`
      SELECT COUNT(*) as count
      FROM subscriptions
      WHERE created_at BETWEEN $1 AND $2
    `, [firstDayOfMonth, lastDayOfMonth]);
    
    // Churned subscriptions this month
    const churnedSubscriptions = await getRow(`
      SELECT COUNT(*) as count
      FROM subscriptions
      WHERE status = 'canceled' 
        AND updated_at BETWEEN $1 AND $2
    `, [firstDayOfMonth, lastDayOfMonth]);
    
    // Active subscriptions
    const activeSubscriptions = await getRow(`
      SELECT COUNT(*) as count
      FROM subscriptions
      WHERE status = 'active'
    `);
    
    // Trial subscriptions
    const trialSubscriptions = await getRow(`
      SELECT COUNT(*) as count
      FROM subscriptions s
      LEFT JOIN prices pr ON s.plan_price_id = pr.id
      WHERE s.status = 'active' 
        AND pr.trial_period_days > 0
        AND s.current_period_start > NOW() - INTERVAL '30 days'
    `);
    
    res.json({
      currentMonth: {
        newSubscriptions: parseInt(newSubscriptions.count),
        churnedSubscriptions: parseInt(churnedSubscriptions.count),
        netGrowth: parseInt(newSubscriptions.count) - parseInt(churnedSubscriptions.count)
      },
      overall: {
        activeSubscriptions: parseInt(activeSubscriptions.count),
        trialSubscriptions: parseInt(trialSubscriptions.count)
      },
      churnRate: activeSubscriptions.count > 0 
        ? ((churnedSubscriptions.count / activeSubscriptions.count) * 100).toFixed(2)
        : 0
    });
    
  } catch (error) {
    console.error('❌ Error fetching subscription metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription metrics',
      message: error.message
    });
  }
});

module.exports = router;
