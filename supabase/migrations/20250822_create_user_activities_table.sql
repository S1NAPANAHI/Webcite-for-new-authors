-- Create user_activities table
CREATE TABLE public.user_activities (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type text NOT NULL,
    item_id uuid, -- Can be null if activity is not tied to a specific item
    item_title text NOT NULL,
    progress integer,
    total_progress integer,
    status text NOT NULL, -- 'ongoing', 'completed'
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    cover_image_url text
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can read their own activities
CREATE POLICY "Enable read access for authenticated users on user_activities"
ON public.user_activities FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for INSERT: Users can insert their own activities
CREATE POLICY "Enable insert for authenticated users on user_activities"
ON public.user_activities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can update their own activities
CREATE POLICY "Enable update for authenticated users on user_activities"
ON public.user_activities FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE: Users can delete their own activities
CREATE POLICY "Enable delete for authenticated users on user_activities"
ON public.user_activities FOR DELETE
TO authenticated
USING (auth.uid() = user_id);