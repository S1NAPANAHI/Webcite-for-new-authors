#!/usr/bin/env node
/**
 * Stripe Subscription Sync Utility
 * 
 * This script helps synchronize subscription data between Stripe and Supabase.
 * Useful for:
 * - Initial data migration
 * - Fixing subscription status discrepancies
 * - Bulk subscription updates
 * - Debugging subscription issues
 * 
 * Usage:
 *   node scripts/sync-stripe-subscriptions.js [options]
 * 
 * Options:
 *   --user-id <id>     Sync specific user by ID
 *   --email <email>    Sync specific user by email
 *   --all              Sync all users with Stripe customer IDs
 *   --dry-run          Preview changes without applying them
 *   --force            Force update even if data seems current
 *   --verbose          Show detailed logs
 */

import '../config.js';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { program } from 'commander';

// Initialize services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-09-30.acacia'
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration
program
  .version('1.0.0')
  .description('Sync subscription data between Stripe and Supabase')
  .option('-u, --user-id <id>', 'Sync specific user by ID')
  .option('-e, --email <email>', 'Sync specific user by email')
  .option('-a, --all', 'Sync all users with Stripe customer IDs')
  .option('-d, --dry-run', 'Preview changes without applying them')
  .option('-f, --force', 'Force update even if data seems current')
  .option('-v, --verbose', 'Show detailed logs')
  .parse();

const options = program.opts();

// Logging utilities
const log = {
  info: (msg, ...args) => {
    console.log(`ℹ️  ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`✅ ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`⚠️  ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`❌ ${msg}`, ...args);
  },
  verbose: (msg, ...args) => {
    if (options.verbose) {
      console.log(`🔍 ${msg}`, ...args);
    }
  }
};

/**
 * Get subscription tier based on price amount
 */
function getSubscriptionTier(price) {
  if (!price || !price.unit_amount) return 'free';
  
  const amount = price.unit_amount; // Amount in cents
  const interval = price.recurring?.interval;
  
  if (interval === 'month') {
    if (amount >= 1999) return 'patron'; // $19.99+ monthly
    if (amount >= 999) return 'premium'; // $9.99+ monthly
  } else if (interval === 'year') {
    if (amount >= 19999) return 'patron'; // $199.99+ yearly
    if (amount >= 9999) return 'premium'; // $99.99+ yearly
  }
  
  return 'free';
}

/**
 * Sync a single user's subscription data
 */
async function syncUserSubscription(userId, userEmail, stripeCustomerId) {
  log.verbose(`Syncing user: ${userId} (${userEmail}) with customer: ${stripeCustomerId}`);
  
  try {
    // Fetch subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      limit: 10
    });

    log.verbose(`Found ${subscriptions.data.length} subscriptions for customer ${stripeCustomerId}`);

    if (subscriptions.data.length === 0) {
      // No subscriptions, set user to free tier
      const updateData = {
        subscription_status: 'inactive',
        subscription_tier: 'free',
        subscription_end_date: null,
        updated_at: new Date().toISOString()
      };

      if (options.dryRun) {
        log.info(`[DRY RUN] Would set user ${userEmail} to free tier`);
        log.verbose('[DRY RUN] Profile update:', updateData);
      } else {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) {
          throw error;
        }

        log.success(`Set user ${userEmail} to free tier (no subscriptions)`);
      }
      return { updated: true, tier: 'free', status: 'inactive' };
    }

    // Find the most relevant subscription (active, trialing, or most recent)
    const activeSubscription = subscriptions.data.find(s => 
      ['active', 'trialing', 'past_due'].includes(s.status)
    ) || subscriptions.data[0];

    log.verbose(`Processing subscription: ${activeSubscription.id} (${activeSubscription.status})`);

    const isActive = ['active', 'trialing'].includes(activeSubscription.status);
    const price = activeSubscription.items.data[0]?.price;
    const tier = isActive ? getSubscriptionTier(price) : 'free';

    // Prepare profile update
    const profileUpdate = {
      subscription_status: activeSubscription.status,
      subscription_tier: tier,
      subscription_end_date: activeSubscription.current_period_end ? 
        new Date(activeSubscription.current_period_end * 1000).toISOString() : null,
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString()
    };

    // Prepare subscription record
    const subscriptionData = {
      id: activeSubscription.id,
      user_id: userId,
      plan_id: activeSubscription.items.data[0]?.price?.id,
      status: activeSubscription.status,
      current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: activeSubscription.cancel_at_period_end,
      trial_start: activeSubscription.trial_start ? 
        new Date(activeSubscription.trial_start * 1000).toISOString() : null,
      trial_end: activeSubscription.trial_end ? 
        new Date(activeSubscription.trial_end * 1000).toISOString() : null,
      canceled_at: activeSubscription.canceled_at ? 
        new Date(activeSubscription.canceled_at * 1000).toISOString() : null,
      metadata: activeSubscription.metadata || {},
      updated_at: new Date().toISOString()
    };

    if (options.dryRun) {
      log.info(`[DRY RUN] Would update user ${userEmail}: ${tier} tier, status: ${activeSubscription.status}`);
      log.verbose('[DRY RUN] Profile update:', profileUpdate);
      log.verbose('[DRY RUN] Subscription data:', subscriptionData);
    } else {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', userId);

      if (profileError) {
        throw new Error(`Profile update error: ${profileError.message}`);
      }

      // Upsert subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, { onConflict: 'id' });

      if (subscriptionError) {
        log.warn(`Subscription record error: ${subscriptionError.message}`);
        // Don't throw - profile update succeeded
      }

      log.success(`Updated user ${userEmail}: ${tier} tier, status: ${activeSubscription.status}`);
    }

    return {
      updated: true,
      tier,
      status: activeSubscription.status,
      subscriptionId: activeSubscription.id
    };

  } catch (error) {
    log.error(`Failed to sync user ${userEmail}: ${error.message}`);
    throw error;
  }
}

/**
 * Find users to sync
 */
async function getUsersToSync() {
  if (options.userId) {
    // Sync specific user by ID
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .eq('id', options.userId)
      .single();

    if (error || !data) {
      throw new Error(`User not found: ${options.userId}`);
    }

    if (!data.stripe_customer_id) {
      throw new Error(`User ${data.email} has no Stripe customer ID`);
    }

    return [data];
  }

  if (options.email) {
    // Sync specific user by email
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .eq('email', options.email)
      .single();

    if (error || !data) {
      throw new Error(`User not found: ${options.email}`);
    }

    if (!data.stripe_customer_id) {
      throw new Error(`User ${data.email} has no Stripe customer ID`);
    }

    return [data];
  }

  if (options.all) {
    // Sync all users with Stripe customer IDs
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .not('stripe_customer_id', 'is', null);

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data;
  }

  throw new Error('Please specify --user-id, --email, or --all');
}

/**
 * Main execution function
 */
async function main() {
  log.info('🚀 Starting Stripe subscription sync...');
  
  if (options.dryRun) {
    log.warn('DRY RUN MODE - No changes will be applied');
  }

  try {
    // Get users to sync
    const users = await getUsersToSync();
    log.info(`Found ${users.length} user(s) to sync`);

    const results = {
      total: users.length,
      updated: 0,
      errors: 0,
      tiers: { free: 0, premium: 0, patron: 0 },
      statuses: {}
    };

    // Process each user
    for (const user of users) {
      try {
        log.info(`Processing user: ${user.email}`);
        
        const result = await syncUserSubscription(
          user.id, 
          user.email, 
          user.stripe_customer_id
        );

        if (result.updated) {
          results.updated++;
          results.tiers[result.tier]++;
          results.statuses[result.status] = (results.statuses[result.status] || 0) + 1;
        }

      } catch (error) {
        results.errors++;
        log.error(`Failed to process user ${user.email}: ${error.message}`);
      }
    }

    // Show summary
    log.info('\n📊 Sync Summary:');
    log.info(`Total users processed: ${results.total}`);
    log.info(`Successfully updated: ${results.updated}`);
    log.info(`Errors: ${results.errors}`);
    
    log.info('\nTier distribution:');
    Object.entries(results.tiers).forEach(([tier, count]) => {
      if (count > 0) {
        log.info(`  ${tier}: ${count}`);
      }
    });
    
    log.info('\nStatus distribution:');
    Object.entries(results.statuses).forEach(([status, count]) => {
      log.info(`  ${status}: ${count}`);
    });

    if (results.errors === 0) {
      log.success('\n🎉 Sync completed successfully!');
    } else {
      log.warn(`\n⚠️  Sync completed with ${results.errors} error(s)`);
    }

  } catch (error) {
    log.error('Sync failed:', error.message);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log.error('Unexpected error:', error);
    process.exit(1);
  });
}

export { syncUserSubscription, getUsersToSync, main };