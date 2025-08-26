-- Create daily_spins table
CREATE TABLE public.daily_spins (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    spin_date date NOT NULL,
    spin_count integer DEFAULT 0 NOT NULL,
    PRIMARY KEY (user_id, spin_date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can read their own spin counts
CREATE POLICY "Enable read access for authenticated users"
ON public.daily_spins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for INSERT: Users can insert their own spin counts
CREATE POLICY "Enable insert for authenticated users"
ON public.daily_spins FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can update their own spin counts
CREATE POLICY "Enable update for authenticated users"
ON public.daily_spins FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);