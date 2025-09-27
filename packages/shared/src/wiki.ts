import { supabase } from './supabaseClient';
import { Enums, Json, TablesInsert } from './database.types';
export type { Enums, Json, TablesInsert };

// Manual type definitions to avoid issues with generated types
interface WikiFolder {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  children?: WikiFolder[];
}

interface WikiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  page_count?: number;
}

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface WikiPage {
  id: string;
  created_at: string;
  created_by: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  folder_id: string | null;
  is_published: boolean | null;
  category_id: string | null;
  view_count: number | null;
  updated_at: string;
  content?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  category: WikiCategory | null;
  user: Profile | null;
  sections?: WikiSectionView[];
}

export type WikiSectionView = {
  id: string;
  title: string;
  content: Json | null;
  type: Enums<'content_block_type'>;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  page_id?: string;
};

export interface WikiPageWithSections extends WikiPage {
  sections: WikiSectionView[];
}

export const fetchFolders = async (): Promise<WikiFolder[]> => {
  const { data, error } = await supabase
    .from('wiki_items')
    .select('id, name, slug, parent_id, created_at, updated_at')
    .eq('type', 'folder')
    .order('name');
  if (error) throw error;
  return (data as WikiFolder[]) || [];
};

export const fetchCategories = async (): Promise<WikiCategory[]> => {
  const { data, error } = await supabase
    .from('wiki_categories')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  return (data as WikiCategory[]) || [];
};

export const fetchWikiPage = async (identifier: string): Promise<WikiPageWithSections | null> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

  const query = supabase
    .from('wiki_pages')
    .select(`
      id, created_at, created_by, title, slug, excerpt, is_published, category_id, folder_id, updated_at, view_count,
      content,
      category:wiki_categories(*),
      user:profiles(*)
    `)
    .eq(isUuid ? 'id' : 'slug', identifier);

  const { data: page, error } = await query.single();

  if (error) {
    console.error('Error fetching wiki page:', error);
    return null;
  }

  if (page) {
    const { data: contentBlocks, error: contentError } = await supabase
      .from('wiki_content_blocks')
      .select('id, type, content, position')
      .eq('page_id', page.id)
      .order('position');

    if (contentError) {
      console.error('Error fetching wiki content:', contentError);
      throw new Error('Failed to fetch wiki content');
    }

    const sections = contentBlocks?.map((block: { id: string; type: Enums<'content_block_type'>; content: Json | null; }) => ({
      id: block.id,
      type: block.type as Enums<'content_block_type'>,
      content: block.content,
      title: '', // Title is not stored in content blocks, so we'll leave it empty for now
    })) || [];

    await supabase.rpc('increment_wiki_page_views', { page_id: page.id });

    const fullPage: WikiPageWithSections = {
      ...(page as unknown as WikiPage),
      sections: sections,
    };
    return fullPage;
  }

  return null;
};