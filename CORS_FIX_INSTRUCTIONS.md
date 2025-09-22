# CORS Fix Instructions

## Problem

The homepage admin panel cannot save changes because of CORS (Cross-Origin Resource Sharing) errors:

```
Access to fetch at 'https://webcite-for-new-authors.onrender.com/api/homepage?_t=1758573408352' 
from origin 'https://www.zoroastervers.com' has been blocked by CORS policy
```

## Root Cause

The backend API is not configured to accept requests from your frontend domain. This happens when:

1. The backend deployment is using outdated code
2. Environment variables are not set correctly
3. The CORS configuration doesn't include your domain

## Solution

### Step 1: Update Environment Variables on Render

1. Go to your Render dashboard
2. Find your backend service (`webcite-for-new-authors`)
3. Go to **Environment** tab
4. Add or update these variables:

```bash
FRONTEND_URL=https://www.zoroastervers.com
CORS_ORIGINS=https://www.zoroastervers.com,https://zoroastervers.com
NODE_ENV=production
```

### Step 2: Force Backend Redeploy

1. In your Render dashboard, go to your backend service
2. Click **Manual Deploy** → **Deploy Latest Commit**
3. Wait for deployment to complete (~2-3 minutes)

### Step 3: Verify the Fix

1. Test the health endpoint: https://webcite-for-new-authors.onrender.com/api/health
2. Check that it returns CORS information:
   ```json
   {
     "status": "OK",
     "cors": {
       "allowedOrigins": ["https://www.zoroastervers.com", ...]
     }
   }
   ```

3. Test the homepage API: https://webcite-for-new-authors.onrender.com/api/homepage
4. Go to your admin panel and try saving changes

### Step 4: Debug if Still Not Working

If the issue persists:

1. Open browser dev tools (F12)
2. Check Console for detailed CORS errors
3. Check Network tab for failed requests
4. Look for CORS preflight (`OPTIONS`) requests

## Code Changes Made

I've enhanced the CORS configuration in `apps/backend/server.js`:

### Before (Problematic)
```javascript
const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://www.zoroastervers.com',  // Only basic domain
  'https://zoroastervers.com'
]);
```

### After (Comprehensive)
```javascript
const allowedOrigins = new Set([
  // Development origins
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  
  // Production origins - comprehensive list
  'https://www.zoroastervers.com',
  'https://zoroastervers.com',
  'https://zoroastervers.netlify.app',
  'https://zoroastervers.vercel.app',
  
  // Add environment-specific origins
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [])
]);
```

### Enhanced Features

1. **Better Logging**: More detailed CORS logs to help debug issues
2. **Environment Variables**: Support for `FRONTEND_URL` and `CORS_ORIGINS` env vars
3. **Comprehensive Origins**: Includes common deployment platforms
4. **Health Check**: Returns CORS configuration for debugging

## Testing After Fix

1. Go to https://www.zoroastervers.com/admin/content/homepage
2. Navigate to "Section Visibility" tab
3. Toggle any section off (uncheck)
4. Click "Save Settings"
5. **It should now save successfully without CORS errors**
6. Visit your homepage to verify the section is hidden

## Additional Notes

- The Supabase fallback is working, which is why you can see some data
- Admin operations that go directly to the API fail due to CORS
- Public homepage falls back to Supabase when API fails
- Once CORS is fixed, both admin and public features will work optimally

## Environment Variable Priority

1. `CORS_ORIGINS` (comma-separated list) - highest priority
2. `FRONTEND_URL` (single URL) - medium priority  
3. Hardcoded domains in code - fallback

This ensures flexibility for different deployment scenarios.