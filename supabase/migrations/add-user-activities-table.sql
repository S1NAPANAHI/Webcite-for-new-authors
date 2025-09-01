-- Migration to add missing user_activities table
-- This table tracks user reading and interaction activities

CREATE TABLE IF NOT EXISTS public.user_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL,
    item_id uuid,
    item_title text NOT NULL,
    progress integer,
    total_progress integer,
    status text NOT NULL,
    timestamp timestamptz DEFAULT now() NOT NULL,
    cover_image_url text
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON public.user_activities(timestamp DESC);

-- Add RLS policy
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activities
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view their own activities"
    ON public.user_activities FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own activities
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;
CREATE POLICY "Users can insert their own activities"
    ON public.user_activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can manage all activities
DROP POLICY IF EXISTS "Admins can manage all activities" ON public.user_activities;
CREATE POLICY "Admins can manage all activities"
    ON public.user_activities FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
