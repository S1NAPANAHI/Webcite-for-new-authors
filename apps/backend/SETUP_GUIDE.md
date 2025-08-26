# Quick Backend Setup Guide

## 1. Create Environment File

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

## 2. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up/Login
3. Go to Developers → API Keys
4. Copy your **Publishable Key** and **Secret Key**
5. Update `.env` file:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...your_key_here
STRIPE_SECRET_KEY=sk_test_...your_key_here
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Backend Server

```bash
npm start
# or
node server.js
```

The server will run on `http://localhost:3001`

## 5. Test the API

Visit: `http://localhost:3001/health`

You should see: `{"status":"OK","timestamp":"...","environment":"development"}`

## 6. Create Stripe Products

1. In Stripe Dashboard, go to Products
2. Create a new product called "Zoroasterverse Episodes"
3. Add two prices:
   - Monthly: $9.99/month
   - Annual: $99.99/year
4. Copy the price IDs (e.g., `price_1ABC123...`)
5. Update the frontend `SubscriptionPage.tsx` with these IDs

## 7. Test Subscription Flow

1. Frontend running on `http://localhost:3000`
2. Backend running on `http://localhost:3001`
3. Click "Subscribe Now" on subscription page
4. Should redirect to Stripe Checkout

## Troubleshooting

- **Port 3001 in use**: Change `PORT` in `.env`
- **CORS errors**: Check `CORS_ORIGIN` in `.env`
- **Stripe errors**: Verify API keys are correct
- **Database errors**: Check `DATABASE_URL` in `.env`
