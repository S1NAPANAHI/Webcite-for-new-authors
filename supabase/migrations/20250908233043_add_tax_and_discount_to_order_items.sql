ALTER TABLE public.order_items
ADD COLUMN tax_amount INTEGER DEFAULT 0,
ADD COLUMN discount_amount INTEGER DEFAULT 0;