import { supabase } from '../lib/supabase';

export class AdminService {
  // Create a new book
  static async createBook(bookData: {
    title: string;
    subtitle?: string;
    description?: string;
    slug: string;
    cover_image?: string;
  }) {
    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
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
    content_format: 'rich' | 'markdown' | 'file';
    content_text?: string;
    content_json?: any;
    content_url?: string;
    order_index: number;
  }) {
    const { data, error } = await supabase
      .from('chapters')
      .insert(chapterData)
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
        query = supabase.from('books').update(updateData).eq('id', id);
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
      supabase.from('books').select('id, title, state, created_at'),
      supabase.from('chapters').select('id, title, state, created_at'),
      // (supabase.rpc('get_admin_profiles') as any)
    ]);

    return {
      books: booksResult.data || [],
      chapters: chaptersResult.data || [],
      // users: usersResult.data || []
    };
  }
}
