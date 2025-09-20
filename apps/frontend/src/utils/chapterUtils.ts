import { supabase } from '../lib/supabase';

/**
 * Generate clean chapter reading URL
 * @param issueSlug - The issue slug
 * @param chapterSlug - The chapter slug (preferred) or chapter number
 * @returns Clean URL for reading the chapter
 */
export function getChapterReadingUrl(issueSlug: string, chapterSlug: string | number): string {
  // Always use the clean URL structure
  return `/read/${issueSlug}/${chapterSlug}`;
}

/**
 * Get the first accessible chapter for an issue
 * @param issueSlug - The issue slug
 * @param userId - User ID (optional, for subscription check)
 * @returns Promise with the first accessible chapter info
 */
export async function getFirstAccessibleChapter(issueSlug: string, userId?: string) {
  try {
    // Get the issue first
    const { data: issueData, error: issueError } = await supabase
      .from('content_items')
      .select('id, slug, title')
      .eq('slug', issueSlug)
      .eq('type', 'issue')
      .eq('status', 'published')
      .single();
    
    if (issueError || !issueData) {
      throw new Error('Issue not found');
    }
    
    // Get accessible chapters for this issue
    const { data: chapters, error: chaptersError } = await supabase
      .rpc('get_accessible_chapters_for_issue', {
        p_issue_id: issueData.id,
        p_user_id: userId || null
      });
    
    if (chaptersError) {
      throw new Error('Failed to load chapters');
    }
    
    // Find the first accessible chapter, or the first chapter if none are accessible
    const accessibleChapter = chapters?.find(ch => ch.has_access);
    const firstChapter = chapters?.[0];
    
    return {
      issue: issueData,
      chapter: accessibleChapter || firstChapter,
      hasAccess: accessibleChapter ? true : false,
      totalChapters: chapters?.length || 0,
      accessibleChapters: chapters?.filter(ch => ch.has_access).length || 0
    };
  } catch (error) {
    console.error('Error getting first accessible chapter:', error);
    throw error;
  }
}

/**
 * Generate "Start Reading" URL for an issue
 * This will direct to the first accessible chapter
 * @param issueSlug - The issue slug
 * @param userId - User ID (optional, for subscription check)
 * @returns Promise with the reading URL or null if no accessible chapters
 */
export async function getStartReadingUrl(issueSlug: string, userId?: string): Promise<string | null> {
  try {
    const result = await getFirstAccessibleChapter(issueSlug, userId);
    
    if (result.chapter) {
      return getChapterReadingUrl(issueSlug, result.chapter.slug || result.chapter.chapter_number);
    }
    
    return null;
  } catch (error) {
    console.error('Error generating start reading URL:', error);
    return null;
  }
}

/**
 * Check if user needs subscription for an issue
 * @param issueSlug - The issue slug
 * @param userId - User ID (optional)
 * @returns Promise with subscription requirement info
 */
export async function checkSubscriptionRequirement(issueSlug: string, userId?: string) {
  try {
    const result = await getFirstAccessibleChapter(issueSlug, userId);
    
    return {
      hasAccessibleChapters: result.accessibleChapters > 0,
      totalChapters: result.totalChapters,
      accessibleChapters: result.accessibleChapters,
      needsSubscription: result.totalChapters > result.accessibleChapters,
      needsLogin: !userId && result.totalChapters > 0
    };
  } catch (error) {
    console.error('Error checking subscription requirement:', error);
    return {
      hasAccessibleChapters: false,
      totalChapters: 0,
      accessibleChapters: 0,
      needsSubscription: false,
      needsLogin: false
    };
  }
}

/**
 * Redirect old UUID-based chapter URLs to clean URLs
 * @param issueSlug - The issue slug
 * @param chapterUuid - The old chapter UUID
 * @returns Promise with the new clean URL or null
 */
export async function redirectLegacyChapterUrl(issueSlug: string, chapterUuid: string): Promise<string | null> {
  try {
    // Check if this looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(chapterUuid)) {
      // Not a UUID, probably already a clean URL
      return null;
    }
    
    // Look up the chapter by UUID to get its slug
    const { data: chapterData, error } = await supabase
      .from('chapters')
      .select('slug, chapter_number')
      .eq('id', chapterUuid)
      .single();
    
    if (error || !chapterData) {
      console.warn('Could not find chapter with UUID:', chapterUuid);
      return null;
    }
    
    // Return clean URL
    return getChapterReadingUrl(issueSlug, chapterData.slug || chapterData.chapter_number);
  } catch (error) {
    console.error('Error redirecting legacy URL:', error);
    return null;
  }
}