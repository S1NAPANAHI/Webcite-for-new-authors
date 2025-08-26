-- Migration to fix Row Level Security on the profiles table.

-- 1. Drop the overly permissive SELECT policy on profiles.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- 2. Recreate the policy to be more secure.
-- This policy allows a user to select ONLY their own profile.
-- Admins can still view all profiles due to the "Admins can manage all profiles." policy.
CREATE POLICY "Users can view their own profile."
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);
