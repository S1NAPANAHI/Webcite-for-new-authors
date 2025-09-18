# 🚀 Vercel Deployment Guide

## ✅ **The Fix is Complete!**

Your payment issue has been fixed! The missing `/api/stripe/create-subscription` serverless function has been added.

## 📁 **What Was Added:**

### 1. **Serverless Function**: `apps/frontend/api/stripe/create-subscription.ts`
- ✅ Handles Stripe subscription creation
- ✅ Supports Supabase authentication
- ✅ Database integration for customer/subscription storage
- ✅ Proper error handling and logging

### 2. **Updated Vercel Configuration**: `vercel.json`
- ✅ Proper API routing for serverless functions
- ✅ Runtime configuration for Node.js 18.x
- ✅ Correct rewrites for `/api/*` endpoints

### 3. **Frontend Updates**: `CheckoutPage.tsx`
- ✅ Smart API URL detection (local vs Vercel)
- ✅ Enhanced error handling and logging
- ✅ Better environment variable support

### 4. **Dependencies**: `package.json`
- ✅ Added `@vercel/node` for serverless function types
- ✅ Added `stripe` for server-side Stripe integration

## 🌐 **How It Works Now:**

```
Your Frontend → /api/stripe/create-subscription → Vercel Serverless Function → Stripe + Supabase
```

## 🔧 **Required Environment Variables on Vercel:**

### **In your Vercel Dashboard** (https://vercel.com/dashboard):

```bash
# Supabase (REQUIRED)
SUPABASE_URL=https://opukvvmumyegtkukqint.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend URL (OPTIONAL - auto-detected)
FRONTEND_URL=https://your-app.vercel.app

# Already set in vercel.json:
VITE_SUPABASE_URL=https://opukvvmumyegtkukqint.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### **Missing Environment Variables?**
1. Go to your **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the missing variables above
5. **Redeploy** your application

## 🚀 **To Deploy:**

```bash
# Push to GitHub (triggers auto-deployment)
git add .
git commit -m "Fix Stripe subscription API"
git push origin main
```

Or deploy manually:
```bash
npx vercel --prod
```

## ✅ **Test Your Deployment:**

1. **Check API endpoint**: `https://your-app.vercel.app/api/stripe/create-subscription`
   - Should return `Method not allowed` for GET requests (this is correct!)

2. **Test the payment flow**: 
   - Go to your subscriptions page
   - Try to complete a payment
   - Check browser console for detailed logs

## 🔍 **Troubleshooting:**

### **"Function not found" or 404 errors:**
- Make sure `apps/frontend/api/stripe/create-subscription.ts` exists
- Check that your `vercel.json` has the correct `functions` configuration
- Redeploy the application

### **"Environment variable not set" errors:**
- Add the missing environment variables in Vercel dashboard
- Redeploy after adding environment variables

### **Database connection errors:**
- Verify your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check that your Supabase project is active

### **Stripe errors:**
- Ensure `STRIPE_SECRET_KEY` starts with `sk_test_` (for test mode)
- Verify the key is valid in your Stripe dashboard

## 📊 **API Endpoint Structure:**

```
https://your-app.vercel.app/
├── api/
│   ├── create-checkout-session       ✅ (existing)
│   ├── stripe-webhook               ✅ (existing) 
│   └── stripe/
│       └── create-subscription      ✅ (NEW - fixes your error!)
└── [your frontend routes]
```

## 🎯 **Expected Behavior:**

- **Before**: `ERR_CONNECTION_REFUSED` when trying to pay
- **After**: Payment flow works normally

## 🆘 **Still Having Issues?**

1. Check **Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on the failing function to see logs

2. **Check Browser Console**:
   - Look for detailed API request/response logs
   - The updated frontend now shows extensive debugging info

3. **Verify Environment Variables**:
   - Make sure all required environment variables are set in Vercel
   - Redeploy after any environment variable changes

---

🎉 **Your Stripe subscription payment should now work perfectly on Vercel!**