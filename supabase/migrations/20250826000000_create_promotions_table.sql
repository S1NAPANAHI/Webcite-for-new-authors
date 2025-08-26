-- Migration: create_promotions_table
-- Description: Creates a table to manage store promotions and discount codes.

-- Create custom type for discount type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
        CREATE TYPE public.discount_type AS ENUM (
            'percentage',
            'fixed_amount'
        );
    END IF;
END$$;

-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    description text,
    discount_type public.discount_type NOT NULL,
    discount_value numeric NOT NULL,
    active boolean DEFAULT true NOT NULL,
    start_date timestamptz,
    end_date timestamptz,
    usage_limit integer,
    usage_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT promotions_code_check CHECK (code <> ''),
    CONSTRAINT promotions_discount_value_check CHECK (discount_value > 0)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_active_dates ON public.promotions(active, start_date, end_date);

-- RLS Policies
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active promotions." ON public.promotions;
CREATE POLICY "Public can view active promotions."
    ON public.promotions FOR SELECT
    USING (active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

DROP POLICY IF EXISTS "Admins can manage promotions." ON public.promotions;
CREATE POLICY "Admins can manage promotions."
    ON public.promotions FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Trigger to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_promotions_updated_at ON public.promotions;
CREATE TRIGGER update_promotions_updated_at
    BEFORE UPDATE ON public.promotions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();