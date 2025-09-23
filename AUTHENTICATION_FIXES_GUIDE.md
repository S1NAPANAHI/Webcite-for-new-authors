# Complete Authentication Fixes Guide 🔧

## 🚨 Critical Issues Identified

### 1. Multiple GoTrueClient Instances
- **Error**: `Multiple GoTrueClient instances detected in the same browser context`
- **Cause**: Creating multiple Supabase clients across packages and components
- **Impact**: Undefined authentication behavior, session conflicts

### 2. Invalid Refresh Token
- **Error**: `AuthApiError: Invalid Refresh Token: Refresh Token Not Found`
- **Cause**: Corrupted browser storage or token conflicts
- **Impact**: Cannot maintain authentication sessions

### 3. Missing User Profiles
- **Error**: User authentication succeeds but profile data is null
- **Cause**: Profile records not created for existing auth users
- **Impact**: Application fails to load user-specific data

## ✅ Fixes Applied

### 📝 File Changes Made:

1. **Fixed Supabase Singleton** - `apps/frontend/src/lib/supabase.ts`
   - Proper singleton pattern implementation
   - Unique storage key (`zoroaster-auth`)
   - Better error handling and logging

2. **Updated Main Bootstrap** - `apps/frontend/src/main.tsx`
   - Uses singleton Supabase client consistently
   - Prevents multiple window attachments
   - Cleaner client management

3. **Added Auth Utilities** - `apps/frontend/src/lib/auth-utils.ts`
   - Browser storage cleanup functions
   - Debug utilities for troubleshooting
   - Emergency auth state reset functions

4. **Database Fixes** - `database/auth-fixes.sql`
   - Creates missing profiles for existing users
   - Auto-profile creation trigger
   - Fixed RLS policies
   - Complete user data setup

## 🛠️ Manual Steps Required

### Step 1: Apply Database Fixes

1. **Open Supabase Dashboard**: Go to your project SQL Editor
2. **Run the auth fixes**: Copy and paste the entire content of `database/auth-fixes.sql`
3. **Execute the script**: This will:
   - Create missing profiles
   - Set up user stats and preferences
   - Add auto-profile creation trigger
   - Fix RLS policies

### Step 2: Clear Browser Storage (Critical!)

**Option A - Browser Console (Recommended)**:
```javascript
// Run these commands in your browser console
localStorage.clear();
sessionStorage.clear();
// Or use the utility we added:
clearAuthStorage();
location.reload();
```

**Option B - Manual Cleanup**:
1. Open DevTools (F12)
2. Go to Application → Storage
3. Clear **Local Storage** and **Session Storage** for your domain
4. Refresh the page

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
# or
pnpm dev
```

### Step 4: Test Authentication

1. **Clear Browser Data**: Follow Step 2 above
2. **Visit Login Page**: Navigate to `/login`
3. **Check Console**: Should see only **one** "Supabase client created as singleton" message
4. **Login**: Use your credentials (`sina.panahi200@gmail.com`)
5. **Verify Success**: Should redirect to homepage and stay logged in
6. **Test Persistence**: Refresh page - should remain authenticated

## 🔍 Debugging Commands

After applying fixes, use these in your browser console:

```javascript
// Debug authentication state
debugAuthState();

// Check if singleton is working
console.log('Supabase instances:', window.supabase);

// Clear storage if issues persist
clearAuthStorage();

// Full reset (nuclear option)
resetAuthState();
```

## 📊 What Should Happen After Fixes

### Console Messages (Good Signs):
```
✅ Supabase client: Using existing singleton
✅ Environment variables check: Set
🌍 Supabase client attached to window
LoginPage: Redirecting to home page
useAuth context: {isAuthenticated: true, role: 'admin', userProfile: {...}}
```

### Console Messages (Problems):
```
❌ Multiple GoTrueClient instances detected... (should be gone)
❌ AuthApiError: Invalid Refresh Token (should be resolved)
❌ userProfile: null (should have data)
```

## 🔥 Emergency Fixes

If problems persist:

### 1. Package Conflicts
Check your `@zoroaster/shared` and `@zoroaster/ui` packages:
- Make sure they import from your main singleton
- Don't create their own Supabase instances
- Use the same storage key

### 2. Environment Variables
Verify in browser console:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20) + '...');
```

### 3. Database Connection
Test in Supabase SQL Editor:
```sql
-- Check if your user exists
SELECT u.id, u.email, p.role, p.subscriptionstatus
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'sina.panahi200@gmail.com';
```

### 4. Nuclear Option
If all else fails:
```bash
# Delete node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear all browser data
# Restart dev server
pnpm dev
```

## ✨ Expected Results

After applying all fixes:

✅ **No more Multiple GoTrueClient warnings**  
✅ **Successful login without refresh token errors**  
✅ **User profile loads correctly** (`userProfile: {...}` not null)  
✅ **Session persistence** (stays logged in after refresh)  
✅ **Single Supabase client instance** throughout the app  
✅ **Clean console logs** with proper authentication flow  

## 📞 Support

If you encounter any issues after applying these fixes:

1. Run `debugAuthState()` in browser console
2. Check the database using the debugging queries in `auth-fixes.sql`
3. Verify all environment variables are set correctly
4. Ensure the database migration completed successfully

The fixes target the root causes of your authentication issues and should provide a stable foundation for your app's auth system.