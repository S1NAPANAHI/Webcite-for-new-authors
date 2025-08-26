ALTER TABLE public.products
ADD COLUMN work_id uuid REFERENCES public.works(id) ON DELETE SET NULL;

ALTER TABLE public.products
ADD COLUMN content_grants jsonb DEFAULT '[]'::jsonb;