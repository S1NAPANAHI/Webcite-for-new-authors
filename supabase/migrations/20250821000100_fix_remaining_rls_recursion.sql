-- Migration: 20250821000100_fix_remaining_rls_recursion.sql (Combined with function creation)

-- Function to get a user's role, bypassing RLS
-- This is included here to ensure it exists before being used in the policies below.
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


-- Drop the old recursive policies from other migration files

-- From 20250819000200_content_tables.sql
DROP POLICY IF EXISTS "Admins can manage works." ON public.works;
DROP POLICY IF EXISTS "Admins can manage chapters." ON public.chapters;
DROP POLICY IF EXISTS "Admins can manage all posts." ON public.posts;
DROP POLICY IF EXISTS "Admins can manage all pages." ON public.pages;
DROP POLICY IF EXISTS "Admins can manage characters." ON public.characters;

-- From 20250819000400_ecommerce_tables.sql
DROP POLICY IF EXISTS "Admins can manage products." ON public.products;
DROP POLICY IF EXISTS "Admins can manage prices." ON public.prices;
DROP POLICY IF EXISTS "Admins can manage all purchases." ON public.purchases;
DROP POLICY IF EXISTS "Admins can manage all invoices." ON public.invoices;
DROP POLICY IF EXISTS "Admins can manage all refunds." ON public.refunds;
DROP POLICY IF EXISTS "Admins can manage all entitlements." ON public.entitlements;

-- From 20250819000500_misc_tables.sql
DROP POLICY IF EXISTS "Admins can manage news items." ON public.news_items;
DROP POLICY IF EXISTS "Admins can manage release items." ON public.release_items;
DROP POLICY IF EXISTS "Admins can manage homepage content." ON public.homepage_content;
DROP POLICY IF EXISTS "Admins can view the audit log." ON public.audit_log;


-- Recreate policies using the get_user_role function

-- For content tables
CREATE POLICY "Admins can manage works." ON public.works FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage chapters." ON public.chapters FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage all posts." ON public.posts FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage all pages." ON public.pages FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage characters." ON public.characters FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- For ecommerce tables
CREATE POLICY "Admins can manage products." ON public.products FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage prices." ON public.prices FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage all purchases." ON public.purchases FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage all invoices." ON public.invoices FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage all refunds." ON public.refunds FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage all entitlements." ON public.entitlements FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- For misc tables
CREATE POLICY "Admins can manage news items." ON public.news_items FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage release items." ON public.release_items FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can manage homepage content." ON public.homepage_content FOR ALL USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can view the audit log." ON public.audit_log FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
