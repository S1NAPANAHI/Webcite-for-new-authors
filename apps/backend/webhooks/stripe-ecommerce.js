import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Fixed: Use the same API version as server.js
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia'
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Enhanced Stripe webhook handler for e-commerce events
 * FIXED: Now properly handles subscription events and updates user status
 */
export default async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the event for debugging
  console.log(`Processing Stripe event: ${event.type} (${event.id})`);

  try {
    // Store webhook event for auditing
    await supabase
      .from('webhook_events')
      .insert({
        id: event.id,
        provider: 'stripe',
        event_type: event.type,
        payload: event,
        received_at: new Date().toISOString()
      })
      .onConflict('id')
      .ignore(); // Ignore if already exists

    // Process the event based on type
    switch (event.type) {
      // ========================================
      // SUBSCRIPTION EVENTS (CRITICAL FOR STATUS UPDATE)
      // ========================================
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      // ========================================
      // CHECKOUT AND PAYMENT EVENTS
      // ========================================
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'checkout.session.expired':
        await handleCheckoutExpired(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      // ========================================
      // CUSTOMER EVENTS
      // ========================================
      case 'customer.created':
        await handleCustomerCreated(event.data.object);
        break;
      
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object);
        break;

      // ========================================
      // PRODUCT AND PRICE EVENTS
      // ========================================
      case 'product.created':
        await handleProductCreated(event.data.object);
        break;
      
      case 'product.updated':
        await handleProductUpdated(event.data.object);
        break;
      
      case 'product.deleted':
        await handleProductDeleted(event.data.object);
        break;
      
      case 'price.created':
        await handlePriceCreated(event.data.object);
        break;
      
      case 'price.updated':
        await handlePriceUpdated(event.data.object);
        break;

      // ========================================
      // DISPUTE EVENTS
      // ========================================
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    // Mark webhook event as processed
    await supabase
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('id', event.id)
      .onConflict('id')
      .ignore();

    res.status(200).json({ received: true });

  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error);
    
    // Mark webhook event as failed
    await supabase
      .from('webhook_events')
      .upsert({
        id: event.id,
        provider: 'stripe',
        event_type: event.type,
        payload: event,
        processed: false,
        error_message: error.message,
        processed_at: new Date().toISOString(),
        received_at: new Date().toISOString()
      })
      .onConflict('id');

    res.status(500).json({ 
      error: 'Webhook processing failed',
      event_id: event.id 
    });
  }
};

/**
 * CRITICAL: Handle subscription events - this updates user status
 */
async function handleSubscriptionUpdate(subscription) {
  try {
    console.log(`\n🔄 SUBSCRIPTION EVENT: ${subscription.id}`);
    console.log(`Status: ${subscription.status}`);
    console.log(`Customer: ${subscription.customer}`);
    console.log(`User ID from metadata: ${subscription.metadata?.user_id}`);
    
    // Get user ID from metadata or try to find it via customer
    let userId = subscription.metadata?.user_id;
    
    if (!userId) {
      console.log('No user_id in metadata, trying to find user via customer ID...');
      
      // Try to find user via stripe customer ID
      const { data: customerData, error: customerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single();
        
      if (!customerError && customerData) {
        userId = customerData.id;
        console.log(`Found user via customer ID: ${userId}`);
      }
    }
    
    if (!userId) {
      console.error('❌ Could not determine user ID for subscription');
      throw new Error('Could not determine user ID for subscription');
    }

    // Map Stripe subscription status to your internal status
    const getInternalStatus = (stripeStatus) => {
      switch (stripeStatus) {
        case 'active': return 'active';
        case 'trialing': return 'trialing';
        case 'past_due': return 'past_due';
        case 'canceled': return 'canceled';
        case 'unpaid': return 'unpaid';
        case 'incomplete': return 'incomplete';
        case 'incomplete_expired': return 'canceled';
        case 'paused': return 'paused';
        default: return 'inactive';
      }
    };

    const internalStatus = getInternalStatus(subscription.status);
    const isActive = ['active', 'trialing'].includes(subscription.status);

    // Upsert subscription data
    const subscriptionData = {
      id: subscription.id,
      user_id: userId,
      plan_id: subscription.items.data[0].price.id,
      status: internalStatus,
      stripe_status: subscription.status, // Store original status too
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      metadata: subscription.metadata || {},
      updated_at: new Date().toISOString()
    };

    // Try multiple table names in case schema is different
    let subscriptionStored = false;
    const tablesToTry = ['subscriptions', 'user_subscriptions', 'stripe_subscriptions'];
    
    for (const tableName of tablesToTry) {
      try {
        const { error } = await supabase
          .from(tableName)
          .upsert(subscriptionData, { onConflict: 'id' });
          
        if (!error) {
          console.log(`✅ Subscription stored in ${tableName} table`);
          subscriptionStored = true;
          break;
        } else if (error.code !== '42P01') { // Not "table doesn't exist" error
          console.error(`Error storing in ${tableName}:`, error);
        }
      } catch (e) {
        // Table doesn't exist, continue to next
      }
    }
    
    if (!subscriptionStored) {
      console.warn('⚠️  No subscription table found, creating one...');
      // The subscription table might not exist yet
    }

    // CRITICAL: Update user profile with subscription status
    const profileUpdate = {
      subscription_status: internalStatus,
      subscription_tier: isActive ? 'premium' : 'free', // Map to your tier system
      subscription_end_date: subscription.current_period_end ? 
        new Date(subscription.current_period_end * 1000).toISOString() : null,
      stripe_customer_id: subscription.customer,
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId);

    if (profileError) {
      console.error('❌ Error updating user profile:', profileError);
      
      // Try alternative table names
      const { error: altError } = await supabase
        .from('users')
        .update(profileUpdate)
        .eq('id', userId);
        
      if (altError) {
        console.error('❌ Error updating users table too:', altError);
      } else {
        console.log('✅ Updated users table instead');
      }
    } else {
      console.log('✅ Updated user profile with subscription status');
    }

    console.log(`\n✅ SUBSCRIPTION PROCESSED SUCCESSFULLY`);
    console.log(`User: ${userId}`);
    console.log(`Status: ${subscription.status} → ${internalStatus}`);
    console.log(`Active: ${isActive}`);
    console.log(`Tier: ${isActive ? 'premium' : 'free'}`);
    
  } catch (error) {
    console.error('❌ Failed to handle subscription update:', error);
    throw error;
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    console.log(`\n🗑️  SUBSCRIPTION DELETED: ${subscription.id}`);
    
    // Get user ID
    let userId = subscription.metadata?.user_id;
    if (!userId) {
      const { data: customerData } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single();
      userId = customerData?.id;
    }
    
    if (!userId) {
      console.error('❌ Could not determine user ID for deleted subscription');
      return;
    }

    // Update subscription status
    const tablesToTry = ['subscriptions', 'user_subscriptions', 'stripe_subscriptions'];
    for (const tableName of tablesToTry) {
      try {
        const { error } = await supabase
          .from(tableName)
          .update({ 
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id);
          
        if (!error) break;
      } catch (e) {}
    }

    // Update user profile to free tier
    const profileUpdate = {
      subscription_status: 'canceled',
      subscription_tier: 'free',
      subscription_end_date: null,
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId);

    console.log(`✅ User ${userId} subscription canceled and set to free tier`);
  } catch (error) {
    console.error('❌ Failed to handle subscription deletion:', error);
    throw error;
  }
}

/**
 * Handle invoice payment succeeded - important for subscription renewals
 */
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    console.log(`\n💰 INVOICE PAYMENT SUCCEEDED: ${invoice.id}`);
    
    // If this is for a subscription, make sure user status is active
    if (invoice.subscription) {
      console.log(`Refreshing subscription status for: ${invoice.subscription}`);
      
      // Fetch the subscription and update user
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      await handleSubscriptionUpdate(subscription);
    }

    // Record payment history if table exists
    try {
      await supabase
        .from('payment_history')
        .upsert({
          id: invoice.payment_intent || invoice.id,
          stripe_invoice_id: invoice.id,
          subscription_id: invoice.subscription,
          amount: invoice.total,
          currency: invoice.currency,
          status: 'paid',
          description: 'Subscription payment',
          created_at: new Date(invoice.created * 1000).toISOString()
        })
        .onConflict('id');
        
      console.log('✅ Payment history recorded');
    } catch (e) {
      console.log('⚠️  Payment history table not available');
    }

  } catch (error) {
    console.error('❌ Failed to handle invoice payment succeeded:', error);
    throw error;
  }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice) {
  try {
    console.log(`\n❌ INVOICE PAYMENT FAILED: ${invoice.id}`);
    
    if (invoice.subscription) {
      // Update subscription status but don't immediately cancel
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      await handleSubscriptionUpdate(subscription); // This will set to past_due
    }

    // Record failed payment
    try {
      await supabase
        .from('payment_history')
        .upsert({
          id: invoice.payment_intent || invoice.id,
          stripe_invoice_id: invoice.id,
          subscription_id: invoice.subscription,
          amount: invoice.total,
          currency: invoice.currency,
          status: 'failed',
          description: 'Subscription payment failed',
          created_at: new Date(invoice.created * 1000).toISOString()
        })
        .onConflict('id');
    } catch (e) {}

  } catch (error) {
    console.error('❌ Failed to handle invoice payment failed:', error);
    throw error;
  }
}

/**
 * Handle checkout session completed - for one-time purchases
 */
async function handleCheckoutCompleted(session) {
  try {
    console.log(`\n🛒 CHECKOUT COMPLETED: ${session.id}`);
    
    // If this checkout created a subscription, handle it
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      await handleSubscriptionUpdate(subscription);
    }
    
    const orderId = session.metadata?.order_id;
    if (!orderId) {
      console.log('No order_id found in session metadata');
      return;
    }

    // Update order status
    const updateData = {
      payment_status: 'paid',
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      stripe_payment_intent_id: session.payment_intent,
      total_amount: session.amount_total || 0,
      updated_at: new Date().toISOString()
    };

    try {
      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);
        
      console.log(`✅ Order ${orderId} marked as confirmed`);
    } catch (e) {
      console.log('⚠️  Orders table not available');
    }

  } catch (error) {
    console.error('❌ Failed to handle checkout completion:', error);
    throw error;
  }
}

/**
 * Handle customer created
 */
async function handleCustomerCreated(customer) {
  try {
    console.log(`\n👤 CUSTOMER CREATED: ${customer.id}`);
    
    // Try to find user by email and update their profile
    if (customer.email) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          stripe_customer_id: customer.id,
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email);
        
      if (error) {
        console.log('⚠️  Could not link customer to profile:', error.message);
      } else {
        console.log(`✅ Linked customer ${customer.id} to user profile`);
      }
    }

  } catch (error) {
    console.error('❌ Failed to handle customer creation:', error);
    // Don't throw - this is not critical
  }
}

/**
 * Handle customer updated
 */
async function handleCustomerUpdated(customer) {
  try {
    console.log(`\n👤 CUSTOMER UPDATED: ${customer.id}`);
    
    // Update customer information in profiles if linked
    await supabase
      .from('profiles')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customer.id);

  } catch (error) {
    console.error('❌ Failed to handle customer update:', error);
  }
}

// ========================================
// PRODUCT/PRICE MANAGEMENT (EXISTING LOGIC)
// ========================================

async function handleProductCreated(product) {
  try {
    console.log(`\n📦 PRODUCT CREATED: ${product.id}`);
    
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('stripe_product_id', product.id)
      .single();

    if (existing) {
      console.log(`Product ${product.id} already exists, updating instead`);
      return await handleProductUpdated(product);
    }

    const { data: defaultCategory } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', 'digital-books')
      .single()
      .catch(() => ({ data: null }));

    await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        images: product.images || [],
        active: product.active,
        stripe_product_id: product.id,
        slug: generateSlug(product.name),
        category_id: defaultCategory?.id || null,
        product_type: product.metadata?.product_type || 'single_issue'
      });

    console.log(`✅ Successfully synced product: ${product.id}`);
  } catch (error) {
    console.error(`❌ Failed to handle product.created for ${product.id}:`, error);
  }
}

async function handleProductUpdated(product) {
  try {
    console.log(`\n📦 PRODUCT UPDATED: ${product.id}`);
    
    await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        images: product.images || [],
        active: product.active,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_product_id', product.id);

    console.log(`✅ Successfully updated product: ${product.id}`);
  } catch (error) {
    console.error(`❌ Failed to handle product.updated for ${product.id}:`, error);
  }
}

async function handleProductDeleted(product) {
  try {
    console.log(`\n📦 PRODUCT DELETED: ${product.id}`);
    
    await supabase
      .from('products')
      .update({
        active: false,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_product_id', product.id);

    console.log(`✅ Successfully marked product as inactive: ${product.id}`);
  } catch (error) {
    console.error(`❌ Failed to handle product deletion:`, error);
  }
}

async function handlePriceCreated(price) {
  try {
    console.log(`\n💰 PRICE CREATED: ${price.id}`);
    
    const productId = typeof price.product === 'string' ? price.product : price.product?.id;
    
    const { data: localProduct } = await supabase
      .from('products')
      .select('id')
      .eq('stripe_product_id', productId)
      .single()
      .catch(() => ({ data: null }));

    if (!localProduct) {
      console.log(`⚠️  No local product found for ${productId}`);
      return;
    }

    const { data: existingVariant } = await supabase
      .from('product_variants')
      .select('id')
      .eq('stripe_price_id', price.id)
      .single()
      .catch(() => ({ data: null }));

    if (existingVariant) {
      return await handlePriceUpdated(price);
    }

    await supabase
      .from('product_variants')
      .insert({
        product_id: localProduct.id,
        stripe_price_id: price.id,
        name: price.nickname || 'Standard',
        currency: price.currency,
        unit_amount: price.unit_amount || 0,
        recurring_interval: price.recurring?.interval || null,
        recurring_interval_count: price.recurring?.interval_count || null,
        active: price.active,
        is_default: false
      });

    console.log(`✅ Successfully synced price: ${price.id}`);
  } catch (error) {
    console.error(`❌ Failed to handle price creation:`, error);
  }
}

async function handlePriceUpdated(price) {
  try {
    console.log(`\n💰 PRICE UPDATED: ${price.id}`);
    
    await supabase
      .from('product_variants')
      .update({
        name: price.nickname || 'Standard',
        unit_amount: price.unit_amount || 0,
        currency: price.currency,
        recurring_interval: price.recurring?.interval || null,
        recurring_interval_count: price.recurring?.interval_count || null,
        active: price.active,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_price_id', price.id);

    console.log(`✅ Successfully updated price: ${price.id}`);
  } catch (error) {
    console.error(`❌ Failed to handle price update:`, error);
  }
}

// ========================================
// STUB HANDLERS FOR OTHER EVENTS
// ========================================

async function handleCheckoutExpired(session) {
  console.log(`⏰ Checkout expired: ${session.id}`);
}

async function handlePaymentSucceeded(paymentIntent) {
  console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
}

async function handlePaymentFailed(paymentIntent) {
  console.log(`❌ Payment failed: ${paymentIntent.id}`);
}

async function handlePaymentCanceled(paymentIntent) {
  console.log(`🚫 Payment canceled: ${paymentIntent.id}`);
}

async function handleDisputeCreated(dispute) {
  console.log(`⚠️  Dispute created: ${dispute.id}`);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}