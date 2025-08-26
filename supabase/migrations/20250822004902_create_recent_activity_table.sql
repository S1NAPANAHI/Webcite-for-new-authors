-- Migration: 20250822004902_create_recent_activity_table.sql

CREATE TABLE IF NOT EXISTS public.recent_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_recent_activity_created_at ON public.recent_activity(created_at);

-- RLS Policies
ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;

-- Public can view recent activity
DROP POLICY IF EXISTS "Public can view recent activity." ON public.recent_activity;
CREATE POLICY "Public can view recent activity." ON public.recent_activity FOR SELECT USING (true);

-- Admins can manage all recent activity
DROP POLICY IF EXISTS "Admins can manage all recent activity." ON public.recent_activity;
CREATE POLICY "Admins can manage all recent activity." ON public.recent_activity FOR ALL USING (
  public.is_admin()
);
