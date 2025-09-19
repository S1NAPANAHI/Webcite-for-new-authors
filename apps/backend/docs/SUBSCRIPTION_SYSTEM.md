# Enhanced Subscription System

This document describes the comprehensive subscription system that integrates Stripe payments with real-time data fetching and user management.

## Overview

The subscription system now provides:
- **Real-time data** from Stripe instead of mock data
- **Comprehensive subscription management** with billing information
- **Automatic webhook handling** for status updates
- **Manual sync utilities** for debugging and maintenance
- **Enhanced user experience** with detailed subscription information

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend  │◄──►│     Backend     │◄──►│     Stripe      │
│             │    │                 │    │                 │
│ • Account   │    │ • Subscription  │    │ • Webhooks      │
│   Dashboard │    │   API Routes    │    │ • Customer      │
│ • Sub Details│    │ • Webhook       │    │   Management    │
│ • Billing   │    │   Handlers      │    │ • Billing       │
│   Portal    │    │ • Sync Utils    │    │   Portal        │
└─────────────┘    └─────────────────┘    └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │    Supabase     │
                   │                 │
                   │ • profiles      │
                   │ • subscriptions │
                   │ • invoices      │
                   │ • webhook_events│
                   └─────────────────┘
```

## API Endpoints

### Enhanced Subscription API

All subscription endpoints are available under `/api/subscription/`:

#### GET `/api/subscription/status`
Fetches comprehensive subscription status including:
- User subscription details
- Plan information (price, interval, features)
- Days remaining
- Subscription validity
- Billing cycle information

```json
{
  "user_id": "user-123",
  "email": "user@example.com",
  "subscription_status": "active",
  "subscription_tier": "premium",
  "subscription_end_date": "2024-01-19T18:30:00Z",
  "is_subscribed": true,
  "has_premium_access": true,
  "subscription_valid": true,
  "days_remaining": 30,
  "plan_info": {
    "price_id": "price_xxx",
    "amount": 999,
    "currency": "usd",
    "interval": "month",
    "product_name": "Premium Plan"
  },
  "billing_cycle": "1 month"
}
```

#### POST `/api/subscription/refresh`
Force refresh subscription status from Stripe:
- Fetches latest data from Stripe
- Updates database records
- Returns updated subscription information

#### GET `/api/subscription/billing`
Retrieve billing information:
- Payment methods
- Invoice history
- Upcoming payments

```json
{
  "payment_method": {
    "id": "pm_xxx",
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025
    }
  },
  "invoices": [
    {
      "id": "in_xxx",
      "amount_paid": 999,
      "currency": "usd",
      "status": "paid",
      "created": 1640995200,
      "hosted_invoice_url": "https://invoice.stripe.com/xxx",
      "invoice_pdf": "https://pay.stripe.com/invoice/xxx/pdf"
    }
  ],
  "upcoming_invoice": {
    "amount_due": 999,
    "currency": "usd",
    "period_start": 1640995200,
    "period_end": 1643673600
  }
}
```

#### POST `/api/subscription/billing-portal`
Create Stripe billing portal session for subscription management.

#### POST `/api/subscription/cancel`
Cancel subscription (remains active until period end).

#### GET `/api/subscription/plans`
Get available subscription plans from Stripe.

## Database Schema

### Enhanced Tables

#### `profiles` table
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
```

#### `subscriptions` table (optional)
```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(255) PRIMARY KEY, -- Stripe subscription ID
  user_id UUID REFERENCES profiles(id),
  plan_id VARCHAR(255), -- Stripe price ID
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `webhook_events` table (optional)
```sql
CREATE TABLE IF NOT EXISTS webhook_events (
  id VARCHAR(255) PRIMARY KEY, -- Stripe event ID
  provider VARCHAR(50) DEFAULT 'stripe',
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

## Frontend Integration

### Account Dashboard (`Account.tsx`)
- Shows subscription status card with real data
- Includes refresh button for manual status updates
- Links to detailed subscription page

### Subscription Details (`SubscriptionDetailsPage.tsx`)
- Comprehensive subscription management interface
- Real-time billing information
- Payment method display
- Invoice history
- Plan comparison table
- Subscription actions (upgrade, cancel, manage)

### Key Features
- **Real-time data fetching** from API endpoints
- **Automatic refresh** capability
- **Error handling** with user-friendly messages
- **Loading states** and skeleton screens
- **Responsive design** for all devices

## Webhook System

### Automated Status Updates

The webhook system (`/webhooks/stripe-ecommerce.js`) automatically handles:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `checkout.session.completed`

### Critical Features
- **Immediate status updates** when subscriptions change
- **Automatic tier assignment** based on subscription amount
- **Webhook event logging** for debugging
- **Error handling and retry logic**
- **Subscription and profile synchronization**

## Sync Utility

### Manual Subscription Synchronization

Use the sync script for:
- **Initial data migration**
- **Fixing subscription discrepancies**
- **Bulk updates**
- **Debugging subscription issues**

#### Usage Examples

```bash
# Sync specific user by email
npm run sync-subscriptions -- --email user@example.com

# Sync specific user by ID
npm run sync-subscriptions -- --user-id abc-123

# Sync all users (dry run first)
npm run sync-subscriptions -- --all --dry-run

# Force sync all users
npm run sync-subscriptions -- --all --force --verbose
```

#### Script Options
- `--user-id <id>`: Sync specific user by ID
- `--email <email>`: Sync specific user by email
- `--all`: Sync all users with Stripe customer IDs
- `--dry-run`: Preview changes without applying
- `--force`: Force update even if data seems current
- `--verbose`: Show detailed logs

## Subscription Tiers

### Tier Mapping
The system automatically maps Stripe prices to tiers:

- **Free**: $0 (no subscription)
- **Premium**: $9.99/month or $99.99/year
- **Patron**: $19.99/month or $199.99/year

### Feature Access
```typescript
interface SubscriptionFeatures {
  free: {
    access_free_content: true,
    premium_chapters: false,
    ad_free: false,
    offline_reading: false
  },
  premium: {
    access_free_content: true,
    premium_chapters: true,
    ad_free: true,
    offline_reading: true,
    beta_access: false
  },
  patron: {
    access_free_content: true,
    premium_chapters: true,
    ad_free: true,
    offline_reading: true,
    beta_access: true,
    author_commentary: true,
    discord_access: true,
    priority_support: true
  }
}
```

## Environment Variables

Ensure these are set in your `.env`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Frontend
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Deployment Considerations

### Production Checklist

1. **Webhook Endpoint Setup**
   - Configure webhook endpoint in Stripe Dashboard
   - Set webhook URL: `https://your-api.com/api/stripe/webhook`
   - Enable required events
   - Add webhook signing secret to environment

2. **Database Setup**
   - Run database migrations
   - Ensure proper indexing on frequently queried fields
   - Set up database backups

3. **Monitoring**
   - Monitor webhook event processing
   - Set up alerts for failed payments
   - Track subscription metrics

4. **Testing**
   - Test subscription flow end-to-end
   - Verify webhook event handling
   - Test sync utility in staging

## Troubleshooting

### Common Issues

**Subscription status not updating:**
1. Check webhook endpoint configuration
2. Verify webhook signing secret
3. Check webhook event logs in Stripe
4. Use sync utility to manually update

**User can't access premium features:**
1. Verify subscription status in database
2. Check subscription tier mapping
3. Use refresh status API endpoint
4. Check subscription end date

**Payment failures:**
1. Check Stripe Dashboard for failed payments
2. Verify payment method status
3. Check invoice status and retry logic

### Debug Commands

```bash
# Check specific user subscription
npm run sync-subscriptions -- --email user@example.com --verbose --dry-run

# Check all subscriptions
npm run sync-subscriptions -- --all --verbose --dry-run

# Force refresh specific user
npm run sync-subscriptions -- --user-id abc-123 --force
```

## Security Considerations

- **Webhook signature verification** prevents unauthorized requests
- **Authentication required** for all subscription API endpoints
- **User isolation** ensures users can only access their own data
- **Sensitive data protection** (payment methods shown partially)
- **Rate limiting** on API endpoints

## Future Enhancements

- [ ] Subscription analytics dashboard
- [ ] Email notifications for subscription events
- [ ] Proration handling for plan changes
- [ ] Trial period management
- [ ] Coupon and discount support
- [ ] Multi-currency support
- [ ] Subscription pause/resume functionality

---

**Need Help?**

For questions or issues with the subscription system:
1. Check the troubleshooting section above
2. Review Stripe webhook logs
3. Use the sync utility for debugging
4. Check application logs for detailed error messages