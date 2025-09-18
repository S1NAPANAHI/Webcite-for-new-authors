-- =====================================================
-- Utility Functions for Hierarchical Content System
-- =====================================================

-- Function to get all chapters for a content item (including descendants)
CREATE OR REPLACE FUNCTION get_content_item_chapters(content_item_id UUID)
RETURNS TABLE (
    id UUID,
    issue_id UUID,
    title TEXT,
    slug TEXT,
    chapter_number INTEGER,
    word_count INTEGER,
    estimated_read_time INTEGER,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE content_descendants AS (
        -- Base case: the content item itself
        SELECT ci.id, ci.type, ci.parent_id
        FROM content_items ci
        WHERE ci.id = content_item_id
        
        UNION ALL
        
        -- Recursive case: all descendants
        SELECT ci.id, ci.type, ci.parent_id
        FROM content_items ci
        JOIN content_descendants cd ON ci.parent_id = cd.id
    )
    SELECT 
        c.id,
        c.issue_id,
        c.title,
        c.slug,
        c.chapter_number,
        c.word_count,
        c.estimated_read_time,
        c.status,
        c.published_at
    FROM chapters c
    JOIN content_descendants cd ON c.issue_id = cd.id
    WHERE cd.type = 'issue'
    ORDER BY c.issue_id, c.chapter_number;
END;
$$ LANGUAGE plpgsql;

-- Function to increment reading time for a user/chapter
CREATE OR REPLACE FUNCTION increment_reading_time(
    user_id UUID,
    chapter_id UUID,
    minutes INTEGER DEFAULT 1
)
RETURNS INTEGER AS $$
DECLARE
    current_time INTEGER;
BEGIN
    INSERT INTO reading_progress (user_id, chapter_id, reading_time_minutes)
    VALUES (user_id, chapter_id, minutes)
    ON CONFLICT (user_id, chapter_id)
    DO UPDATE SET 
        reading_time_minutes = reading_progress.reading_time_minutes + minutes,
        last_read_at = NOW();
    
    SELECT reading_time_minutes INTO current_time
    FROM reading_progress
    WHERE reading_progress.user_id = increment_reading_time.user_id 
    AND reading_progress.chapter_id = increment_reading_time.chapter_id;
    
    RETURN current_time;
END;
$$ LANGUAGE plpgsql;

-- Function to get content hierarchy path
CREATE OR REPLACE FUNCTION get_content_hierarchy_path(content_item_id UUID)
RETURNS TABLE (
    level INTEGER,
    id UUID,
    type TEXT,
    title TEXT,
    slug TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE hierarchy_path AS (
        -- Base case: the content item itself
        SELECT 
            0 as level,
            ci.id,
            ci.type,
            ci.title,
            ci.slug,
            ci.parent_id
        FROM content_items ci
        WHERE ci.id = content_item_id
        
        UNION ALL
        
        -- Recursive case: parents
        SELECT 
            hp.level - 1 as level,
            ci.id,
            ci.type,
            ci.title,
            ci.slug,
            ci.parent_id
        FROM content_items ci
        JOIN hierarchy_path hp ON ci.id = hp.parent_id
    )
    SELECT 
        hp.level,
        hp.id,
        hp.type,
        hp.title,
        hp.slug
    FROM hierarchy_path hp
    ORDER BY hp.level DESC; -- Root first
END;
$$ LANGUAGE plpgsql;

-- Function to calculate overall progress for a content item
CREATE OR REPLACE FUNCTION calculate_content_progress(
    content_item_id UUID,
    user_id UUID
)
RETURNS TABLE (
    overall_progress INTEGER,
    total_chapters INTEGER,
    completed_chapters INTEGER,
    started_chapters INTEGER
) AS $$
DECLARE
    total_count INTEGER;
    completed_count INTEGER;
    started_count INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- Get all chapters for this content item
    SELECT COUNT(*) INTO total_count
    FROM get_content_item_chapters(content_item_id) gc
    WHERE gc.status = 'published';
    
    -- Get completed chapters count
    SELECT COUNT(*) INTO completed_count
    FROM get_content_item_chapters(content_item_id) gc
    JOIN reading_progress rp ON gc.id = rp.chapter_id
    WHERE gc.status = 'published' 
    AND rp.user_id = calculate_content_progress.user_id
    AND rp.completed = true;
    
    -- Get started chapters count
    SELECT COUNT(*) INTO started_count
    FROM get_content_item_chapters(content_item_id) gc
    JOIN reading_progress rp ON gc.id = rp.chapter_id
    WHERE gc.status = 'published' 
    AND rp.user_id = calculate_content_progress.user_id
    AND rp.progress_percentage > 0;
    
    -- Calculate overall progress
    IF total_count > 0 THEN
        progress_percentage := ROUND((completed_count * 100.0) / total_count);
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN QUERY SELECT 
        progress_percentage as overall_progress,
        total_count as total_chapters,
        completed_count as completed_chapters,
        started_count as started_chapters;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's next chapter to read
CREATE OR REPLACE FUNCTION get_next_chapter(
    content_item_id UUID,
    user_id UUID
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    chapter_number INTEGER,
    slug TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gc.id,
        gc.title,
        gc.chapter_number,
        gc.slug
    FROM get_content_item_chapters(content_item_id) gc
    LEFT JOIN reading_progress rp ON gc.id = rp.chapter_id AND rp.user_id = get_next_chapter.user_id
    WHERE gc.status = 'published'
    AND (rp.completed IS NULL OR rp.completed = false)
    ORDER BY gc.issue_id, gc.chapter_number
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get reading statistics for a user
CREATE OR REPLACE FUNCTION get_user_reading_statistics(user_id UUID)
RETURNS TABLE (
    total_items_in_library INTEGER,
    total_reading_time INTEGER,
    chapters_completed INTEGER,
    chapters_started INTEGER,
    current_streak_days INTEGER,
    favorite_genre TEXT,
    avg_personal_rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT ul.content_item_id)::INTEGER as total_items_in_library,
        COALESCE(SUM(rp.reading_time_minutes), 0)::INTEGER as total_reading_time,
        COUNT(DISTINCT rp.chapter_id) FILTER (WHERE rp.completed = true)::INTEGER as chapters_completed,
        COUNT(DISTINCT rp.chapter_id) FILTER (WHERE rp.progress_percentage > 0)::INTEGER as chapters_started,
        -- Simple streak calculation - days with reading activity in the last 30 days
        (
            SELECT COUNT(DISTINCT DATE(rp2.last_read_at))
            FROM reading_progress rp2
            WHERE rp2.user_id = get_user_reading_statistics.user_id
            AND rp2.last_read_at >= NOW() - INTERVAL '30 days'
        )::INTEGER as current_streak_days,
        -- Most common genre from metadata (simplified)
        'Fantasy' as favorite_genre,
        AVG(ul.personal_rating) as avg_personal_rating
    FROM user_library ul
    LEFT JOIN content_items ci ON ul.content_item_id = ci.id
    LEFT JOIN chapters c ON c.issue_id = ci.id OR 
        c.issue_id IN (
            SELECT id FROM content_items 
            WHERE parent_id = ci.id OR 
                  parent_id IN (SELECT id FROM content_items WHERE parent_id = ci.id) OR
                  parent_id IN (SELECT id FROM content_items WHERE parent_id IN (SELECT id FROM content_items WHERE parent_id = ci.id))
        )
    LEFT JOIN reading_progress rp ON rp.chapter_id = c.id AND rp.user_id = ul.user_id
    WHERE ul.user_id = get_user_reading_statistics.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to search content items (for library search)
CREATE OR REPLACE FUNCTION search_content_items(
    search_query TEXT DEFAULT '',
    content_type TEXT DEFAULT 'all',
    min_rating DECIMAL DEFAULT 0.0,
    completion_status TEXT DEFAULT 'all',
    sort_by TEXT DEFAULT 'created_at',
    sort_direction TEXT DEFAULT 'desc',
    page_size INTEGER DEFAULT 20,
    page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    type TEXT,
    title TEXT,
    slug TEXT,
    description TEXT,
    cover_image_url TEXT,
    completion_percentage INTEGER,
    average_rating DECIMAL(3,2),
    rating_count INTEGER,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    total_count BIGINT
) AS $$
DECLARE
    query_sql TEXT;
    count_sql TEXT;
    total_records BIGINT;
BEGIN
    -- Build dynamic query
    query_sql := 'SELECT ci.id, ci.type, ci.title, ci.slug, ci.description, ci.cover_image_url, '
                || 'ci.completion_percentage, ci.average_rating, ci.rating_count, ci.status, '
                || 'ci.published_at, ci.metadata '
                || 'FROM content_items ci WHERE ci.status = ''published'' ';
    
    count_sql := 'SELECT COUNT(*) FROM content_items ci WHERE ci.status = ''published'' ';
    
    -- Add filters
    IF search_query != '' THEN
        query_sql := query_sql || 'AND (ci.title ILIKE ''%' || search_query || '%'' OR ci.description ILIKE ''%' || search_query || '%'') ';
        count_sql := count_sql || 'AND (ci.title ILIKE ''%' || search_query || '%'' OR ci.description ILIKE ''%' || search_query || '%'') ';
    END IF;
    
    IF content_type != 'all' THEN
        query_sql := query_sql || 'AND ci.type = ''' || content_type || ''' ';
        count_sql := count_sql || 'AND ci.type = ''' || content_type || ''' ';
    END IF;
    
    IF min_rating > 0 THEN
        query_sql := query_sql || 'AND ci.average_rating >= ' || min_rating || ' ';
        count_sql := count_sql || 'AND ci.average_rating >= ' || min_rating || ' ';
    END IF;
    
    IF completion_status = 'completed' THEN
        query_sql := query_sql || 'AND ci.completion_percentage = 100 ';
        count_sql := count_sql || 'AND ci.completion_percentage = 100 ';
    ELSIF completion_status = 'in_progress' THEN
        query_sql := query_sql || 'AND ci.completion_percentage > 0 AND ci.completion_percentage < 100 ';
        count_sql := count_sql || 'AND ci.completion_percentage > 0 AND ci.completion_percentage < 100 ';
    ELSIF completion_status = 'not_started' THEN
        query_sql := query_sql || 'AND ci.completion_percentage = 0 ';
        count_sql := count_sql || 'AND ci.completion_percentage = 0 ';
    END IF;
    
    -- Add sorting
    query_sql := query_sql || 'ORDER BY ci.' || sort_by || ' ' || sort_direction || ' ';
    
    -- Add pagination
    query_sql := query_sql || 'LIMIT ' || page_size || ' OFFSET ' || page_offset;
    
    -- Get total count
    EXECUTE count_sql INTO total_records;
    
    -- Execute query and return results with total count
    RETURN QUERY EXECUTE 
        'SELECT q.*, ' || total_records || '::BIGINT as total_count FROM (' || query_sql || ') q';
END;
$$ LANGUAGE plpgsql;

-- Function to get user's library with reading progress
CREATE OR REPLACE FUNCTION get_user_library_with_progress(
    user_id UUID,
    content_type TEXT DEFAULT 'all',
    library_filter TEXT DEFAULT 'all', -- 'all', 'reading', 'completed', 'favorites', 'not_started'
    sort_by TEXT DEFAULT 'added_at',
    sort_direction TEXT DEFAULT 'desc',
    page_size INTEGER DEFAULT 20,
    page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    library_id UUID,
    content_item_id UUID,
    added_at TIMESTAMP WITH TIME ZONE,
    is_favorite BOOLEAN,
    personal_rating INTEGER,
    content_type TEXT,
    content_title TEXT,
    content_slug TEXT,
    content_description TEXT,
    cover_image_url TEXT,
    average_rating DECIMAL(3,2),
    rating_count INTEGER,
    completion_percentage INTEGER,
    metadata JSONB,
    overall_progress INTEGER,
    total_chapters INTEGER,
    completed_chapters INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ul.id as library_id,
        ul.content_item_id,
        ul.added_at,
        ul.is_favorite,
        ul.personal_rating,
        ci.type as content_type,
        ci.title as content_title,
        ci.slug as content_slug,
        ci.description as content_description,
        ci.cover_image_url,
        ci.average_rating,
        ci.rating_count,
        ci.completion_percentage,
        ci.metadata,
        COALESCE(cp.overall_progress, 0) as overall_progress,
        COALESCE(cp.total_chapters, 0) as total_chapters,
        COALESCE(cp.completed_chapters, 0) as completed_chapters
    FROM user_library ul
    JOIN content_items ci ON ul.content_item_id = ci.id
    LEFT JOIN LATERAL calculate_content_progress(ci.id, ul.user_id) cp ON true
    WHERE ul.user_id = get_user_library_with_progress.user_id
    AND (content_type = 'all' OR ci.type = content_type)
    AND (
        library_filter = 'all' OR
        (library_filter = 'reading' AND COALESCE(cp.overall_progress, 0) > 0 AND COALESCE(cp.overall_progress, 0) < 100) OR
        (library_filter = 'completed' AND COALESCE(cp.overall_progress, 0) = 100) OR
        (library_filter = 'favorites' AND ul.is_favorite = true) OR
        (library_filter = 'not_started' AND COALESCE(cp.overall_progress, 0) = 0)
    )
    ORDER BY 
        CASE 
            WHEN sort_by = 'added_at' AND sort_direction = 'desc' THEN ul.added_at
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'added_at' AND sort_direction = 'asc' THEN ul.added_at
            ELSE NULL
        END ASC,
        CASE 
            WHEN sort_by = 'title' AND sort_direction = 'asc' THEN ci.title
            ELSE NULL
        END ASC,
        CASE 
            WHEN sort_by = 'title' AND sort_direction = 'desc' THEN ci.title
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'average_rating' AND sort_direction = 'desc' THEN ci.average_rating
            ELSE NULL
        END DESC,
        CASE 
            WHEN sort_by = 'average_rating' AND sort_direction = 'asc' THEN ci.average_rating
            ELSE NULL
        END ASC
    LIMIT page_size OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent activity for a user
CREATE OR REPLACE FUNCTION get_user_recent_activity(
    user_id UUID,
    days_back INTEGER DEFAULT 30,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    activity_date DATE,
    activity_type TEXT, -- 'chapter_completed', 'item_added', 'rating_given'
    content_item_title TEXT,
    content_item_slug TEXT,
    chapter_title TEXT,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    (
        -- Completed chapters
        SELECT 
            rp.last_read_at::DATE as activity_date,
            'chapter_completed' as activity_type,
            ci.title as content_item_title,
            ci.slug as content_item_slug,
            c.title as chapter_title,
            jsonb_build_object(
                'chapter_number', c.chapter_number,
                'reading_time', rp.reading_time_minutes
            ) as details
        FROM reading_progress rp
        JOIN chapters c ON rp.chapter_id = c.id
        JOIN content_items ci ON c.issue_id = ci.id
        WHERE rp.user_id = get_user_recent_activity.user_id
        AND rp.completed = true
        AND rp.last_read_at >= NOW() - (days_back || ' days')::INTERVAL
        
        UNION ALL
        
        -- Items added to library
        SELECT 
            ul.added_at::DATE as activity_date,
            'item_added' as activity_type,
            ci.title as content_item_title,
            ci.slug as content_item_slug,
            NULL as chapter_title,
            jsonb_build_object(
                'content_type', ci.type
            ) as details
        FROM user_library ul
        JOIN content_items ci ON ul.content_item_id = ci.id
        WHERE ul.user_id = get_user_recent_activity.user_id
        AND ul.added_at >= NOW() - (days_back || ' days')::INTERVAL
        
        UNION ALL
        
        -- Ratings given
        SELECT 
            cr.created_at::DATE as activity_date,
            'rating_given' as activity_type,
            ci.title as content_item_title,
            ci.slug as content_item_slug,
            NULL as chapter_title,
            jsonb_build_object(
                'rating', cr.rating,
                'has_review', cr.review_text IS NOT NULL
            ) as details
        FROM content_ratings cr
        JOIN content_items ci ON cr.content_item_id = ci.id
        WHERE cr.user_id = get_user_recent_activity.user_id
        AND cr.created_at >= NOW() - (days_back || ' days')::INTERVAL
    )
    ORDER BY activity_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for the new functions
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_completed ON reading_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_reading_progress_last_read ON reading_progress(user_id, last_read_at);
CREATE INDEX IF NOT EXISTS idx_content_items_published_type ON content_items(status, type) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_user_library_user_added ON user_library(user_id, added_at);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_content_item_chapters(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_reading_time(UUID, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_content_hierarchy_path(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_content_progress(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_chapter(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_reading_statistics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_content_items(TEXT, TEXT, DECIMAL, TEXT, TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_library_with_progress(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_recent_activity(UUID, INTEGER, INTEGER) TO authenticated;