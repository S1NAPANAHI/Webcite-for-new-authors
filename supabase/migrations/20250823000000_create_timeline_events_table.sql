-- Create timeline_events table
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    background_image TEXT,
    is_published BOOLEAN DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create timeline_nested_events table for nested events
CREATE TABLE IF NOT EXISTS public.timeline_nested_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timeline_event_id UUID NOT NULL REFERENCES public.timeline_events(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_nested_events ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_timeline_events_order ON public.timeline_events("order");
CREATE INDEX IF NOT EXISTS idx_timeline_events_published ON public.timeline_events(is_published);
CREATE INDEX IF NOT EXISTS idx_timeline_nested_events_event_id ON public.timeline_nested_events(timeline_event_id);

-- Create RLS policies for timeline_events
CREATE POLICY "Enable read access for all users" 
ON public.timeline_events 
FOR SELECT 
TO authenticated, anon
USING (is_published = true);

CREATE POLICY "Enable all access for admin users"
ON public.timeline_events
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

-- Create RLS policies for timeline_nested_events
CREATE POLICY "Enable read access for all users on nested events"
ON public.timeline_nested_events
FOR SELECT
TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM public.timeline_events te 
        WHERE te.id = timeline_event_id 
        AND te.is_published = true
    )
);

CREATE POLICY "Enable all access for admin users on nested events"
ON public.timeline_nested_events
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated' AND auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_timeline_events_updated_at
BEFORE UPDATE ON public.timeline_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_nested_events_updated_at
BEFORE UPDATE ON public.timeline_nested_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle created_by and updated_by
CREATE OR REPLACE FUNCTION handle_timeline_event_user_info()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_by = auth.uid();
        NEW.updated_by = auth.uid();
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user info
CREATE TRIGGER handle_timeline_event_user_info_trigger
BEFORE INSERT OR UPDATE ON public.timeline_events
FOR EACH ROW
EXECUTE FUNCTION handle_timeline_event_user_info();
