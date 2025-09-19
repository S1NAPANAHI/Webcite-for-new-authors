-- =====================================================
-- FIX CONTENT VISIBILITY FOR ALL USERS
-- This migration fixes the issue where content created in admin
-- is only visible to admin users, not all users in the library
-- =====================================================

-- First, let's drop the existing restrictive policies on content tables only
DROP POLICY IF EXISTS "Authenticated can view all content items" ON content_items;
DROP POLICY IF EXISTS "Content creators can manage their content" ON content_items;
DROP POLICY IF EXISTS "Authenticated can view all chapters" ON chapters;
DROP POLICY IF EXISTS "Content creators can manage their chapters" ON chapters;

-- Drop the content hierarchy function if it exists
DROP FUNCTION IF EXISTS public.get_content_with_children(uuid);
DROP FUNCTION IF EXISTS public.get_library_content_hierarchy(uuid);

-- =====================================================
-- CREATE NEW, MORE PERMISSIVE POLICIES
-- =====================================================

-- Content Items Policies - Allow everyone to view published content
CREATE POLICY "Anyone can view published content items" ON content_items
    FOR SELECT USING (
        status = 'published' OR
        (status = 'scheduled' AND published_at <= NOW())
    );

-- Allow admins and authors to view and manage all content
-- Using the existing is_user_admin function to avoid conflicts
CREATE POLICY "Admins and authors can manage all content items" ON content_items
    FOR ALL TO authenticated 
    USING (
        -- Check if user is admin (using existing function)
        public.is_user_admin()
        OR
        -- Check if user is author
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'author'
        )
        OR
        -- Check if content was created by this user
        metadata->>'created_by' = auth.uid()::text
    )
    WITH CHECK (
        -- Same checks for insert/update
        public.is_user_admin()
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'author'
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
        public.is_user_admin()
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'author'
        )
        OR
        metadata->>'created_by' = auth.uid()::text
    )
    WITH CHECK (
        public.is_user_admin()
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'author'
        )
        OR
        metadata->>'created_by' = auth.uid()::text
    );

-- =====================================================
-- UPDATE EXISTING CONTENT TO BE PUBLISHED
-- So that existing content created by admin becomes visible
-- =====================================================

-- Update all existing content items to published status if they're currently draft
UPDATE content_items 
SET status = 'published', 
    published_at = COALESCE(published_at, NOW()),
    updated_at = NOW()
WHERE status = 'draft' 
  AND published_at IS NULL;

-- Update all existing chapters to published status if they're currently draft
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

DROP VIEW IF EXISTS public.library_content_view;

CREATE VIEW public.library_content_view AS
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
-- Fixed parameter name conflict
-- =====================================================

CREATE FUNCTION public.get_library_content_hierarchy(filter_parent_id UUID DEFAULT NULL)
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
    SELECT * FROM library_content_view lv
    WHERE (
        CASE 
            WHEN filter_parent_id IS NULL 
            THEN lv.parent_id IS NULL
            ELSE lv.parent_id = filter_parent_id
        END
    )
    ORDER BY lv.order_index, lv.created_at;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_library_content_hierarchy TO anon, authenticated;

-- =====================================================
-- CREATE HELPER FUNCTION FOR CONTENT ACCESS
-- This is a content-specific helper that won't conflict
-- =====================================================

CREATE OR REPLACE FUNCTION public.can_user_manage_content(user_id UUID DEFAULT auth.uid())
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.can_user_manage_content TO anon, authenticated;

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
    RAISE NOTICE 'Using existing is_user_admin function to avoid conflicts';
END $$;
