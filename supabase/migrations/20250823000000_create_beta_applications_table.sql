
-- Create beta_application_status enum
CREATE TYPE beta_application_status AS ENUM ('pending', 'approved', 'denied');

-- Create beta_applications table
CREATE TABLE beta_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status beta_application_status DEFAULT 'pending',
    admin_notes TEXT,

    -- Stage 1: Application Form
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    time_zone TEXT NOT NULL,
    country TEXT,
    goodreads TEXT,
    beta_commitment TEXT NOT NULL,
    hours_per_week TEXT NOT NULL,
    portal_use TEXT NOT NULL,
    recent_reads TEXT,
    interest_statement TEXT NOT NULL,
    prior_beta TEXT,
    feedback_philosophy TEXT NOT NULL,
    track_record TEXT,
    communication TEXT NOT NULL,
    devices TEXT[],
    access_needs TEXT,
    demographics TEXT,
    stage1_raw_score INTEGER,
    stage1_passed BOOLEAN,
    stage1_auto_fail BOOLEAN,

    -- Stage 2: Comprehension Test
    q1 TEXT,
    q2 TEXT,
    clarity_feedback TEXT,
    pacing_analysis TEXT,
    taste_alignment TEXT,
    stage2_raw_score INTEGER,
    stage2_passed BOOLEAN,

    -- Stage 3: Calibration Test
    worse_passage TEXT,
    passage_a_analysis TEXT,
    passage_b_analysis TEXT,
    priority_fix TEXT,
    stage3_raw_score INTEGER,
    stage3_passed BOOLEAN,

    -- Stage 4: Timed Trial
    overall_assessment TEXT,
    chapter_summary TEXT,
    stage4_raw_score INTEGER,
    stage4_passed BOOLEAN,
    composite_score NUMERIC
);

-- Enable Row Level Security (RLS)
ALTER TABLE beta_applications ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own application
CREATE POLICY "Users can insert their own beta application." ON beta_applications
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to view their own application
CREATE POLICY "Users can view their own beta application." ON beta_applications
FOR SELECT USING (auth.uid() = user_id);

-- Policy for admins to view all applications
CREATE POLICY "Admins can view all beta applications." ON beta_applications
FOR SELECT USING (public.is_admin());

-- Policy for admins to update application status and notes
CREATE POLICY "Admins can update beta application status and notes." ON beta_applications
FOR UPDATE USING (public.is_admin());

-- Policy for admins to delete applications (optional)
CREATE POLICY "Admins can delete beta applications." ON beta_applications
FOR DELETE USING (public.is_admin());
