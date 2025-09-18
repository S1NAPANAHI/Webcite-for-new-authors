CREATE OR REPLACE FUNCTION get_admin_profiles()
RETURNS TABLE(id UUID, email TEXT, subscription_status TEXT, created_at TIMESTAMPTZ) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.email, p.subscription_status, p.created_at
    FROM public.profiles p;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
