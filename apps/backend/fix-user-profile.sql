-- ==============================================================================
-- FIX MISSING USER PROFILE
-- ==============================================================================
-- This script creates the missing profile for your user ID
-- ==============================================================================

-- Create profile for the user that's causing the 406 errors
INSERT INTO public.profiles (
    id, 
    username, 
    display_name, 
    role,
    subscription_tier,
    subscription_status
) VALUES (
    'f099bd07-8de8-48ca-9266-6ae28d79f7a6'::uuid,
    'admin_user',
    'Admin User',
    'admin'::public.user_role,
    2, -- Premium tier
    'active'
) ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    subscription_tier = EXCLUDED.subscription_tier,
    subscription_status = EXCLUDED.subscription_status,
    updated_at = now();

-- Create user statistics for this user
INSERT INTO public.user_statistics (user_id) 
VALUES ('f099bd07-8de8-48ca-9266-6ae28d79f7a6'::uuid)
ON CONFLICT (user_id) DO NOTHING;

-- Create today's daily_spins record for this user
INSERT INTO public.daily_spins (user_id, spin_date, spin_count)
VALUES ('f099bd07-8de8-48ca-9266-6ae28d79f7a6'::uuid, CURRENT_DATE, 0)
ON CONFLICT (user_id, spin_date) DO NOTHING;

-- Also create a daily_user_stats record
INSERT INTO public.daily_user_stats (date, user_id)
VALUES (CURRENT_DATE, 'f099bd07-8de8-48ca-9266-6ae28d79f7a6'::uuid)
ON CONFLICT (date, user_id) DO NOTHING;
