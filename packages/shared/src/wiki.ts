import { supabase } from './supabaseClient';
import { Tables, Enums } from './database.types';
import { v4 as uuidv4 } from 'uuid';

export type Folder = Tables<'wiki_folders'> & {
  children?: Folder[];
};

export const fetchFolders = async (): Promise<Folder[]> => {
  const { data, error } = await supabase
    .from('wiki_folders')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data as Folder[]) || [];
};

export type WikiSectionView = {
  id: string;
  title: string;
  content: any;
  type: Enums<'content_block_type'>;
};

export interface WikiPage extends Tables<'wiki_pages'> {
  sections?: WikiSectionView[];
  category?: Tables<'wiki_categories'> | null;
  user?: Tables<'profiles'> | null;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export const fetchPages = async (): Promise<WikiPage[]> => {
    const { data, error } = await supabase
        .from('wiki_pages')
        .select('*, category:wiki_categories(*), user:profiles(*)')
        .order('title');
    if (error) throw error;
    return (data as WikiPage[]) || [];
};

export interface WikiCategory extends Tables<'wiki_categories'> {
  page_count?: number;
}

export interface WikiRevision extends Tables<'wiki_revisions'> {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export type WikiMedia = Tables<'wiki_media'>;

export interface FetchWikiPagesOptions {
  search?: string;
  categoryId?: string;
  tagId?: string;
  isPublished?: boolean;
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'view_count' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/**
 * Fetch a single wiki page by ID or slug
 */
export const fetchWikiPage = async (identifier: string): Promise<WikiPage | null> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

  const query = supabase
    .from('wiki_pages')
    .select(`
      *,
      category:wiki_categories (*),
      user:profiles (*)
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

    (page as WikiPage).sections = contentBlocks?.map(block => ({
      id: block.id,
      type: block.type,
      content: block.content,
      title: '', // Title is not stored in content blocks, so we'll leave it empty for now
    })) || [];

    await supabase.rpc('increment_wiki_page_views', { page_id: page.id });
  }

  return page as WikiPage;
};

/**
 * Fetch multiple wiki pages with filtering and pagination
 */
export const fetchWikiPages = async ({
  search,
  categoryId,
  tagId,
  isPublished = true,
  sortBy = 'updated_at',
  sortOrder = 'desc',
  page = 1,
  pageSize = 10,
}: FetchWikiPagesOptions = {}): Promise<PaginatedResult<WikiPage>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('wiki_pages')
    .select('*, category:wiki_categories(*), user:profiles(*)', {
      count: 'exact',
    });

  // Apply filters
  if (isPublished) {
    query = query.eq('is_published', true);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(from, to);

  const { data: pages, error, count } = await query;

  if (error) {
    console.error('Error fetching wiki pages:', error);
    throw new Error('Failed to fetch wiki pages');
  }

  const wikiPages = (pages as WikiPage[]) || [];

  if (wikiPages.length > 0) {
    const pageIds = wikiPages.map(p => p.id);
    const { data: contentBlocks, error: contentError } = await supabase
      .from('wiki_content_blocks')
      .select('page_id, id, type, content, position')
      .in('page_id', pageIds)
      .order('position');

    if (contentError) {
      console.error('Error fetching wiki content blocks:', contentError);
      throw new Error('Failed to fetch wiki content');
    }

    const pageSectionsMap = new Map<string, WikiSectionView[]>();
    for (const block of contentBlocks || []) {
      const section: WikiSectionView = {
        id: block.id,
        type: block.type,
        content: block.content,
        title: '', // Title is not stored in content blocks
      };
      if (!pageSectionsMap.has(block.page_id)) {
        pageSectionsMap.set(block.page_id, []);
      }
      pageSectionsMap.get(block.page_id)?.push(section);
    }

    for (const p of wikiPages) {
      p.sections = pageSectionsMap.get(p.id) || [];
    }
  }

  return {
    data: wikiPages,
    count: count || 0,
    page,
    pageSize,
    pageCount: Math.ceil((count || 0) / pageSize),
  };
};


/**
 * Create a new wiki page
 */
export const createWikiPage = async (pageData: {
  title: string;
  sections: WikiSectionView[];
  excerpt?: string | null;
  is_published?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  category_id?: string | null;
  user_id: string;
  folder_id?: string | null;
}): Promise<WikiPage> => {
  // Generate slug from title
  const slug = await generateSlug(pageData.title);

  const { data: page, error } = await supabase
    .from('wiki_pages')
    .insert([{
      title: pageData.title,
      slug,
      excerpt: pageData.excerpt,
      is_published: pageData.is_published,
      seo_title: pageData.seo_title,
      seo_description: pageData.seo_description,
      seo_keywords: pageData.seo_keywords,
      category_id: pageData.category_id,
      created_by: pageData.user_id,
      folder_id: pageData.folder_id,
    }])
    .select('*, category:wiki_categories(*), user:profiles(*)')
    .single();

  if (error) {
    console.error('Error creating wiki page:', error);
    throw new Error('Failed to create wiki page');
  }

  const newPage = page as WikiPage;

  if (newPage && pageData.sections && pageData.sections.length > 0) {
    const contentBlocksToInsert = pageData.sections.map((section, index) => ({
      page_id: newPage.id,
      type: section.type,
      content: section.content,
      position: index,
      created_by: pageData.user_id,
    }));

    const { error: contentError } = await supabase
      .from('wiki_content_blocks')
      .insert(contentBlocksToInsert);

    if (contentError) {
      console.error('Error creating wiki content blocks:', contentError);
      // Optionally, you might want to delete the page if content creation fails
      await supabase.from('wiki_pages').delete().eq('id', newPage.id);
      throw new Error('Failed to create wiki content blocks');
    }
  }

  return { ...newPage, sections: pageData.sections } as WikiPage;
};

/**
 * Update an existing wiki page
 */
export const updateWikiPage = async (
  id: string,
  updates: {
    title?: string;
    sections?: WikiSectionView[];
    excerpt?: string | null;
    is_published?: boolean;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string[] | null;
    category_id?: string | null;
    folder_id?: string | null;
  }
): Promise<WikiPage> => {
  const { sections: incomingSections, ...updateData } = updates;

  if (updates.title) {
    (updateData as any).slug = await generateSlug(updates.title);
  }

  const { data: page, error } = await supabase
    .from('wiki_pages')
    .update(updateData)
    .eq('id', id)
    .select('*, category:wiki_categories(*), user:profiles(*)')
    .single();

  if (error) {
    console.error('Error updating wiki page:', error);
    throw new Error('Failed to update wiki page');
  }
  const updatedPage = page as WikiPage;

  if (updatedPage && incomingSections) {
    // Delete existing content blocks
    const { error: deleteError } = await supabase
      .from('wiki_content_blocks')
      .delete()
      .eq('page_id', updatedPage.id);

    if (deleteError) {
      console.error('Error deleting old wiki content blocks:', deleteError);
      throw new Error('Failed to update wiki content');
    }

    // Insert new content blocks
    if (incomingSections.length > 0) {
      const contentBlocksToInsert = incomingSections.map((section, index) => ({
        page_id: updatedPage.id,
        type: section.type,
        content: section.content,
        position: index,
        created_by: updatedPage.created_by,
      }));

      const { error: insertError } = await supabase
        .from('wiki_content_blocks')
        .insert(contentBlocksToInsert);

      if (insertError) {
        console.error('Error inserting new wiki content blocks:', insertError);
        throw new Error('Failed to update wiki content');
      }
    }
  }

  return { ...updatedPage, sections: incomingSections } as WikiPage;
};


/**
 * Delete a wiki page
 */
export const deleteWikiPage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('wiki_pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting wiki page:', error);
    throw new Error('Failed to delete wiki page');
  }
};

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<WikiCategory[]> => {
  const { data, error } = await supabase
    .from('wiki_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return (data as WikiCategory[]) || [];
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData: {
  name: string;
  description?: string | null;
  user_id: string;
}): Promise<WikiCategory> => {
  const slug = await generateSlug(categoryData.name);

  const { data, error } = await supabase
    .from('wiki_categories')
    .insert([{ ...categoryData, slug, created_by: categoryData.user_id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }

  return data as WikiCategory;
};

/**
 * Update a category
 */
export const updateCategory = async (
  id: string,
  updates: {
    name?: string;
    description?: string | null;
  }
): Promise<WikiCategory> => {
  const updateData: { name?: string; description?: string | null; slug?: string } = { ...updates };
  if (updates.name) {
    updateData.slug = await generateSlug(updates.name);
  }

  const { data, error } = await supabase
    .from('wiki_categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }

  return data as WikiCategory;
};


/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  // First, check if there are any pages using this category
  const { count, error: checkError } = await supabase
    .from('wiki_pages')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (checkError) {
    console.error('Error checking category usage:', checkError);
    throw new Error('Failed to check category usage');
  }

  if (count && count > 0) {
    throw new Error('Cannot delete category that is in use by wiki pages');
  }

  // If no pages are using the category, proceed with deletion
  const { error } = await supabase
    .from('wiki_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

/**
 * Upload a file to the wiki media library
 */
export const uploadWikiMedia = async (
  file: File,
  userId: string
): Promise<WikiMedia> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `wiki/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Failed to upload file');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from('wiki_media')
    .insert([
      {
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating media record:', error);
    await supabase.storage.from('media').remove([filePath]);
    throw new Error('Failed to create media record');
  }

  return data as WikiMedia;
};


/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = async (str: string): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_slug', { title: str });
    if (error) {
        console.error('Error generating slug:', error);
        // fallback to client-side generation
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    return data;
};

/**
 * Get the URL for a wiki page
 */
export const getWikiPageUrl = (page: { slug: string }): string => {
  return `/wiki/${page.slug}`;
};

/**
 * Get the URL for a wiki category
 */
export const getCategoryUrl = (category: { slug: string }): string => {
  return `/wiki/category/${category.slug}`;
};

/**
 * Get the URL for a wiki tag
 */
export const getTagUrl = (tag: { id: string }): string => {
  return `/wiki/tag/${tag.id}`;
};