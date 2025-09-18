# 🚀 Quick Start Guide - Backend Server

## ❌ **Current Error: ERR_CONNECTION_REFUSED**

Your frontend can't connect to the backend because **the backend server is not running**.

## ⚡ **Quick Fix (3 steps):**

### **Step 1: Setup Environment**
```bash
# Navigate to backend directory
cd apps/backend

# Copy environment template
cp .env.example .env

# Edit .env file with your actual values
# You need at minimum:
# - SUPABASE_URL (from your Supabase dashboard)
# - SUPABASE_SERVICE_ROLE_KEY (from your Supabase dashboard)
# - STRIPE_SECRET_KEY (from your Stripe dashboard)
```

### **Step 2: Install Dependencies**
```bash
# Install npm packages
npm install
```

### **Step 3: Start Server**

**Option A - Using startup script (Recommended):**
```bash
# Windows PowerShell:
./start-backend.ps1

# Mac/Linux:
chmod +x start-backend.sh
./start-backend.sh
```

**Option B - Manual start:**
```bash
npm run dev
```

## ✅ **Success Indicators:**

You should see:
```
🚀 Starting backend server...
📍 Server will be available at: http://localhost:3001
🏥 Health check: http://localhost:3001/api/health
💳 Stripe endpoint: http://localhost:3001/api/stripe/create-subscription

Server running on port 3001
```

## 🔧 **Test Your Setup:**

1. **Health Check**: Open http://localhost:3001/api/health
   - Should return: `{"status": "OK", "timestamp": "..."}`

2. **Debug Script**: 
   ```bash
   node debug-stripe-api.js
   ```

3. **Test Payment**: Try the checkout flow in your browser

## 📋 **Required Environment Variables:**

```env
# Get these from: https://supabase.com/dashboard/project/[your-project]/settings/api
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Get these from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...

# Your frontend URL
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## ⚠️ **Common Issues:**

### **"Module not found" errors:**
```bash
npm install
```

### **Port 3001 already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001

# Or change PORT in .env
PORT=3002
```

### **Database connection errors:**
- Check your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Make sure your Supabase project is active

### **Stripe errors:**
- Check your `STRIPE_SECRET_KEY` starts with `sk_test_`
- Make sure you're using test keys, not live keys

## 🌐 **URLs After Starting:**

- **Backend Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Stripe API**: http://localhost:3001/api/stripe/create-subscription
- **Frontend**: http://localhost:5173 (run separately)

## 📞 **Need Help?**

1. Run the debug script: `node debug-stripe-api.js`
2. Check the server logs for error messages
3. Make sure all environment variables are set correctly
4. Ensure Supabase and Stripe accounts are properly configured

---

**🎆 Once you see "Server running on port 3001", your backend is ready and the payment error should be fixed!**