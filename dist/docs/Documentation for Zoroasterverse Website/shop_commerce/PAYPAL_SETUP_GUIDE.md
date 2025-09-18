# PayPal Subscription Setup Guide

## Overview

This guide will help you set up PayPal subscriptions for your Zoroasterverse episodic releases using your personal PayPal account.

## Step 1: PayPal Developer Account Setup

### 1.1 Create PayPal Developer Account
1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Sign in with your personal PayPal account
3. Complete the developer account setup

### 1.2 Get API Credentials
1. In the Developer Portal, go to **Apps & Credentials**
2. Click **Create App**
3. Choose **Business** app type
4. Give it a name like "Zoroasterverse Subscriptions"
5. Copy your **Client ID** and **Client Secret**

## Step 2: Create Subscription Plans in PayPal

### 2.1 Create Monthly Plan
1. In PayPal Developer Portal, go to **Products** → **Subscriptions**
2. Click **Create Plan**
3. Fill in the details:
   - **Plan Name**: Monthly Episodes
   - **Description**: Access to all released chapters and new chapters as they are written
   - **Billing Cycle**: Monthly
   - **Price**: $9.99 USD
   - **Setup Fee**: $0.00
4. Click **Create Plan**
5. Copy the **Plan ID** (starts with "P-")

### 2.2 Create Annual Plan
1. Create another plan:
   - **Plan Name**: Annual Episodes
   - **Description**: Everything in Monthly plan plus 2 months free and exclusive content
   - **Billing Cycle**: Yearly
   - **Price**: $99.99 USD
   - **Setup Fee**: $0.00
2. Copy the **Plan ID**

## Step 3: Update Environment Variables

### 3.1 Backend Environment
1. In `src/backend/`, copy `env.example` to `.env`
2. Update the PayPal section:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=your_webhook_id_here
```

### 3.2 Frontend Environment
1. In `src/frontend/`, copy `env.example` to `.env`
2. Update the PayPal section:

```env
REACT_APP_PAYPAL_CLIENT_ID=your_client_id_here
REACT_APP_PAYPAL_MODE=sandbox
```

## Step 4: Update Database with Plan IDs

### 4.1 Update Subscription Plans
1. Open `src/backend/database/subscription_plans.sql`
2. Replace the placeholder plan IDs with your actual PayPal plan IDs:

```sql
INSERT INTO subscription_plans (name, description, price, interval, paypal_plan_id) VALUES
(
  'Monthly Episodes',
  'Access to all released chapters and new chapters as they are written',
  9.99,
  'month',
  'P-YOUR_ACTUAL_MONTHLY_PLAN_ID' -- Replace this
),
(
  'Annual Episodes',
  'Everything in Monthly plan plus 2 months free and exclusive content',
  99.99,
  'year',
  'P-YOUR_ACTUAL_YEARLY_PLAN_ID' -- Replace this
);
```

### 4.2 Update Frontend Plan IDs
1. Open `src/frontend/src/pages/SubscriptionPage.tsx`
2. Update the plan IDs:

```typescript
paypalPlanId: 'P-YOUR_ACTUAL_MONTHLY_PLAN_ID' // Replace with actual ID
paypalPlanId: 'P-YOUR_ACTUAL_YEARLY_PLAN_ID'  // Replace with actual ID
```

## Step 5: Set Up Webhooks (Optional but Recommended)

### 5.1 Create Webhook
1. In PayPal Developer Portal, go to **Webhooks**
2. Click **Add Webhook**
3. Set **Event Types** to:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED`
4. Set **Webhook URL** to: `https://yourdomain.com/api/paypal/webhook`
5. Copy the **Webhook ID**

### 5.2 Update Environment
Add the webhook ID to your `.env` file:

```env
PAYPAL_WEBHOOK_ID=your_webhook_id_here
```

## Step 6: Test the Integration

### 6.1 Start Backend Server
```bash
cd src/backend
npm install
npm start
```

### 6.2 Start Frontend
```bash
cd src/frontend
npm install
npm run dev
```

### 6.3 Test Subscription Flow
1. Go to `/subscriptions` page
2. Click "Subscribe Now" on any plan
3. Should redirect to PayPal for subscription approval
4. Complete the subscription process
5. Should redirect back to success page

## Step 7: Go Live

### 7.1 Switch to Live Mode
1. In PayPal Developer Portal, switch from **Sandbox** to **Live**
2. Update your `.env` files:
   ```env
   PAYPAL_MODE=live
   ```
3. Update frontend environment:
   ```env
   REACT_APP_PAYPAL_MODE=live
   ```

### 7.2 Update Webhook URL
1. Update webhook URL to your production domain
2. Test webhook delivery

## Troubleshooting

### Common Issues

#### 1. "Plan not found" Error
- Verify plan IDs are correct in database
- Check that plans are active in PayPal
- Ensure plan IDs match between frontend and backend

#### 2. PayPal Redirect Not Working
- Check PayPal credentials are correct
- Verify PayPal mode (sandbox/live) matches
- Check browser console for errors

#### 3. Webhook Not Receiving Events
- Verify webhook URL is accessible
- Check webhook is active in PayPal
- Ensure webhook events are properly configured

#### 4. Database Connection Issues
- Check database connection string
- Verify tables exist and are properly structured
- Check database permissions

### Debug Steps

1. **Check Backend Logs**
   ```bash
   cd src/backend
   npm start
   ```
   Look for error messages in console

2. **Check Frontend Console**
   - Open browser developer tools
   - Look for network errors
   - Check console for JavaScript errors

3. **Test PayPal API Directly**
   - Use PayPal's API testing tools
   - Verify credentials work
   - Test plan creation manually

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets
- Rotate credentials regularly

### 2. Webhook Security
- Verify webhook signatures (implemented in the code)
- Use HTTPS for webhook URLs
- Validate webhook payloads

### 3. Database Security
- Use parameterized queries (already implemented)
- Implement proper user authentication
- Use database connection pooling

## Support Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Subscriptions API](https://developer.paypal.com/docs/subscriptions/)
- [PayPal Webhooks](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)

## Next Steps

Once PayPal is working:
1. Test with real payments (small amounts)
2. Set up monitoring and alerts
3. Implement subscription management features
4. Add analytics and reporting
5. Consider implementing free trials
6. Set up customer support processes

Your subscription system is now ready to accept real payments through PayPal!
