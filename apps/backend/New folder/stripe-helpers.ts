// utils/stripe-helpers.ts - Utility functions for Stripe integration

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create or retrieve Stripe customer
export async function createOrRetrieveCustomer(userId: string, email: string) {
  // Check if customer already exists in our database
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  // Store in database
  await supabase.from('customers').insert({
    user_id: userId,
    stripe_customer_id: customer.id,
  });

  return customer.id;
}

// Get user's active subscription
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return !!subscription;
}

// Format price for display
export function formatPrice(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

// Get subscription status display text
export function getSubscriptionStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'Active',
    canceled: 'Canceled',
    incomplete: 'Incomplete',
    past_due: 'Past Due',
    unpaid: 'Unpaid',
    trialing: 'Trial',
  };
  
  return statusMap[status] || status;
}

// Calculate days until subscription ends
export function getDaysUntilPeriodEnd(periodEnd: string): number {
  const endDate = new Date(periodEnd);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Create portal session for customer to manage their subscription
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
  return session.url;
}

// TypeScript types for better development experience
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe price ID
  interval: 'month' | 'year';
  features: string[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Customer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
}

export interface Subscription {
  id: string; // Stripe subscription ID
  user_id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'unpaid' | 'trialing';
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
}

export interface CreateCheckoutSessionRequest {
  priceId: string;
  customerId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url?: string;
}

// Example usage in a React component:
/*
import { useState, useEffect } from 'react';
import { hasActiveSubscription, getUserSubscription } from '@/utils/stripe-helpers';

export function useSubscription(userId: string) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const userSub = await getUserSubscription(userId);
        setSubscription(userSub);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchSubscription();
    }
  }, [userId]);

  return { subscription, loading, hasActive: !!subscription };
}
*/

// Error handling utilities
export class StripeError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StripeError';
  }
}

export function handleStripeError(error: any): string {
  if (error.type === 'StripeCardError') {
    return error.message;
  } else if (error.type === 'StripeInvalidRequestError') {
    return 'Invalid request. Please check your payment details.';
  } else if (error.type === 'StripeAPIError') {
    return 'Payment service temporarily unavailable. Please try again later.';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
}

// Webhook signature validation utility
export function validateWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, secret);
}

// Common subscription plans (example)
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals',
    price: 999, // $9.99 in cents
    priceId: 'price_1234567890', // Replace with your actual Stripe price ID
    interval: 'month',
    features: ['Feature 1', 'Feature 2', 'Email Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Great for small teams',
    price: 1999, // $19.99 in cents
    priceId: 'price_0987654321', // Replace with your actual Stripe price ID
    interval: 'month',
    features: ['Everything in Basic', 'Feature 3', 'Priority Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 4999, // $49.99 in cents
    priceId: 'price_enterprise123', // Replace with your actual Stripe price ID
    interval: 'month',
    features: ['Everything in Pro', 'Advanced Features', '24/7 Phone Support'],
  },
];