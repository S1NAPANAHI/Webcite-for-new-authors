# Database Debugging Steps

## Current Issue

Homepage section visibility changes:
- ✅ **Appear successful** in API responses (`{success: true, data: {...}}`)
- ✅ **No errors** in browser console
- ❌ **Don't persist** when page is refreshed or viewed from homepage

## Immediate Debugging Actions

### Step 1: Check Enhanced Backend Logs

After the backend redeploys with enhanced logging, check your Render logs for:

1. **Key Type Detection**:
   ```
   🔧 Homepage API - Environment check:
     keyType: SERVICE_ROLE
   ```
   Should be `SERVICE_ROLE`, not `ANON`

2. **Database Updates**:
   ```
   📝 PUT /api/homepage/content - Starting update process...
   📋 Request body keys: ["hero_title", "show_latest_news", ...]
   💾 Final updates object keys: ["id", "hero_title", "show_latest_news", ...]
   💾 Section visibility in updates:
     show_latest_news: false
     show_latest_releases: true
     ...
   🚀 Executing database upsert...
   📈 Database operation result: { hasData: true, hasError: false }
   🔍 Verification result: { hasData: true, verifyData: {...} }
   ```

3. **Connection Test**:
   ```
   🔌 Database connection test: SUCCESS
   ✅ Homepage API - Database connection test successful
   ```

### Step 2: Test the Debug Endpoint

Visit: `https://webcite-for-new-authors.onrender.com/api/homepage/debug/database-state`

This will show:
- Current database state
- Supabase client configuration
- Key type being used
- Any connection issues

### Step 3: Manual Database Check

1. **Go to your Supabase Dashboard**
2. **Open SQL Editor**
3. **Run this query**:
   ```sql
   SELECT 
     id,
     hero_title,
     show_latest_news,
     show_latest_releases, 
     show_artist_collaboration,
     show_progress_metrics,
     updated_at
   FROM homepage_content 
   WHERE id = 'homepage';
   ```

4. **Check if data exists and matches your changes**

### Step 4: Test Section Visibility Changes

1. **Go to admin panel**: https://www.zoroastervers.com/admin/content/homepage
2. **Navigate to "Section Visibility" tab**
3. **Make a specific change** (e.g., uncheck "Progress Metrics")
4. **Click "Save Settings"**
5. **Check backend logs** for the detailed update process
6. **Refresh the debug endpoint** to see current database state
7. **Visit homepage** to see if change is reflected

## Possible Root Causes

### 1. Wrong Supabase Key Type

**Problem**: Backend using `ANON` key instead of `SERVICE_ROLE` key
**Solution**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly on Render

### 2. Row Level Security (RLS) Policy Issue

**Problem**: RLS policy blocking updates even with service role key
**Solution**: Check if RLS is enabled and policies are correct

### 3. Database Migration Issue

**Problem**: `homepage_content` table doesn't exist or has wrong schema
**Solution**: Run the migration manually in Supabase

### 4. Transaction Rollback

**Problem**: Updates succeed but get rolled back
**Solution**: Check for constraint violations or trigger failures

### 5. Wrong Database Instance

**Problem**: Backend writing to different database than frontend reads from
**Solution**: Verify `SUPABASE_URL` matches between frontend and backend

## Expected Debug Output

### ✅ Successful Case
```
🔧 Homepage API - Environment check:
  keyType: SERVICE_ROLE
📝 PUT /api/homepage/content - Starting update process...
📋 Request body keys: ["hero_title", "show_latest_news", "show_latest_releases", "show_artist_collaboration", "show_progress_metrics"]
💾 Section visibility in updates:
  show_latest_news: false
  show_latest_releases: true
  show_artist_collaboration: true
  show_progress_metrics: true
🚀 Executing database upsert...
📈 Database operation result: { hasData: true, hasError: false }
🔍 Verification result: { 
  hasData: true, 
  verifyData: { 
    show_latest_news: false,  // ✅ Change persisted
    updated_at: "2025-09-22T21:05:00.000Z"
  }
}
✅ Content updated successfully
```

### ❌ Problematic Cases

**Case 1: Wrong Key Type**
```
🔧 Homepage API - Environment check:
  keyType: ANON  // ❌ Should be SERVICE_ROLE
```

**Case 2: Database Error**
```
📈 Database operation result: { hasData: false, hasError: true }
❌ CRITICAL: Content update error details: {
  message: "new row violates row-level security policy"
}
```

**Case 3: Verification Failure**
```
🔍 Verification result: { 
  hasData: true, 
  verifyData: { 
    show_latest_news: true,  // ❌ Change didn't persist
    updated_at: "2025-09-22T20:00:00.000Z"  // ❌ Old timestamp
  }
}
```

## Quick Fixes by Scenario

### If keyType is ANON:
1. Set `SUPABASE_SERVICE_ROLE_KEY` in Render environment variables
2. Redeploy backend

### If database errors appear:
1. Check RLS policies in Supabase dashboard
2. Ensure `homepage_content` table exists with correct schema
3. Run database migration if needed

### If verification shows old data:
1. Check for multiple database instances
2. Verify `SUPABASE_URL` environment variable
3. Check for caching issues

## Testing Commands

```bash
# Test direct API call
curl -X PUT https://webcite-for-new-authors.onrender.com/api/homepage/content \
  -H "Content-Type: application/json" \
  -d '{"show_latest_news": false}'

# Check debug endpoint
curl https://webcite-for-new-authors.onrender.com/api/homepage/debug/database-state

# Check health endpoint
curl https://webcite-for-new-authors.onrender.com/api/homepage/health
```

## After Fix Verification

1. **Make a change** in admin panel
2. **Check logs** show successful update and verification
3. **Visit homepage** - section should be hidden/visible as expected
4. **Refresh homepage** - change should persist
5. **Check admin panel** - settings should match homepage display

Once we identify the specific issue from the logs, we can implement a targeted fix.