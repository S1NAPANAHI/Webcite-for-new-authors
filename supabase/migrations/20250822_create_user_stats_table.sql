-- Create user_stats table
CREATE TABLE public.user_stats (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    books_read integer DEFAULT 0 NOT NULL,
    reading_hours integer DEFAULT 0 NOT NULL,
    achievements integer DEFAULT 0 NOT NULL,
    currently_reading text DEFAULT 'None' NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can read their own stats
CREATE POLICY "Enable read access for authenticated users on user_stats"
ON public.user_stats FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for INSERT: Users can insert their own stats
CREATE POLICY "Enable insert for authenticated users on user_stats"
ON public.user_stats FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can update their own stats
CREATE POLICY "Enable update for authenticated users on user_stats"
ON public.user_stats FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);