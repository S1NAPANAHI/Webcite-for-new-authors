-- Migrate roles from user_roles to profiles.subscription_status
UPDATE public.profiles p
SET subscription_status =
    CASE
        WHEN EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'admin') THEN 'admin'
        WHEN EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'super_admin') THEN 'admin'
        WHEN EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'user') THEN 'free'
        WHEN EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'support') THEN 'free'
        WHEN EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'accountant') THEN 'free'
        WHEN EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'beta_reader') THEN 'free'
        -- Default other roles to 'free' if no specific mapping is provided
        ELSE 'free'
    END
WHERE EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id);

-- Ensure users without an entry in user_roles default to 'free'
UPDATE public.profiles
SET subscription_status = 'free'
WHERE subscription_status IS NULL;
