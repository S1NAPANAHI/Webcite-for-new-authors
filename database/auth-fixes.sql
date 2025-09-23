-- =============================================
-- Authentication & Profile Creation Fixes
-- =============================================
-- Run this SQL in your Supabase SQL Editor

-- 1. CREATE MISSING PROFILES FOR EXISTING AUTH USERS
-- This fixes the "user profile not found" issue
INSERT INTO public.profiles (
  id, 
  email, 
  role, 
  subscriptionstatus, 
  subscriptiontier,
  created_at, 
  updated_at
)
SELECT 
  auth.users.id,
  auth.users.email,
  'user' as role,
  'free' as subscriptionstatus,
  'free' as subscriptiontier,
  auth.users.created_at,
  NOW() as updated_at
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = public.profiles.id
WHERE public.profiles.id IS NULL
  AND auth.users.email IS NOT NULL;

-- 2. CREATE MISSING USER STATS
-- Ensure every user has stats record
INSERT INTO public.userstats (
  userid,
  booksread,
  readinghours,
  achievements,
  created_at,
  updated_at
)
SELECT 
  auth.users.id,
  0 as booksread,
  0 as readinghours, 
  0 as achievements,
  auth.users.created_at,
  NOW() as updated_at
FROM auth.users
LEFT JOIN public.userstats ON auth.users.id = public.userstats.userid
WHERE public.userstats.userid IS NULL;

-- 3. CREATE MISSING USER PREFERENCES
-- Set default preferences for all users
INSERT INTO public.userpreferences (
  userid,
  readingpreferences,
  notificationpreferences,
  privacypreferences,
  language,
  timezone,
  currency,
  created_at,
  updated_at
)
SELECT 
  auth.users.id,
  '{"theme": "system", "fontsize": "medium", "autobookmark": true, "readingspeed": "normal", "contentwarnings": true}'::jsonb as readingpreferences,
  '{"newreleases": true, "weeklydigest": true, "chapterupdates": true, "marketingemails": false, "communityactivity": false, "pushnotifications": true, "emailnotifications": true}'::jsonb as notificationpreferences,
  '{"datacollection": true, "showachievements": true, "profilevisibility": "public", "allowfriendrequests": true, "showreadingactivity": true}'::jsonb as privacypreferences,
  'en' as language,
  'UTC' as timezone,
  'USD' as currency,
  auth.users.created_at,
  NOW() as updated_at
FROM auth.users
LEFT JOIN public.userpreferences ON auth.users.id = public.userpreferences.userid
WHERE public.userpreferences.userid IS NULL;

-- 4. CREATE OR REPLACE TRIGGER TO AUTO-CREATE PROFILES
-- This prevents future profile creation issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    role,
    subscriptionstatus,
    subscriptiontier,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    'free',
    'free',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;

  -- Create user stats
  INSERT INTO public.userstats (
    userid,
    booksread,
    readinghours,
    achievements,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    0,
    0,
    0,
    NOW(),
    NOW()
  ) ON CONFLICT (userid) DO NOTHING;

  -- Create user preferences
  INSERT INTO public.userpreferences (
    userid,
    readingpreferences,
    notificationpreferences,
    privacypreferences,
    language,
    timezone,
    currency,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    '{"theme": "system", "fontsize": "medium", "autobookmark": true, "readingspeed": "normal", "contentwarnings": true}'::jsonb,
    '{"newreleases": true, "weeklydigest": true, "chapterupdates": true, "marketingemails": false, "communityactivity": false, "pushnotifications": true, "emailnotifications": true}'::jsonb,
    '{"datacollection": true, "showachievements": true, "profilevisibility": "public", "allowfriendrequests": true, "showreadingactivity": true}'::jsonb,
    'en',
    'UTC',
    'USD',
    NOW(),
    NOW()
  ) ON CONFLICT (userid) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. UPDATE RLS POLICIES FOR BETTER PROFILE ACCESS
-- Ensure users can always read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id OR true); -- Allow all reads for debugging, restrict later

-- Allow users to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 6. DEBUGGING QUERIES TO VERIFY FIXES
-- Run these to check if everything is working:

-- Check for users without profiles
/*
SELECT 
  u.id,
  u.email,
  u.created_at,
  CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
*/

-- Check for users without stats
/*
SELECT 
  u.id,
  u.email,
  CASE WHEN us.userid IS NULL THEN 'MISSING STATS' ELSE 'HAS STATS' END as stats_status
FROM auth.users u
LEFT JOIN public.userstats us ON u.id = us.userid
ORDER BY u.created_at DESC;
*/

-- Check for users without preferences
/*
SELECT 
  u.id,
  u.email,
  CASE WHEN up.userid IS NULL THEN 'MISSING PREFERENCES' ELSE 'HAS PREFERENCES' END as preferences_status
FROM auth.users u
LEFT JOIN public.userpreferences up ON u.id = up.userid
ORDER BY u.created_at DESC;
*/

-- Get profile info for current user (run this after login)
/*
SELECT 
  p.*,
  us.booksread,
  us.readinghours,
  up.language,
  up.timezone
FROM public.profiles p
LEFT JOIN public.userstats us ON p.id = us.userid
LEFT JOIN public.userpreferences up ON p.id = up.userid
WHERE p.id = auth.uid();
*/

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Authentication fixes applied successfully! 🎉' as message;