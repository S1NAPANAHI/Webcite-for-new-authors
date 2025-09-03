const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia'
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Enhanced Stripe webhook handler for e-commerce events
 */
module.exports = async function handleStripeWebhook(req, res) {
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
      });

    // Process the event based on type
    switch (event.type) {
      // Product and Price Management Events
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

      // Checkout and Payment Events
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

      // Invoice Events (for subscriptions and one-time payments)
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      // Customer Events
      case 'customer.created':
        await handleCustomerCreated(event.data.object);
        break;
      
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object);
        break;

      // Subscription Events (existing functionality)
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      // Dispute and Chargeback Events
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
      .eq('id', event.id);

    res.status(200).json({ received: true });

  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error);
    
    // Mark webhook event as failed
    await supabase
      .from('webhook_events')
      .update({
        processed: false,
        error_message: error.message,
        processed_at: new Date().toISOString()
      })
      .eq('id', event.id);

    res.status(500).json({ 
      error: 'Webhook processing failed',
      event_id: event.id 
    });
  }
};

/**
 * Handle product created in Stripe
 */
async function handleProductCreated(product) {
  try {
    console.log(`Syncing new Stripe product: ${product.id}`);
    
    // Check if product already exists (shouldn't happen, but defensive)
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('stripe_product_id', product.id)
      .single();

    if (existing) {
      console.log(`Product ${product.id} already exists, updating instead`);
      return await handleProductUpdated(product);
    }

    // Get default category for imported products
    const { data: defaultCategory } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', 'digital-books')
      .single();

    // Create product in Supabase
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

    console.log(`Successfully synced product: ${product.id}`);
  } catch (error) {
    console.error(`Failed to handle product.created for ${product.id}:`, error);
    throw error;
  }
}

/**
 * Handle product updated in Stripe
 */
async function handleProductUpdated(product) {
  try {
    console.log(`Updating Stripe product: ${product.id}`);
    
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        images: product.images || [],
        active: product.active,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_product_id', product.id);

    if (error) {
      throw error;
    }

    console.log(`Successfully updated product: ${product.id}`);
  } catch (error) {
    console.error(`Failed to handle product.updated for ${product.id}:`, error);
    throw error;
  }
}

/**
 * Handle product deleted in Stripe
 */
async function handleProductDeleted(product) {
  try {
    console.log(`Marking Stripe product as inactive: ${product.id}`);
    
    // Don't actually delete, just mark as inactive
    const { error } = await supabase
      .from('products')
      .update({
        active: false,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_product_id', product.id);

    if (error) {
      throw error;
    }

    // Also deactivate associated variants
    await supabase
      .from('product_variants')
      .update({ 
        active: false,
        updated_at: new Date().toISOString()
      })
      .in('product_id', 
        supabase
          .from('products')
          .select('id')
          .eq('stripe_product_id', product.id)
      );

    console.log(`Successfully marked product as inactive: ${product.id}`);
  } catch (error) {
    console.error(`Failed to handle product.deleted for ${product.id}:`, error);
    throw error;
  }
}

/**
 * Handle price created in Stripe
 */
async function handlePriceCreated(price) {
  try {
    console.log(`Syncing new Stripe price: ${price.id}`);
    
    // Find the associated product
    const productId = typeof price.product === 'string' ? price.product : price.product?.id;
    
    const { data: localProduct } = await supabase
      .from('products')
      .select('id')
      .eq('stripe_product_id', productId)
      .single();

    if (!localProduct) {
      console.warn(`No local product found for Stripe product ${productId}, skipping price sync`);
      return;
    }

    // Check if variant already exists
    const { data: existingVariant } = await supabase
      .from('product_variants')
      .select('id')
      .eq('stripe_price_id', price.id)
      .single();

    if (existingVariant) {
      console.log(`Price ${price.id} already exists, updating instead`);
      return await handlePriceUpdated(price);
    }

    // Create new variant for this price
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
        is_default: false // Admin can set default manually
      });

    console.log(`Successfully synced price: ${price.id}`);
  } catch (error) {
    console.error(`Failed to handle price.created for ${price.id}:`, error);
    throw error;
  }
}

/**
 * Handle price updated in Stripe
 */
async function handlePriceUpdated(price) {
  try {
    console.log(`Updating Stripe price: ${price.id}`);
    
    const { error } = await supabase
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

    if (error) {
      throw error;
    }

    console.log(`Successfully updated price: ${price.id}`);
  } catch (error) {
    console.error(`Failed to handle price.updated for ${price.id}:`, error);
    throw error;
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session) {
  try {
    console.log(`Processing completed checkout: ${session.id}`);
    
    const orderId = session.metadata?.order_id;
    if (!orderId) {
      console.error('No order_id found in session metadata');
      return;
    }

    // Get full session details with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer']
    });

    // Prepare update data
    const updateData = {
      payment_status: 'paid',
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      stripe_payment_intent_id: session.payment_intent,
      total_amount: session.amount_total || 0,
      updated_at: new Date().toISOString()
    };

    // Add customer details
    if (session.customer_details) {
      updateData.email = session.customer_details.email;
      updateData.phone = session.customer_details.phone;
      
      if (session.customer_details.address) {
        updateData.billing_address = session.customer_details.address;
      }
    }

    if (session.shipping_details?.address) {
      updateData.shipping_address = session.shipping_details.address;
    }

    if (session.customer) {
      updateData.stripe_customer_id = typeof session.customer === 'string' 
        ? session.customer 
        : session.customer.id;
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    // Process inventory deductions
    await processInventoryDeductions(orderId);

    // Clear the cart
    const cartId = session.metadata?.cart_id;
    if (cartId) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);
    }

    // Grant digital access
    await grantDigitalAccess(orderId);

    // Send confirmation email (you can implement this)
    await sendOrderConfirmation(orderId);

    console.log(`Successfully processed checkout completion for order: ${orderId}`);
  } catch (error) {
    console.error(`Failed to handle checkout.session.completed:`, error);
    throw error;
  }
}

/**
 * Handle checkout session expired
 */
async function handleCheckoutExpired(session) {
  try {
    console.log(`Processing expired checkout: ${session.id}`);
    
    const orderId = session.metadata?.order_id;
    if (!orderId) {
      console.warn('No order_id found in expired session metadata');
      return;
    }

    // Update order status to expired
    await supabase
      .from('orders')
      .update({
        status: 'expired',
        payment_status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    console.log(`Marked order as expired: ${orderId}`);
  } catch (error) {
    console.error(`Failed to handle checkout.session.expired:`, error);
    throw error;
  }
}

/**
 * Handle payment succeeded
 */
async function handlePaymentSucceeded(paymentIntent) {
  try {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
    
    // Find order by payment intent ID
    const { data: order } = await supabase
      .from('orders')
      .select('id, status')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (order && order.status !== 'confirmed') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // Process inventory and fulfillment
      await processInventoryDeductions(order.id);
      await grantDigitalAccess(order.id);
    }
  } catch (error) {
    console.error(`Failed to handle payment_intent.succeeded:`, error);
    throw error;
  }
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(paymentIntent) {
  try {
    console.log(`Payment failed: ${paymentIntent.id}`);
    
    // Find order by payment intent ID
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (order) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          status: 'payment_failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // Send payment failed notification
      await sendPaymentFailedNotification(order.id);
    }
  } catch (error) {
    console.error(`Failed to handle payment_intent.payment_failed:`, error);
    throw error;
  }
}

/**
 * Handle payment canceled
 */
async function handlePaymentCanceled(paymentIntent) {
  try {
    console.log(`Payment canceled: ${paymentIntent.id}`);
    
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (order) {
      await supabase
        .from('orders')
        .update({
          payment_status: 'canceled',
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
    }
  } catch (error) {
    console.error(`Failed to handle payment_intent.canceled:`, error);
    throw error;
  }
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    
    // This could be for subscriptions or one-time purchases
    // Handle subscription invoices with existing logic
    if (invoice.subscription) {
      // Existing subscription handling logic
      await handleSubscriptionInvoice(invoice);
    }

    // Record payment in history
    await supabase
      .from('payment_history')
      .upsert({
        id: invoice.payment_intent || invoice.id,
        user_id: invoice.customer, // This would need user mapping
        stripe_invoice_id: invoice.id,
        amount: invoice.total,
        currency: invoice.currency,
        status: 'paid',
        description: invoice.description || 'Payment received',
        created_at: new Date(invoice.created * 1000).toISOString()
      });

  } catch (error) {
    console.error(`Failed to handle invoice.payment_succeeded:`, error);
    throw error;
  }
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(invoice) {
  try {
    console.log(`Invoice payment failed: ${invoice.id}`);
    
    // Record failed payment
    await supabase
      .from('payment_history')
      .upsert({
        id: invoice.payment_intent || invoice.id,
        user_id: invoice.customer,
        stripe_invoice_id: invoice.id,
        amount: invoice.total,
        currency: invoice.currency,
        status: 'failed',
        description: invoice.description || 'Payment failed',
        created_at: new Date(invoice.created * 1000).toISOString()
      });

    // Send payment failed notification
    await sendInvoiceFailedNotification(invoice);

  } catch (error) {
    console.error(`Failed to handle invoice.payment_failed:`, error);
    throw error;
  }
}

/**
 * Handle customer created
 */
async function handleCustomerCreated(customer) {
  try {
    console.log(`New Stripe customer: ${customer.id}`);
    
    // Try to find user by email and update their profile
    if (customer.email) {
      await supabase
        .from('profiles')
        .update({ 
          stripe_customer_id: customer.id,
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email);
    }

  } catch (error) {
    console.error(`Failed to handle customer.created:`, error);
    // Don't throw - this is not critical
  }
}

/**
 * Handle customer updated
 */
async function handleCustomerUpdated(customer) {
  try {
    console.log(`Updated Stripe customer: ${customer.id}`);
    
    // Update customer information in profiles if linked
    await supabase
      .from('profiles')
      .update({ 
        updated_at: new Date().toISOString()
        // Add other fields you want to sync
      })
      .eq('stripe_customer_id', customer.id);

  } catch (error) {
    console.error(`Failed to handle customer.updated:`, error);
    // Don't throw - this is not critical
  }
}

/**
 * Handle dispute created
 */
async function handleDisputeCreated(dispute) {
  try {
    console.log(`Dispute created: ${dispute.id}`);
    
    // Log the dispute for admin attention
    await supabase
      .from('audit_log')
      .insert({
        action: 'dispute_created',
        target_type: 'dispute',
        target_id: dispute.id,
        after_data: dispute
      });

    // You could send admin notifications here
    await sendDisputeNotification(dispute);

  } catch (error) {
    console.error(`Failed to handle charge.dispute.created:`, error);
    throw error;
  }
}

/**
 * Process inventory deductions for order
 */
async function processInventoryDeductions(orderId) {
  try {
    // Get order items that need inventory deduction
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        id, variant_id, quantity,
        product_variants!inner(
          id, track_inventory,
          products!inner(track_inventory)
        )
      `)
      .eq('order_id', orderId);

    if (error || !orderItems) {
      console.error('Failed to fetch order items for inventory processing:', error);
      return;
    }

    // Process each item
    for (const item of orderItems) {
      if (item.product_variants.track_inventory) {
        try {
          await supabase.rpc('update_inventory', {
            p_variant_id: item.variant_id,
            p_quantity_change: -item.quantity,
            p_movement_type: 'out',
            p_reason: 'Order fulfillment',
            p_reference_type: 'order',
            p_reference_id: orderId
          });
        } catch (inventoryError) {
          console.error(`Failed to update inventory for variant ${item.variant_id}:`, inventoryError);
        }
      }
    }

    console.log(`Processed inventory deductions for order: ${orderId}`);
  } catch (error) {
    console.error('Error processing inventory deductions:', error);
  }
}

/**
 * Grant digital access for order items
 */
async function grantDigitalAccess(orderId) {
  try {
    // Mark all order items as having access granted
    await supabase
      .from('order_items')
      .update({
        access_granted: true,
        access_granted_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    console.log(`Granted digital access for order: ${orderId}`);
  } catch (error) {
    console.error('Error granting digital access:', error);
  }
}

/**
 * Handle existing subscription events
 */
async function handleSubscriptionUpdate(subscription) {
  // Your existing subscription handling logic
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        id: subscription.id,
        user_id: subscription.metadata.user_id || subscription.customer,
        plan_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        metadata: subscription.metadata,
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error upserting subscription:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to handle subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('id', subscription.id);

    if (error) throw error;
    console.log(`Subscription ${subscription.id} canceled`);
  } catch (error) {
    console.error('Failed to handle subscription deletion:', error);
    throw error;
  }
}

// Notification functions (implement based on your email service)
async function sendOrderConfirmation(orderId) {
  console.log(`Should send order confirmation for ${orderId}`);
  // Implement with your email service
}

async function sendPaymentFailedNotification(orderId) {
  console.log(`Should send payment failed notification for ${orderId}`);
  // Implement with your email service
}

async function sendInvoiceFailedNotification(invoice) {
  console.log(`Should send invoice failed notification for ${invoice.id}`);
  // Implement with your email service
}

async function sendDisputeNotification(dispute) {
  console.log(`Should send dispute notification for ${dispute.id}`);
  // Implement admin notification system
}

async function handleSubscriptionInvoice(invoice) {
  // Handle subscription-specific invoice processing
  console.log(`Processing subscription invoice: ${invoice.id}`);
}

// Utility functions
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Retry mechanism for failed webhooks
async function retryFailedWebhook(eventId) {
  try {
    const { data: event } = await supabase
      .from('webhook_events')
      .select('*')
      .eq('id', eventId)
      .eq('processed', false)
      .single();

    if (event) {
      // Retry processing the event
      console.log(`Retrying webhook event: ${event.event_type} (${event.id})`);
      // Re-process based on event type
      // This would need the same switch logic as above
    }
  } catch (error) {
    console.error(`Failed to retry webhook ${eventId}:`, error);
  }
}
