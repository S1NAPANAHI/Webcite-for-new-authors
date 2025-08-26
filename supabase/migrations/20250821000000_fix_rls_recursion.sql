-- Function to get a user's role, bypassing RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS public.user_role AS $$
DECLARE
  user_role_result public.user_role;
BEGIN
  -- This function is SECURITY DEFINER, so it bypasses RLS.
  -- It should only be used in policies where the user's role needs to be checked.
  SELECT role INTO user_role_result FROM public.profiles WHERE id = user_id;
  RETURN user_role_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old policies
DROP POLICY IF EXISTS "Admins can manage all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage user roles." ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all subscriptions." ON public.subscriptions;

-- Recreate policies using the get_user_role function to avoid recursion

-- RLS Policies for profiles
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage user roles." ON public.user_roles FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- RLS Policies for subscriptions
CREATE POLICY "Admins can manage all subscriptions." ON public.subscriptions FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);