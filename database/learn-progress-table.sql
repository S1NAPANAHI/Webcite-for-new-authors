-- Learn Progress Tracking Table
-- Run this in your Supabase SQL Editor to enable progress tracking

-- Learn Progress Table (tracks user progress on learning resources)
CREATE TABLE IF NOT EXISTS learn_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES learn_content(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMPTZ,
  time_spent INTEGER DEFAULT 0, -- in minutes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Enable Row Level Security
ALTER TABLE learn_progress ENABLE ROW LEVEL SECURITY;

-- Policy for users to access their own progress
CREATE POLICY "Users can view their own progress" ON learn_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON learn_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON learn_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON learn_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Policy for admins to view all progress (for analytics)
CREATE POLICY "Admin access to all progress" ON learn_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create updated_at trigger for learn_progress
CREATE TRIGGER update_learn_progress_updated_at BEFORE UPDATE ON learn_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learn_progress_user_id ON learn_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learn_progress_resource_id ON learn_progress(resource_id);
CREATE INDEX IF NOT EXISTS idx_learn_progress_completed ON learn_progress(completed);
CREATE INDEX IF NOT EXISTS idx_learn_progress_completion_date ON learn_progress(completion_date);
