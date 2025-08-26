ALTER TABLE public.pages
ADD COLUMN category_id uuid REFERENCES public.wiki_categories(id) ON DELETE SET NULL;