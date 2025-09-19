import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia'
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const router = express.Router();

/**
 * Get comprehensive subscription status for authenticated user
 */
router.get('/status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log(`🔍 Fetching subscription status for user: ${user.id}`);

    // Use the comprehensive view we created
    const { data: subscriptionStatus, error: statusError } = await supabase
      .from('user_subscription_status')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statusError && statusError.code !== 'PGRST116') {
      console.error('Error fetching from user_subscription_status view:', statusError);
      // Fallback to direct profile query
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          subscription_status,
          subscription_tier,
          subscription_end_date,
          stripe_customer_id
        `)
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return res.status(500).json({ error: 'Failed to fetch user data' });
      }

      // Return basic profile data
      return res.json({
        user_id: user.id,
        email: user.email,
        subscription_status: profile.subscription_status || 'inactive',
        subscription_tier: profile.subscription_tier || 'free',
        subscription_end_date: profile.subscription_end_date,
        stripe_customer_id: profile.stripe_customer_id,
        is_subscribed: ['active', 'trialing'].includes(profile.subscription_status),
        has_premium_access: ['premium', 'patron'].includes(profile.subscription_tier),
        subscription_valid: profile.subscription_end_date ? new Date(profile.subscription_end_date) > new Date() : false
      });
    }

    // Calculate additional fields
    const daysRemaining = subscriptionStatus.subscription_end_date 
      ? Math.max(0, Math.ceil((new Date(subscriptionStatus.subscription_end_date) - new Date()) / (1000 * 60 * 60 * 24)))
      : null;

    // Get plan information
    let planInfo = null;
    if (subscriptionStatus.subscription_id) {
      try {
        // Try to get plan details from Stripe if we have subscription ID
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionStatus.subscription_id, {
          expand: ['items.data.price.product']
        });
        
        const price = stripeSubscription.items.data[0]?.price;
        if (price) {
          planInfo = {
            price_id: price.id,
            amount: price.unit_amount,
            currency: price.currency,
            interval: price.recurring?.interval,
            interval_count: price.recurring?.interval_count,
            product_name: price.product?.name
          };
        }
      } catch (stripeError) {
        console.error('Error fetching plan from Stripe:', stripeError);
      }
    }

    const response = {
      ...subscriptionStatus,
      days_remaining: daysRemaining,
      plan_info: planInfo,
      billing_cycle: planInfo ? `${planInfo.interval_count} ${planInfo.interval}${planInfo.interval_count > 1 ? 's' : ''}` : null
    };

    console.log(`✅ Subscription status retrieved for user ${user.id}`);
    res.json(response);

  } catch (error) {
    console.error('Error in subscription status endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

/**
 * Force refresh subscription status from Stripe
 */
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log(`🔄 Refreshing subscription for user: ${user.id}`);

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    let customerId = profile.stripe_customer_id;
    
    // If no customer ID, try to find customer by email
    if (!customerId) {
      console.log('No customer ID found, searching by email...');
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        
        // Update profile with customer ID
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);
          
        console.log(`Found and linked customer: ${customerId}`);
      }
    }

    if (!customerId) {
      return res.json({ 
        message: 'No Stripe customer found', 
        updated: true,
        subscription_status: 'inactive',
        subscription_tier: 'free'
      });
    }

    // Fetch active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10
    });

    console.log(`Found ${subscriptions.data.length} subscriptions for customer ${customerId}`);

    if (subscriptions.data.length > 0) {
      // Process the most recent active subscription
      const activeSubscription = subscriptions.data.find(s => 
        ['active', 'trialing', 'past_due'].includes(s.status)
      ) || subscriptions.data[0];
      
      console.log(`Processing subscription: ${activeSubscription.id} (${activeSubscription.status})`);
      
      const isActive = ['active', 'trialing'].includes(activeSubscription.status);
      
      // Determine tier based on price
      let tier = 'free';
      const price = activeSubscription.items.data[0]?.price;
      if (price && isActive) {
        // You'll need to map your actual price IDs to tiers
        const amount = price.unit_amount; // Amount in cents
        const interval = price.recurring?.interval;
        
        if (interval === 'month') {
          if (amount >= 1999) { // $19.99+ monthly
            tier = 'patron';
          } else if (amount >= 999) { // $9.99+ monthly
            tier = 'premium';
          }
        } else if (interval === 'year') {
          if (amount >= 19999) { // $199.99+ yearly
            tier = 'patron';
          } else if (amount >= 9999) { // $99.99+ yearly
            tier = 'premium';
          }
        }
      }
      
      const profileUpdate = {
        subscription_status: activeSubscription.status,
        subscription_tier: tier,
        subscription_end_date: activeSubscription.current_period_end ? 
          new Date(activeSubscription.current_period_end * 1000).toISOString() : null,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString()
      };

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return res.status(500).json({ error: 'Failed to update user profile' });
      }

      // Upsert subscription data
      try {
        await supabase
          .from('subscriptions')
          .upsert({
            id: activeSubscription.id,
            user_id: user.id,
            plan_id: activeSubscription.items.data[0].price.id,
            status: activeSubscription.status,
            current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: activeSubscription.cancel_at_period_end,
            trial_start: activeSubscription.trial_start ? new Date(activeSubscription.trial_start * 1000).toISOString() : null,
            trial_end: activeSubscription.trial_end ? new Date(activeSubscription.trial_end * 1000).toISOString() : null,
            canceled_at: activeSubscription.canceled_at ? new Date(activeSubscription.canceled_at * 1000).toISOString() : null,
            metadata: activeSubscription.metadata || {},
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
      } catch (subError) {
        console.warn('Could not store in subscriptions table:', subError.message);
      }
        
      console.log(`✅ Updated user profile: tier=${tier}, status=${activeSubscription.status}`);
      
      res.json({ 
        message: 'Subscription status refreshed successfully',
        updated: true,
        subscription_status: activeSubscription.status,
        subscription_tier: tier,
        current_period_end: activeSubscription.current_period_end,
        cancel_at_period_end: activeSubscription.cancel_at_period_end,
        days_remaining: activeSubscription.current_period_end ? 
          Math.max(0, Math.ceil((new Date(activeSubscription.current_period_end * 1000) - new Date()) / (1000 * 60 * 60 * 24))) : null
      });
    } else {
      // No subscriptions found, set to free
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'inactive',
          subscription_tier: 'free',
          subscription_end_date: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      console.log(`✅ Set user to free tier (no active subscriptions)`);
      
      res.json({ 
        message: 'No active subscriptions found, set to free tier',
        updated: true,
        subscription_status: 'inactive',
        subscription_tier: 'free'
      });
    }

  } catch (error) {
    console.error('Error refreshing subscription:', error);
    res.status(500).json({ error: 'Failed to refresh subscription status' });
  }
});

/**
 * Get billing information including invoices and payment history
 */
router.get('/billing', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.json({ 
        payment_method: null,
        invoices: [],
        upcoming_invoice: null
      });
    }

    try {
      // Get payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: profile.stripe_customer_id,
        type: 'card'
      });

      // Get recent invoices
      const invoices = await stripe.invoices.list({
        customer: profile.stripe_customer_id,
        limit: 10
      });

      // Get upcoming invoice
      let upcomingInvoice = null;
      try {
        upcomingInvoice = await stripe.invoices.retrieveUpcoming({
          customer: profile.stripe_customer_id
        });
      } catch (e) {
        // No upcoming invoice - that's fine
      }

      const response = {
        payment_method: paymentMethods.data[0] || null,
        invoices: invoices.data.map(invoice => ({
          id: invoice.id,
          amount_paid: invoice.amount_paid,
          amount_due: invoice.amount_due,
          currency: invoice.currency,
          status: invoice.status,
          created: invoice.created,
          period_start: invoice.period_start,
          period_end: invoice.period_end,
          hosted_invoice_url: invoice.hosted_invoice_url,
          invoice_pdf: invoice.invoice_pdf
        })),
        upcoming_invoice: upcomingInvoice ? {
          amount_due: upcomingInvoice.amount_due,
          currency: upcomingInvoice.currency,
          period_start: upcomingInvoice.period_start,
          period_end: upcomingInvoice.period_end
        } : null
      };

      res.json(response);
    } catch (stripeError) {
      console.error('Error fetching from Stripe:', stripeError);
      res.status(500).json({ error: 'Failed to fetch billing information' });
    }

  } catch (error) {
    console.error('Error in billing endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch billing information' });
  }
});

/**
 * Create billing portal session
 */
router.post('/billing-portal', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/account/subscription`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

/**
 * Cancel subscription
 */
router.post('/cancel', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .single();

    if (!subscription) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Cancel at period end in Stripe
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    // Update in database
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    res.json({ 
      message: 'Subscription will be canceled at the end of the current billing period',
      cancel_at_period_end: true,
      current_period_end: updatedSubscription.current_period_end
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * Get available subscription plans
 */
router.get('/plans', async (req, res) => {
  try {
    // Get active subscription plans from Stripe
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });

    // Filter for subscription products and format for frontend
    const subscriptionProducts = products.data
      .filter(product => product.default_price?.recurring)
      .map(product => {
        const price = product.default_price;
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price_id: price.id,
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring.interval,
          interval_count: price.recurring.interval_count,
          trial_period_days: price.recurring.trial_period_days || 0,
          features: product.metadata?.features ? JSON.parse(product.metadata.features) : []
        };
      });

    res.json({ plans: subscriptionProducts });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

export default router;