import { supabase } from '../lib/supabase';
import { Database } from '../database.types';

type Book = Database['public']['Tables']['books']['Row'];
type Chapter = Database['public']['Tables']['chapters']['Row'];

export class ContentService {
  // Get all published books for library
  static async getPublishedBooks(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('state', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get book with full hierarchy
  static async getBookWithHierarchy(bookSlug: string) {
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select(`
        *,
        volumes(
          *,
          sagas(
            *,
            arcs(
              *,
              issues(
                *,
                chapters(*)
              )
            )
          )
        )
      `)
      .eq('slug', bookSlug)
      .eq('state', 'published')
      .single();

    if (bookError) throw bookError;
    return book;
  }

  // Get chapter content with access control
  static async getChapterContent(
    bookSlug: string,
    volumeSlug: string,
    sagaSlug: string,
    arcSlug: string,
    issueSlug: string,
    chapterSlug: string,
    userId?: string
  ): Promise<Chapter | null> {
    // Build the query with all joins to validate the full path
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        issues!inner(
          *,
          arcs!inner(
            *,
            sagas!inner(
              *,
              volumes!inner(
                *,
                books!inner(slug)
              )
            )
          )
        )
      `)
      .eq('slug', chapterSlug)
      .eq('issues.slug', issueSlug)
      .eq('issues.arcs.slug', arcSlug)
      .eq('issues.arcs.sagas.slug', sagaSlug)
      .eq('issues.arcs.sagas.volumes.slug', volumeSlug)
      .eq('issues.arcs.sagas.volumes.books.slug', bookSlug)
      .single();

    if (error) {
      console.error('Chapter access error:', error);
      return null;
    }

    // Check access permissions
    const hasAccess = await this.checkContentAccess(data.id, 'chapter', userId);
    if (!hasAccess) {
      return null;
    }

    return data;
  }

  // Check if user has access to specific content
  static async checkContentAccess(
    contentId: string,
    contentType: 'chapter' | 'issue',
    userId?: string
  ): Promise<boolean> {
    if (!userId) {
      // Check if content is free
      if (contentType === 'chapter') {
        const { data } = await supabase
          .from('chapters')
          .select(`
            subscription_required,
            issues!inner(subscription_required)
          `)
          .eq('id', contentId)
          .single();

        return !data?.subscription_required && !data?.issues?.subscription_required;
      }
    }

    // Call the database function for proper access check
    const { data, error } = await supabase.rpc('user_has_content_access', {
      user_id_param: userId,
      content_type: contentType,
      content_id_param: contentId
    });

    if (error) {
      console.error('Access check error:', error);
      return false;
    }

    return data;
  }

  // Add content to user library
  static async addToLibrary(
    userId: string,
    workType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter',
    workId: string
  ) {
    const { data, error } = await supabase
      .from('user_library')
      .insert({
        user_id: userId,
        work_type: workType,
        work_id: workId
      });

    if (error) throw error;
    return data;
  }

  // Get user's library
  static async getUserLibrary(userId: string) {
    const { data, error } = await supabase
      .from('user_library')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Update reading progress
  static async updateReadingProgress(
    userId: string,
    chapterId: string,
    progressPercentage: number,
    lastReadPosition: number = 0
  ) {
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: userId,
        chapter_id: chapterId,
        progress_percentage: progressPercentage,
        last_read_position: lastReadPosition,
        completed: progressPercentage >= 100,
        last_read_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  }

  // Get multiple books by their IDs
  static async getBooksByIds(bookIds: string[]): Promise<Book[]> {
    if (!bookIds || bookIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .in('id', bookIds);

    if (error) throw error;
    return data || [];
  }

  // Get a single book by its ID
  static async getBookById(bookId: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      throw error;
    }
    return data;
  }
}
