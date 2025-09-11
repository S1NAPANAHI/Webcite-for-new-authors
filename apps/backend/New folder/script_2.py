# Create step-by-step implementation guide and package setup

# 7. Package.json dependencies
package_dependencies = '''{
  "dependencies": {
    "@stripe/stripe-js": "^4.4.0",
    "@supabase/supabase-js": "^2.38.4",
    "stripe": "^16.12.0",
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.5.4"
  },
  "devDependencies": {
    "@types/node": "^22.5.4",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe"
  }
}'''

# 8. Step-by-step implementation guide
implementation_steps = '''# Complete Stripe Subscription Setup Guide for Next.js + Supabase

## Prerequisites
- Stripe account with API keys
- Supabase project setup
- Next.js application (App Router recommended)

## Step 1: Install Dependencies
```bash
npm install stripe @stripe/stripe-js @supabase/supabase-js
# or
yarn add stripe @stripe/stripe-js @supabase/supabase-js
```

## Step 2: Set Up Environment Variables
Create `.env.local` in your project root:
```bash
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Create Database Schema in Supabase
Run the SQL schema provided in the database schema file in your Supabase SQL editor.

## Step 4: Create Stripe Products and Prices
In your Stripe Dashboard:
1. Go to Products
2. Create a new product (e.g., "Pro Plan")
3. Add a recurring price (e.g., $10/month)
4. Copy the price ID (starts with `price_`)

## Step 5: Create API Routes

### For App Router (Next.js 13+):
Create `app/api/create-checkout-session/route.ts` with the provided code.
Create `app/api/webhooks/stripe/route.ts` with the webhook handler.

### For Pages Router:
Create `pages/api/create-checkout-session.ts`
Create `pages/api/webhooks/stripe.ts`

## Step 6: Create Frontend Components
Create the subscription button component with the provided code.

## Step 7: Set Up Stripe CLI for Local Testing
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook signing secret and add to your `.env.local`

## Step 8: Configure Webhooks in Production
1. Go to Stripe Dashboard > Webhooks
2. Create endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Step 9: Test Your Integration
1. Start your Next.js app: `npm run dev`
2. Start Stripe webhook listener: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Test a subscription flow
4. Check your Supabase database for created records

## Common Issues and Solutions

### Issue: 405 Method Not Allowed
**Cause**: API route doesn't handle POST method
**Solution**: Ensure you export `POST` function for App Router or check `req.method` for Pages Router

### Issue: "Unexpected end of JSON input"
**Cause**: Server returns HTML instead of JSON (usually due to errors)
**Solution**: Add proper error handling and return JSON responses with `NextResponse.json()`

### Issue: Webhook signature verification fails
**Cause**: Wrong webhook secret or incorrect body parsing
**Solution**: Use raw body parsing and correct webhook secret from Stripe CLI or Dashboard

### Issue: CORS errors
**Cause**: Missing CORS headers for cross-origin requests
**Solution**: Add appropriate CORS headers to your API responses

## Security Checklist
- ✅ Never expose secret keys on the frontend
- ✅ Always verify webhook signatures  
- ✅ Use HTTPS in production
- ✅ Validate all input data
- ✅ Use Supabase RLS policies
- ✅ Store minimal sensitive data

## Production Deployment
1. Update environment variables with live Stripe keys
2. Configure production webhook endpoint
3. Test with Stripe's test cards
4. Monitor webhook delivery in Stripe Dashboard'''

# 9. TypeScript types for better development experience
typescript_types = '''// types/stripe.ts - TypeScript definitions for better development

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

// Webhook event types
export type StripeWebhookEvent = 
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

// Utility function types
export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}'''

# 10. Utility functions
utility_functions = '''// utils/stripe.ts - Helpful utility functions

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { Subscription, User } from '@/types/stripe';

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
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
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

// Validate webhook signature (utility for webhook handlers)
export function validateWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, secret);
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
}'''

print("✅ Created additional implementation files:")
print("- Package.json dependencies")
print("- Step-by-step implementation guide") 
print("- TypeScript type definitions")
print("- Utility functions for common operations")