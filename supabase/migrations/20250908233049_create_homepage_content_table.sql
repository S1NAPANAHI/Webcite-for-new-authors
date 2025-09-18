CREATE TABLE IF NOT EXISTS public.homepage_content (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title text NOT NULL,
    content text,
    section text,
    order_position integer,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);