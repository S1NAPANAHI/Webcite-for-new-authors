-- =====================================================
-- READING PROGRESS TABLE
-- Tracks user reading progress for chapters
-- =====================================================

-- Create reading progress table
CREATE TABLE IF NOT EXISTS reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    reading_time_minutes INTEGER DEFAULT 0 CHECK (reading_time_minutes >= 0),
    
    -- User data
    bookmarks JSONB DEFAULT '[]' NOT NULL,
    notes JSONB DEFAULT '[]' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(user_id, chapter_id),
    CONSTRAINT valid_bookmarks CHECK (jsonb_typeof(bookmarks) = 'array'),
    CONSTRAINT valid_notes CHECK (jsonb_typeof(notes) = 'array')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON reading_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON reading_progress(last_read_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_progress_completed ON reading_progress(completed);

-- Enable RLS
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "reading_progress_select_policy" ON reading_progress;
DROP POLICY IF EXISTS "reading_progress_insert_policy" ON reading_progress;
DROP POLICY IF EXISTS "reading_progress_update_policy" ON reading_progress;
DROP POLICY IF EXISTS "reading_progress_delete_policy" ON reading_progress;

-- Users can only see their own reading progress
CREATE POLICY "reading_progress_select_policy" ON reading_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own reading progress
CREATE POLICY "reading_progress_insert_policy" ON reading_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reading progress
CREATE POLICY "reading_progress_update_policy" ON reading_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reading progress
CREATE POLICY "reading_progress_delete_policy" ON reading_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_reading_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_read_at = NOW();
    
    -- Auto-mark as completed if progress is 95% or more
    IF NEW.progress_percentage >= 95 AND OLD.completed = FALSE THEN
        NEW.completed = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_reading_progress_updated_at_trigger ON reading_progress;
CREATE TRIGGER update_reading_progress_updated_at_trigger
    BEFORE UPDATE ON reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_reading_progress_updated_at();

-- Grant permissions
GRANT ALL ON reading_progress TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create helper function to get user's reading progress for a chapter
CREATE OR REPLACE FUNCTION get_user_chapter_progress(chapter_uuid UUID)
RETURNS TABLE (
    progress_percentage INTEGER,
    completed BOOLEAN,
    last_read_at TIMESTAMP WITH TIME ZONE,
    reading_time_minutes INTEGER,
    bookmarks JSONB,
    notes JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rp.progress_percentage,
        rp.completed,
        rp.last_read_at,
        rp.reading_time_minutes,
        rp.bookmarks,
        rp.notes
    FROM reading_progress rp
    WHERE rp.user_id = auth.uid() 
      AND rp.chapter_id = chapter_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update or create reading progress
CREATE OR REPLACE FUNCTION upsert_reading_progress(
    chapter_uuid UUID,
    progress_percent INTEGER,
    reading_minutes INTEGER DEFAULT 0,
    user_bookmarks JSONB DEFAULT '[]',
    user_notes JSONB DEFAULT '[]'
)
RETURNS UUID AS $$
DECLARE
    progress_id UUID;
BEGIN
    INSERT INTO reading_progress (
        user_id,
        chapter_id,
        progress_percentage,
        reading_time_minutes,
        bookmarks,
        notes
    ) VALUES (
        auth.uid(),
        chapter_uuid,
        progress_percent,
        reading_minutes,
        user_bookmarks,
        user_notes
    )
    ON CONFLICT (user_id, chapter_id)
    DO UPDATE SET
        progress_percentage = GREATEST(reading_progress.progress_percentage, progress_percent),
        reading_time_minutes = reading_progress.reading_time_minutes + reading_minutes,
        bookmarks = user_bookmarks,
        notes = user_notes,
        updated_at = NOW(),
        last_read_at = NOW()
    RETURNING id INTO progress_id;
    
    RETURN progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sample reading progress data if no chapters exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM chapters LIMIT 1) THEN
        RAISE NOTICE 'Reading progress system setup complete!';
        RAISE NOTICE 'Chapter reader will be available at: /read/{issue-slug}/{chapter-slug}';
    ELSE
        RAISE NOTICE 'No chapters found. Create some chapters first, then the reading system will work.';
    END IF;
END $$;