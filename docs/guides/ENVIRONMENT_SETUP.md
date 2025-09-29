# 🔧 Environment Variables Setup for Homepage Management

## 🎯 **IMMEDIATE FIX** for 403 Forbidden Errors

Your backend needs the **Supabase Service Key** to bypass Row Level Security policies.

### Step 1: Add Service Key to Backend Environment

**For Local Development** (`.env` file in `apps/backend/`):
```bash
# Add this to apps/backend/.env
SUPABASE_URL=https://opukvvmumyegtkukqint.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWt2dm11bXllZ3RrdWtxaW50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTMwMzc4NCwiZXhwIjoyMDcwODc5Nzg0fQ.YOUR_SERVICE_KEY_HERE

# Your existing keys
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
FRONTEND_URL=https://www.zoroastervers.com
```

**For Production** (Render.com Environment Variables):
1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to "Environment" tab
4. Add these variables:
   - `SUPABASE_SERVICE_KEY` = `your_service_key_from_supabase`
   - `SUPABASE_URL` = `https://opukvvmumyegtkukqint.supabase.co`

### Step 2: Get Your Service Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/opukvvmumyegtkukqint)
2. Click "Settings" → "API"
3. Copy the **`service_role` key** (NOT the anon key)
4. Use this key in your backend environment variables

### Step 3: Restart Your Backend

**Local:**
```bash
cd apps/backend
npm run dev
```

**Production:** 
- Your Render service will auto-redeploy when you add the environment variable

---

## 🧪 **Test the Fix**

After adding the service key:

1. **Test API Health:**
   - Local: http://localhost:3001/api/homepage/health
   - Production: https://webcite-for-new-authors.onrender.com/api/homepage/health

2. **Test Homepage Data:**
   - Local: http://localhost:3001/api/homepage
   - Production: https://webcite-for-new-authors.onrender.com/api/homepage

3. **Refresh Your Admin Page:**
   - https://www.zoroastervers.com/admin/content/homepage
   - The 403 errors should be gone!

---

## 🔐 **What This Fixes**

- ✅ **403 Forbidden API errors** - Service key bypasses RLS
- ✅ **403 Forbidden Supabase errors** - Proper authentication
- ✅ **Backend API endpoints** - All routes now accessible
- ✅ **Admin operations** - Content editing will work
- ✅ **Quote management** - CRUD operations functional

---

## 🚨 **If You Don't Have the Service Key:**

**Alternative Fix** - Disable RLS temporarily:

```sql
-- Run this in Supabase SQL Editor to temporarily disable RLS
ALTER TABLE homepage_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_quotes DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: This makes the tables publicly writable. Only use for testing!

---

**This will resolve all the 403 authentication errors you're experiencing!** 🎉
