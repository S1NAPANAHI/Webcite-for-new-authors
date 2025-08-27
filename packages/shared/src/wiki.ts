import { supabase } from './supabaseClient';
import { Tables } from './database.types';
import { v4 as uuidv4 } from 'uuid';

export type Folder = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  children?: Folder[];
  created_at: string;
  updated_at: string;
  created_by: string;
  is_active: boolean;
};

export const fetchFolders = async (): Promise<Folder[]> => {
  const { data, error } = await supabase
    .from('wiki_folders')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
};

export const fetchPages = async (): Promise<WikiPage[]> => {
  const { data, error } = await supabase
    .from('wiki_pages')
    .select('*')
    .order('title');
  if (error) throw error;
  return data || [];
};


export interface WikiSectionView {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'infobox' | 'gallery' | 'timeline' | 'quote' | 'category-list';
}

export interface WikiPage extends Tables<'wiki_pages'> {
  folder_id?: string; // Add properties that are derived or joined
  sections?: WikiSectionView[]; // Make it optional, as it's derived
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface WikiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  page_count?: number;
}

export interface WikiRevision {
  id: string;
  page_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  created_at: string;
  user_id: string;
  user?: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface WikiMedia {
  id: string;
  url: string;
  name: string;
  size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  created_at: string;
  user_id: string;
}

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
export const fetchWikiPage = async (identifier: string): Promise<WikiPage> => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
  
  const query = supabase
    .from('wiki_pages')
    .select(`
      *,
      category:category_id (id, name, slug),
      user:user_id (id, email, user_metadata)
    `)
    .eq(isUuid ? 'id' : 'slug', identifier);

  const { data: page, error } = await query.single();

  if (error) {
    console.error('Error fetching wiki page:', error);
    throw new Error('Failed to fetch wiki page');
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

    page.sections = contentBlocks?.map(block => ({
      id: block.id,
      type: block.type,
      content: block.content.text, // Assuming content is stored as { text: "..." }
      title: '', // Title is not stored in content blocks, so we'll leave it empty for now
    })) || [];

    await supabase.rpc('increment_wiki_page_views', { page_id: page.id });
  }

  return page;
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
    .select('*, category:category_id (id, name, slug), user:user_id (id, email, user_metadata)', {
      count: 'exact',
    });

  // Apply filters
  if (isPublished) {
    query = query.eq('is_published', true);
  }
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  if (tagId) {
    query = query.contains('tag_ids', [tagId]);
  }
  
  if (search) {
    // Use the search function we created in the database
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_wiki_pages', { search_term: search });
      
    if (searchError) {
      console.error('Search error:', searchError);
      throw new Error('Search failed');
    }
    
    // Get the IDs from search results and filter by them
    const pageIds = searchResults?.map((page: WikiPage) => page.id) || [];
    query = query.in('id', pageIds);
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

  if (pages && pages.length > 0) {
    const pageIds = pages.map(p => p.id);
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
        content: block.content.text, // Assuming content is stored as { text: "..." }
        title: '', // Title is not stored in content blocks
      };
      if (!pageSectionsMap.has(block.page_id)) {
        pageSectionsMap.set(block.page_id, []);
      }
      pageSectionsMap.get(block.page_id)?.push(section);
    }

    for (const page of pages) {
      page.sections = pageSectionsMap.get(page.id) || [];
    }
  }

  return {
    data: pages || [],
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
  let baseSlug = generateSlug(pageData.title);
  let slug = baseSlug;
  let page: WikiPage | null = null;
  let error: any = null;
  const MAX_RETRIES = 5;

  for (let i = 0; i < MAX_RETRIES; i++) {
    const pageInsertData = {
    title: pageData.title,
    excerpt: pageData.excerpt,
    is_published: pageData.is_published,
    seo_title: pageData.seo_title,
    seo_description: pageData.seo_description,
    seo_keywords: pageData.seo_keywords,
    category_id: pageData.category_id,
    user_id: pageData.user_id,
    folder_id: pageData.folder_id,
  };
  const sectionsToInsert = pageData.sections;
    const result = await supabase
      .from('wiki_pages')
      .insert([{ ...pageInsertData, slug }])
      .select('*, category:category_id (id, name, slug), user:user_id (id, email, user_metadata)')
      .single();

    page = result.data;
    error = result.error;

    if (!error) {
      break; // Success
    }

    // Check for unique constraint violation (error code 23505 for PostgreSQL)
    if (error.code === '23505') {
      // Append a unique suffix and retry
      slug = `${baseSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      console.warn(`Duplicate slug detected. Retrying with new slug: ${slug}`);
    } else {
      // Other error, re-throw
      console.error('Error creating wiki page:', error);
      throw new Error('Failed to create wiki page');
    }
  }

  if (error) {
    console.error('Failed to create wiki page after multiple retries:', error);
    throw new Error('Failed to create wiki page after multiple retries');
  }

  if (page && sectionsToInsert && sectionsToInsert.length > 0) {
    const contentBlocksToInsert = sectionsToInsert.map((section, index) => ({
      page_id: page.id,
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
      await supabase.from('wiki_pages').delete().eq('id', page.id);
      throw new Error('Failed to create wiki content blocks');
    }
  }

  return { ...page, sections };
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
  // If title is being updated, update the slug as well
  const { sections: incomingSections, ...updateData } = updates;
  const sectionsToProcess = incomingSections || [];
  if (updates.title) {
    updateData.slug = generateSlug(updates.title);
  }

  const { data: page, error } = await supabase
    .from('wiki_pages')
    .update(updateData)
    .eq('id', id)
    .select('*, category:category_id (id, name, slug), user:user_id (id, email, user_metadata)')
    .single();

  if (error) {
    console.error('Error updating wiki page:', error);
    throw new Error('Failed to update wiki page');
  }

  if (page && sectionsToProcess) {
    // Delete existing content blocks
    const { error: deleteError } = await supabase
      .from('wiki_content_blocks')
      .delete()
      .eq('page_id', page.id);

    if (deleteError) {
      console.error('Error deleting old wiki content blocks:', deleteError);
      throw new Error('Failed to update wiki content');
    }

    // Insert new content blocks
    if (sectionsToProcess.length > 0) {
      const contentBlocksToInsert = sectionsToProcess.map((section, index) => ({
        page_id: page.id,
        type: section.type,
        content: section.content,
        position: index,
        // created_by: page.user_id, // Assuming user_id is available on page object after update
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

  return { ...page, sections };
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

  return data || [];
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData: {
  name: string;
  description?: string | null;
  user_id: string;
}): Promise<WikiCategory> => {
  // Generate slug from name
  const slug = generateSlug(categoryData.name);
  
  const { data, error } = await supabase
    .from('wiki_categories')
    .insert([{ ...categoryData, slug }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }

  return data;
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
  // If name is being updated, update the slug as well
  const updateData = { ...updates };
  if (updates.name) {
    updateData.slug = generateSlug(updates.name);
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

  return data;
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
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `wiki/media/${fileName}`;

  // Upload the file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('wiki')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Failed to upload file');
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('wiki')
    .getPublicUrl(filePath);

  // Create a media record in the database
  const { data, error } = await supabase
    .from('wiki_media')
    .insert([{
      name: file.name,
      url: publicUrl,
      size: file.size,
      mime_type: file.type,
      user_id: userId,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating media record:', error);
    // Try to clean up the uploaded file
    await supabase.storage.from('wiki').remove([filePath]);
    throw new Error('Failed to create media record');
  }

  return data;
};

/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except hyphens and spaces)
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
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