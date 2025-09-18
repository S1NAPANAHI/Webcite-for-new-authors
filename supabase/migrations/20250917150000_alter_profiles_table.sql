-- Migration: Alter the existing profiles table to match the new schema
-- This preserves all existing user data in the profiles table.

BEGIN;

-- Add the new reading_preferences column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS reading_preferences JSONB DEFAULT '{}';

-- Drop old columns that are no longer needed in the new schema
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS website,
DROP COLUMN IF EXISTS bio,
DROP COLUMN IF EXISTS location,
DROP COLUMN IF EXISTS favorite_genre,
DROP COLUMN IF EXISTS subscription_tier,
DROP COLUMN IF EXISTS current_period_end,
DROP COLUMN IF EXISTS cancel_at_period_end,
DROP COLUMN IF EXISTS beta_reader_status,
DROP COLUMN IF EXISTS beta_reader_approved_at,
DROP COLUMN IF EXISTS profile_visibility,
DROP COLUMN IF EXISTS show_reading_progress,
DROP COLUMN IF EXISTS show_achievements,
DROP COLUMN IF EXISTS email_notifications,
DROP COLUMN IF EXISTS marketing_emails,
DROP COLUMN IF EXISTS total_reading_time,
DROP COLUMN IF EXISTS books_completed,
DROP COLUMN IF EXISTS chapters_read,
DROP COLUMN IF EXISTS reviews_written,
DROP COLUMN IF EXISTS reading_goal,
DROP COLUMN IF EXISTS reading_streak,
DROP COLUMN IF EXISTS achievements_count,
DROP COLUMN IF EXISTS currently_reading,
DROP COLUMN IF EXISTS last_active_at;

-- Standardize the subscription_status column
-- First, drop the old role column if it exists, as the new schema uses subscription_status for roles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Drop the old subscription_status text column to be replaced with a new one with a CHECK constraint
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_status;

-- Add the new subscription_status column with the correct type and constraint
ALTER TABLE public.profiles
ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'admin'));

-- Note: This will reset all users to the 'free' tier. We will handle assigning admins later if needed.

COMMIT;
