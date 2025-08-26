ALTER TABLE public.pages
ADD COLUMN folder_id uuid REFERENCES public.wiki_folders(id) ON DELETE SET NULL;