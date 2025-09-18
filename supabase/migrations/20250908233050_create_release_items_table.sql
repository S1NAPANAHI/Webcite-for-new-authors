CREATE TABLE IF NOT EXISTS public.release_items (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    type text NOT NULL,
    description text,
    release_date date,
    link text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);