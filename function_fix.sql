-- ==============================================================================
-- HELPER FUNCTIONS (FIXED VERSION)
-- ==============================================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Drop ALL existing is_admin functions to avoid signature conflicts
-- This will temporarily break dependent policies but they'll be recreated
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Find and drop all is_admin functions
    FOR func_record IN 
        SELECT p.oid, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'is_admin'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS public.is_admin(%s) CASCADE', func_record.args);
    END LOOP;
END $$;

-- Now create the single is_admin function we want
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = p_user_id
          AND (role = 'admin'::public.user_role OR role = 'super_admin'::public.user_role)
    );
$$;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    is_active boolean := false;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_uuid
        AND subscription_status = 'active'
        AND (current_period_end IS NULL OR current_period_end > NOW())
    ) INTO is_active;
    
    RETURN is_active;
END;
$$;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION public.get_user_subscription_tier(user_uuid UUID DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    tier text;
BEGIN
    SELECT subscription_tier 
    FROM public.profiles
    WHERE id = user_uuid
    AND subscription_status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
    INTO tier;
    
    RETURN COALESCE(tier, 'free');
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Create profile for new user
    INSERT INTO public.profiles (id, username, email, role)
    VALUES (NEW.id, NEW.email, NEW.email, 'user');
    
    -- Create user stats
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;
