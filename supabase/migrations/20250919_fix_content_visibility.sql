-- =====================================================
-- FIX CONTENT VISIBILITY FOR ALL USERS
-- This migration fixes the issue where content created in admin
-- is only visible to admin users, not all users in the library
-- =====================================================

-- First, let's drop the existing restrictive policies
DROP POLICY IF EXISTS "Authenticated can view all content items" ON content_items;
DROP POLICY IF EXISTS "Content creators can manage their content" ON content_items;
DROP POLICY IF EXISTS "Authenticated can view all chapters" ON chapters;
DROP POLICY IF EXISTS "Content creators can manage their chapters" ON chapters;

-- =====================================================
-- CREATE NEW, MORE PERMISSIVE POLICIES
-- =====================================================

-- Content Items Policies - Allow everyone to view published content
-- and authenticated users to view draft content they have access to
CREATE POLICY "Anyone can view published content items" ON content_items
    FOR SELECT USING (
        status = 'published' OR
        (status = 'scheduled' AND published_at <= NOW())
    );

-- Allow admins and authors to view and manage all content
CREATE POLICY "Admins and authors can manage all content items" ON content_items
    FOR ALL TO authenticated 
    USING (
        -- Check if user is admin
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
        OR
        -- Check if user is author/creator
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'author')
        )
        OR
        -- Check if content was created by this user
        metadata->>'created_by' = auth.uid()::text
    )
    WITH CHECK (
        -- Same checks for insert/update
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'author')
        )
        OR
        metadata->>'created_by' = auth.uid()::text
    );

-- Chapters Policies - Allow everyone to view published chapters
CREATE POLICY "Anyone can view published chapters" ON chapters
    FOR SELECT USING (
        (status = 'published' OR (status = 'scheduled' AND published_at <= NOW()))
        AND 
        EXISTS (
            SELECT 1 FROM content_items ci 
            WHERE ci.id = chapters.issue_id 
            AND (ci.status = 'published' OR (ci.status = 'scheduled' AND ci.published_at <= NOW()))
        )
    );

-- Allow admins and authors to manage all chapters
CREATE POLICY "Admins and authors can manage all chapters" ON chapters
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'author')
        )
        OR
        metadata->>'created_by' = auth.uid()::text
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'author')
        )
        OR
        metadata->>'created_by' = auth.uid()::text
    );

-- =====================================================
-- CREATE HELPER FUNCTION TO CHECK USER ROLES
-- =====================================================

-- Create or replace a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if user is author or admin
CREATE OR REPLACE FUNCTION public.is_user_content_creator(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id 
        AND role IN ('admin', 'author')
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- UPDATE EXISTING CONTENT TO BE PUBLISHED
-- So that existing content created by admin becomes visible
-- =====================================================

-- Update all existing content items to published status if they're currently draft
-- and don't have a published_at date
UPDATE content_items 
SET status = 'published', 
    published_at = COALESCE(published_at, NOW()),
    updated_at = NOW()
WHERE status = 'draft' 
  AND published_at IS NULL;

-- Update all existing chapters to published status if they're currently draft
-- and don't have a published_at date
UPDATE chapters 
SET status = 'published', 
    published_at = COALESCE(published_at, NOW()),
    updated_at = NOW()
WHERE status = 'draft' 
  AND published_at IS NULL
  AND EXISTS (
      SELECT 1 FROM content_items ci 
      WHERE ci.id = chapters.issue_id 
      AND ci.status = 'published'
  );

-- =====================================================
-- CREATE A VIEW FOR LIBRARY DATA
-- This view will be used by the frontend to get properly
-- formatted data with all necessary fields
-- =====================================================

CREATE OR REPLACE VIEW public.library_content_view AS
SELECT 
    ci.*,
    -- Calculate total chapters for this content item (if it's an issue)
    CASE 
        WHEN ci.type = 'issue' THEN (
            SELECT COUNT(*) FROM chapters c 
            WHERE c.issue_id = ci.id 
            AND c.status = 'published'
        )
        ELSE 0
    END as total_chapters,
    
    -- Calculate estimated read time from metadata or chapters
    CASE 
        WHEN ci.metadata ? 'estimated_read_time' THEN 
            (ci.metadata->>'estimated_read_time')::integer
        WHEN ci.type = 'issue' THEN (
            SELECT COALESCE(SUM(estimated_read_time), 0) FROM chapters c 
            WHERE c.issue_id = ci.id 
            AND c.status = 'published'
        )
        ELSE 0
    END as estimated_read_time,
    
    -- Add hierarchy path for easier navigation
    ci.parent_id IS NOT NULL as has_parent,
    
    -- Add child count for hierarchical items
    (
        SELECT COUNT(*) FROM content_items children 
        WHERE children.parent_id = ci.id 
        AND children.status = 'published'
    ) as children_count
    
FROM content_items ci
WHERE ci.status = 'published' 
   OR (ci.status = 'scheduled' AND ci.published_at <= NOW());

-- Grant access to the view
GRANT SELECT ON public.library_content_view TO anon, authenticated;

-- =====================================================
-- CREATE FUNCTION TO GET CONTENT HIERARCHY
-- This function will help build the hierarchical structure
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_content_with_children(parent_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    type content_item_type,
    title TEXT,
    slug TEXT,
    description TEXT,
    cover_image_url TEXT,
    parent_id UUID,
    order_index INTEGER,
    completion_percentage INTEGER,
    average_rating DECIMAL,
    rating_count INTEGER,
    status content_status,
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_chapters INTEGER,
    estimated_read_time INTEGER,
    children_count INTEGER
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM library_content_view
    WHERE (
        CASE 
            WHEN parent_id IS NULL THEN library_content_view.parent_id IS NULL
            ELSE library_content_view.parent_id = get_content_with_children.parent_id
        END
    )
    ORDER BY library_content_view.order_index, library_content_view.created_at;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_content_with_children TO anon, authenticated;

-- =====================================================
-- UPDATE SAMPLE DATA METADATA
-- Add created_by to sample data so it shows proper ownership
-- =====================================================

-- Update sample data to include proper metadata
UPDATE content_items 
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'),
    '{created_by}',
    to_jsonb(auth.uid()::text),
    true
)
WHERE metadata IS NULL OR NOT (metadata ? 'created_by');

-- =====================================================
-- LOGGING AND COMPLETION
-- =====================================================

-- Add comment to track this fix
COMMENT ON TABLE content_items IS 'Hierarchical content structure: BOOKS → VOLUMES → SAGAS → ARCS → ISSUES. Visibility fixed 2025-09-19';

-- Log successful fix
DO $$
BEGIN
    RAISE NOTICE 'Content visibility fixed successfully!';
    RAISE NOTICE 'All published content is now visible to all users in the library';
    RAISE NOTICE 'Admin-created content has been set to published status';
    RAISE NOTICE 'Created library_content_view and helper functions';
END $$;