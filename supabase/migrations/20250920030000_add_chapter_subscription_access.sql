-- =====================================================
-- CHAPTER SUBSCRIPTION ACCESS CONTROL
-- This migration adds subscription-based access control to chapters
-- =====================================================

-- Add access control columns to chapters table
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS free_chapter_order INTEGER,
ADD COLUMN IF NOT EXISTS subscription_tier_required TEXT DEFAULT 'free' CHECK (subscription_tier_required IN ('free', 'premium', 'patron'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chapters_is_free ON chapters(is_free);
CREATE INDEX IF NOT EXISTS idx_chapters_free_order ON chapters(issue_id, free_chapter_order) WHERE is_free = true;
CREATE INDEX IF NOT EXISTS idx_chapters_subscription_tier ON chapters(subscription_tier_required);

-- Update existing chapters to set first 2 chapters of each issue as free
WITH ranked_chapters AS (
  SELECT 
    id,
    issue_id,
    chapter_number,
    ROW_NUMBER() OVER (PARTITION BY issue_id ORDER BY chapter_number) as rn
  FROM chapters
  WHERE status = 'published'
)
UPDATE chapters 
SET 
  is_free = (ranked_chapters.rn <= 2),
  free_chapter_order = CASE WHEN ranked_chapters.rn <= 2 THEN ranked_chapters.rn ELSE NULL END,
  subscription_tier_required = CASE WHEN ranked_chapters.rn <= 2 THEN 'free' ELSE 'premium' END
FROM ranked_chapters
WHERE chapters.id = ranked_chapters.id;

-- Create function to check if user has access to a chapter
CREATE OR REPLACE FUNCTION user_has_chapter_access(user_uuid UUID, chapter_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    chapter_is_free BOOLEAN;
    chapter_tier TEXT;
    user_tier TEXT;
    user_status TEXT;
    subscription_valid BOOLEAN;
BEGIN
    -- Get chapter access requirements
    SELECT is_free, subscription_tier_required 
    INTO chapter_is_free, chapter_tier
    FROM chapters 
    WHERE id = chapter_uuid AND status = 'published';
    
    -- If chapter not found or not published, deny access
    IF chapter_is_free IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- If chapter is free, allow access
    IF chapter_is_free = true THEN
        RETURN TRUE;
    END IF;
    
    -- If user is not authenticated, deny access to premium content
    IF user_uuid IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get user subscription info
    SELECT 
        subscription_tier, 
        subscription_status,
        CASE 
            WHEN subscription_end_date IS NOT NULL AND subscription_end_date > now() THEN true
            WHEN subscription_status IN ('active', 'trialing') THEN true
            ELSE false
        END
    INTO user_tier, user_status, subscription_valid
    FROM profiles 
    WHERE id = user_uuid;
    
    -- If user not found, deny access
    IF user_tier IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has required subscription level
    IF chapter_tier = 'free' THEN
        RETURN TRUE;
    ELSIF chapter_tier = 'premium' THEN
        RETURN user_tier IN ('premium', 'patron') AND subscription_valid;
    ELSIF chapter_tier = 'patron' THEN
        RETURN user_tier = 'patron' AND subscription_valid;
    END IF;
    
    -- Default deny
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policy for chapters to include subscription check
DROP POLICY IF EXISTS "Public can view published chapters" ON chapters;
DROP POLICY IF EXISTS "Authenticated users can view all chapters" ON chapters;
DROP POLICY IF EXISTS "Users can view accessible chapters" ON chapters;

-- New policy: Users can only view chapters they have access to
CREATE POLICY "Users can view accessible chapters" ON chapters
    FOR SELECT USING (
        status = 'published' 
        AND EXISTS (
            SELECT 1 FROM content_items ci 
            WHERE ci.id = chapters.issue_id AND ci.status = 'published'
        )
        AND user_has_chapter_access(auth.uid(), id)
    );

-- Admin/Author policy remains the same for management purposes
CREATE POLICY "Admins and authors can view all chapters" ON chapters
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'author')
        )
    );

-- Create function to get user's accessible chapters for an issue
CREATE OR REPLACE FUNCTION get_accessible_chapters_for_issue(
    p_issue_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    chapter_number INTEGER,
    status chapter_status,
    published_at TIMESTAMPTZ,
    is_free BOOLEAN,
    subscription_tier_required TEXT,
    has_access BOOLEAN,
    word_count INTEGER,
    estimated_read_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.slug,
        c.chapter_number,
        c.status,
        c.published_at,
        c.is_free,
        c.subscription_tier_required,
        user_has_chapter_access(p_user_id, c.id) as has_access,
        c.word_count,
        c.estimated_read_time
    FROM chapters c
    WHERE c.issue_id = p_issue_id 
        AND c.status = 'published'
    ORDER BY c.chapter_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get chapter with access check
CREATE OR REPLACE FUNCTION get_chapter_with_access(
    p_issue_slug TEXT,
    p_chapter_identifier TEXT,  -- Can be slug or chapter number
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
    id UUID,
    issue_id UUID,
    title TEXT,
    slug TEXT,
    chapter_number INTEGER,
    content JSONB,
    plain_content TEXT,
    status chapter_status,
    published_at TIMESTAMPTZ,
    is_free BOOLEAN,
    subscription_tier_required TEXT,
    has_access BOOLEAN,
    access_denied_reason TEXT,
    word_count INTEGER,
    estimated_read_time INTEGER,
    metadata JSONB
) AS $$
DECLARE
    v_issue_id UUID;
    v_chapter RECORD;
    v_has_access BOOLEAN;
    v_access_reason TEXT;
BEGIN
    -- First, find the issue by slug
    SELECT ci.id INTO v_issue_id
    FROM content_items ci
    WHERE ci.slug = p_issue_slug 
        AND ci.type = 'issue' 
        AND ci.status = 'published';
    
    -- If issue not found, return empty
    IF v_issue_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Find the chapter by slug or number
    SELECT c.* INTO v_chapter
    FROM chapters c
    WHERE c.issue_id = v_issue_id
        AND c.status = 'published'
        AND (c.slug = p_chapter_identifier 
             OR (p_chapter_identifier ~ '^\d+$' AND c.chapter_number = p_chapter_identifier::INTEGER))
    LIMIT 1;
    
    -- If chapter not found, return empty
    IF v_chapter.id IS NULL THEN
        RETURN;
    END IF;
    
    -- Check access
    v_has_access := user_has_chapter_access(p_user_id, v_chapter.id);
    
    -- Determine access denied reason
    IF NOT v_has_access THEN
        IF v_chapter.is_free THEN
            v_access_reason := 'Chapter should be free but access denied';
        ELSIF p_user_id IS NULL THEN
            v_access_reason := 'Login required to read this premium chapter';
        ELSE
            v_access_reason := 'Premium subscription required to read this chapter';
        END IF;
    END IF;
    
    -- Return chapter info with access status
    RETURN QUERY SELECT 
        v_chapter.id,
        v_chapter.issue_id,
        v_chapter.title,
        v_chapter.slug,
        v_chapter.chapter_number,
        -- Only return content if user has access
        CASE WHEN v_has_access THEN v_chapter.content ELSE '{"type": "doc", "content": []}'::jsonb END,
        CASE WHEN v_has_access THEN v_chapter.plain_content ELSE '' END,
        v_chapter.status,
        v_chapter.published_at,
        v_chapter.is_free,
        v_chapter.subscription_tier_required,
        v_has_access,
        v_access_reason,
        v_chapter.word_count,
        v_chapter.estimated_read_time,
        v_chapter.metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get next/previous chapters with access info
CREATE OR REPLACE FUNCTION get_chapter_navigation(
    p_issue_id UUID,
    p_current_chapter_number INTEGER,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
    prev_chapter_id UUID,
    prev_chapter_slug TEXT,
    prev_chapter_title TEXT,
    prev_chapter_number INTEGER,
    prev_has_access BOOLEAN,
    next_chapter_id UUID,
    next_chapter_slug TEXT,
    next_chapter_title TEXT,
    next_chapter_number INTEGER,
    next_has_access BOOLEAN
) AS $$
DECLARE
    v_prev RECORD;
    v_next RECORD;
BEGIN
    -- Get previous chapter
    SELECT c.id, c.slug, c.title, c.chapter_number, user_has_chapter_access(p_user_id, c.id) as has_access
    INTO v_prev
    FROM chapters c
    WHERE c.issue_id = p_issue_id 
        AND c.status = 'published'
        AND c.chapter_number < p_current_chapter_number
    ORDER BY c.chapter_number DESC
    LIMIT 1;
    
    -- Get next chapter
    SELECT c.id, c.slug, c.title, c.chapter_number, user_has_chapter_access(p_user_id, c.id) as has_access
    INTO v_next
    FROM chapters c
    WHERE c.issue_id = p_issue_id 
        AND c.status = 'published'
        AND c.chapter_number > p_current_chapter_number
    ORDER BY c.chapter_number ASC
    LIMIT 1;
    
    RETURN QUERY SELECT
        v_prev.id,
        v_prev.slug,
        v_prev.title,
        v_prev.chapter_number,
        v_prev.has_access,
        v_next.id,
        v_next.slug,
        v_next.title,
        v_next.chapter_number,
        v_next.has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION user_has_chapter_access(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_accessible_chapters_for_issue(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_chapter_with_access(TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_chapter_navigation(UUID, INTEGER, UUID) TO authenticated;

-- Add helpful comments
COMMENT ON COLUMN chapters.is_free IS 'Whether this chapter is free to read for all users';
COMMENT ON COLUMN chapters.free_chapter_order IS 'Order of free chapters within an issue (1, 2, etc.)';
COMMENT ON COLUMN chapters.subscription_tier_required IS 'Minimum subscription tier required to access this chapter';
COMMENT ON FUNCTION user_has_chapter_access(UUID, UUID) IS 'Check if a user has access to read a specific chapter based on subscription';
COMMENT ON FUNCTION get_accessible_chapters_for_issue(UUID, UUID) IS 'Get all chapters for an issue with access status for the user';
COMMENT ON FUNCTION get_chapter_with_access(TEXT, TEXT, UUID) IS 'Get chapter content with subscription-based access control';
COMMENT ON FUNCTION get_chapter_navigation(UUID, INTEGER, UUID) IS 'Get previous/next chapter navigation with access status';

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '=== SUBSCRIPTION ACCESS CONTROL MIGRATION COMPLETE ===';
    RAISE NOTICE 'Added subscription-based access control to chapters';
    RAISE NOTICE 'First 2 chapters of each issue are now free';
    RAISE NOTICE 'Premium subscription required for additional chapters';
    RAISE NOTICE 'New functions available:';
    RAISE NOTICE '  - user_has_chapter_access(user_id, chapter_id)';
    RAISE NOTICE '  - get_accessible_chapters_for_issue(issue_id, user_id)';
    RAISE NOTICE '  - get_chapter_with_access(issue_slug, chapter_identifier, user_id)';
    RAISE NOTICE '  - get_chapter_navigation(issue_id, chapter_number, user_id)';
END;
$$;