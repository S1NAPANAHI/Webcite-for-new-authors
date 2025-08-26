-- Migration: 20250819000400_ecommerce_tables.sql (Modified for manual execution)

-- Create custom types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE public.product_type AS ENUM (
            'single_issue',
            'bundle',
            'chapter_pass',
            'arc_pass'
        );
    END IF;
END$$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    product_type product_type,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.prices (
    id text PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    nickname text,
    currency text NOT NULL,
    unit_amount integer NOT NULL,
    interval text,
    active boolean DEFAULT true NOT NULL,
    trial_days integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.purchases (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    price_id text NOT NULL REFERENCES public.prices(id) ON DELETE RESTRICT,
    status text NOT NULL,
    purchased_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    total integer NOT NULL,
    currency text NOT NULL,
    hosted_invoice_url text,
    pdf_url text,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.refunds (
    id text PRIMARY KEY,
    invoice_id text NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    currency text NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.entitlements (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    scope text NOT NULL,
    source text NOT NULL,
    starts_at timestamp with time zone DEFAULT now(),
    ends_at timestamp with time zone,
    created_by uuid REFERENCES auth.users ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.entitlements(user_id);

-- RLS Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public products are viewable by everyone." ON public.products;
CREATE POLICY "Public products are viewable by everyone." ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage products." ON public.products;
CREATE POLICY "Admins can manage products." ON public.products FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public prices are viewable by everyone." ON public.prices;
CREATE POLICY "Public prices are viewable by everyone." ON public.prices FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage prices." ON public.prices;
CREATE POLICY "Admins can manage prices." ON public.prices FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own purchases." ON public.purchases;
CREATE POLICY "Users can view their own purchases." ON public.purchases FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all purchases." ON public.purchases;
CREATE POLICY "Admins can manage all purchases." ON public.purchases FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own invoices." ON public.invoices;
CREATE POLICY "Users can view their own invoices." ON public.invoices FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all invoices." ON public.invoices;
CREATE POLICY "Admins can manage all invoices." ON public.invoices FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view refunds for their invoices." ON public.refunds;
CREATE POLICY "Users can view refunds for their invoices." ON public.refunds FOR SELECT USING (
  invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can manage all refunds." ON public.refunds;
CREATE POLICY "Admins can manage all refunds." ON public.refunds FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own entitlements." ON public.entitlements;
CREATE POLICY "Users can view their own entitlements." ON public.entitlements FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all entitlements." ON public.entitlements;
CREATE POLICY "Admins can manage all entitlements." ON public.entitlements FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role
);

-- Triggers to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_prices_updated_at ON public.prices;
CREATE TRIGGER update_prices_updated_at
  BEFORE UPDATE ON public.prices
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();