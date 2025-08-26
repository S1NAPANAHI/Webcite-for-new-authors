-- Migration: create_product_reviews_table
-- Description: Creates a table for user reviews and ratings of products.

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products ON DELETE CASCADE,
    rating integer NOT NULL,
    review_text text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT product_reviews_rating_check CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT product_reviews_user_product_unique UNIQUE (user_id, product_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);

-- RLS Policies
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all product reviews." ON public.product_reviews;
CREATE POLICY "Public can view all product reviews."
    ON public.product_reviews FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own reviews." ON public.product_reviews;
CREATE POLICY "Users can insert their own reviews."
    ON public.product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews." ON public.product_reviews;
CREATE POLICY "Users can update their own reviews."
    ON public.product_reviews FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews." ON public.product_reviews;
CREATE POLICY "Users can delete their own reviews."
    ON public.product_reviews FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all reviews." ON public.product_reviews;
CREATE POLICY "Admins can manage all reviews."
    ON public.product_reviews FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Trigger to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON public.product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();