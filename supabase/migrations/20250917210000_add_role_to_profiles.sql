-- Add a separate 'role' column to the profiles table
-- This separates user roles from subscription status.

BEGIN;

-- Re-create the public.user_role ENUM type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'support', 'accountant', 'user', 'super_admin', 'beta_reader');
    END IF;
END$$;

-- Add the new 'role' column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN role public.user_role DEFAULT 'user'::public.user_role NOT NULL;

-- Update existing profiles to have a default role
UPDATE public.profiles
SET role = 'user'::public.user_role
WHERE role IS NULL;

COMMIT;
