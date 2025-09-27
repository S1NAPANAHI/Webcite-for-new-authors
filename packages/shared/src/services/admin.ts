import { supabase } from '../lib/supabase';

export class AdminService {
  // Create a new book
  static async createBook(bookData: {
    title: string;
    subtitle?: string;
    description?: string;
    slug: string;
    cover_image_url?: string; // Changed from cover_image
  }) {
    const { data, error } = await supabase
      .from('content_items')
      .insert({
        title: bookData.title,
        slug: bookData.slug,
        description: bookData.description,
        cover_image_url: bookData.cover_image_url,
        type: 'book', // Specify type as 'book'
        metadata: bookData.subtitle ? { subtitle: bookData.subtitle } : null, // Store subtitle in metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create a chapter
  static async createChapter(chapterData: {
    issue_id: string;
    title: string;
    slug: string;
    chapter_number: number; // Added
    content_format: 'rich' | 'markdown' | 'file';
    content_text?: string;
    content_json?: any;
    content_url?: string;
    order_index: number;
  }) {
    const { data, error } = await supabase
      .from('chapters')
      .insert({
        issue_id: chapterData.issue_id,
        title: chapterData.title,
        slug: chapterData.slug,
        chapter_number: chapterData.chapter_number,
        content_format: chapterData.content_format,
        content: chapterData.content_json || chapterData.content_text || chapterData.content_url || '',
        order_index: chapterData.order_index,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update content state
  static async updateContentState(
    table: string,
    id: string,
    state: 'draft' | 'scheduled' | 'published' | 'archived',
    publishAt?: string
  ) {
    const updateData: any = { state };
    if (publishAt) updateData.publish_at = publishAt;

    let query;
    switch (table) {
      case 'books':
        query = supabase.from('content_items').update({ status: state, published_at: updateData.publish_at }).eq('id', id).eq('type', 'book');
        break;
      case 'chapters':
        query = supabase.from('chapters').update(updateData).eq('id', id);
        break;
      default:
        throw new Error(`Unsupported table: ${table}`);
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return data;
  }

  // Get admin dashboard data
  static async getAdminDashboard() {
    const [booksResult, chaptersResult] = await Promise.all([
      supabase.from('content_items').select('id, title, status, created_at').eq('type', 'book'),
      supabase.from('chapters').select('id, title, status, created_at'),
      // (supabase.rpc('get_admin_profiles') as any)
    ]);

    return {
      books: booksResult.data || [],
      chapters: chaptersResult.data || [],
      // users: usersResult.data || []
    };
  }
}
