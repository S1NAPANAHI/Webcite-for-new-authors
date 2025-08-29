import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';
export const fetchFolders = async () => {
    const { data, error } = await supabase
        .from('wiki_folders')
        .select('*')
        .order('name');
    if (error)
        throw error;
    return data || [];
};
export const fetchPages = async () => {
    const { data, error } = await supabase
        .from('wiki_pages')
        .select(`
          id, created_at, created_by, title, slug, excerpt, is_published, category_id, folder_id, updated_at, view_count,
          content, seo_title, seo_description, seo_keywords,
          category:wiki_categories(*),
          user:profiles(*)
        `)
        .order('title');
    if (error)
        throw error;
    const wikiPagesWithSections = (data || []).map((page) => {
        const rawUser = page.user;
        let userValue = null;
        if (rawUser && typeof rawUser === 'object' && !('error' in rawUser)) {
            userValue = rawUser;
        }
        const rawCategory = page.category;
        let categoryValue = null;
        if (rawCategory && typeof rawCategory === 'object' && !('error' in rawCategory)) {
            categoryValue = rawCategory;
        }
        const wikiPage = {
            id: page.id,
            created_at: page.created_at,
            created_by: page.created_by,
            title: page.title,
            slug: page.slug,
            excerpt: page.excerpt,
            folder_id: page.folder_id,
            is_published: page.is_published,
            category_id: page.category_id,
            view_count: page.view_count,
            updated_at: page.updated_at,
            content: page.content || '',
            seo_title: page.seo_title || '',
            seo_description: page.seo_description || '',
            seo_keywords: page.seo_keywords || [],
            sections: page.sections || [],
            category: categoryValue,
            user: userValue,
        };
        return wikiPage;
    });
    return wikiPagesWithSections;
};
/**
 * Fetch a single wiki page by ID or slug
 */
export const fetchWikiPage = async (identifier) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const query = supabase
        .from('wiki_pages')
        .select(`
      id, created_at, created_by, title, slug, excerpt, is_published, category_id, folder_id, updated_at, view_count,
      content, seo_title, seo_description, seo_keywords,
      category(*),
      user(*)
    `)
        .eq(isUuid ? 'id' : 'slug', identifier);
    const { data: page, error } = await query.single();
    if (error) {
        console.error('Error fetching wiki page:', error);
        return null;
    }
    if (page) {
        // Explicitly check if page.user is an error object and set to null
        if (page.user && typeof page.user === 'object' && 'error' in page.user) {
            page.user = null;
        }
        // Explicitly check if page.category is an error object and set to null
        if (page.category && typeof page.category === 'object' && 'error' in page.category) {
            page.category = null;
        }
        const { data: contentBlocks, error: contentError } = await supabase
            .from('wiki_content_blocks')
            .select('id, type, content, position')
            .eq('page_id', page.id)
            .order('position');
        if (contentError) {
            console.error('Error fetching wiki content:', contentError);
            throw new Error('Failed to fetch wiki content');
        }
        const sections = contentBlocks?.map(block => ({
            id: block.id,
            type: block.type,
            content: block.content,
            title: '', // Title is not stored in content blocks, so we'll leave it empty for now
        })) || [];
        await supabase.rpc('increment_wiki_page_views', { page_id: page.id });
        // Construct WikiPageWithSections
        const fullPage = {
            ...page,
            sections: sections,
            content: page.content || '',
            seo_title: page.seo_title || '',
            seo_description: page.seo_description || '',
            seo_keywords: page.seo_keywords || [],
            category: page.category,
            user: page.user,
        };
        return fullPage;
    }
    return null;
};
/**
 * Fetch multiple wiki pages with filtering and pagination
 */
export const fetchWikiPages = async ({ search, categoryId, _tagId, isPublished = true, sortBy = 'updated_at', sortOrder = 'desc', page = 1, pageSize = 10, } = {}) => {
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
    const wikiPages = pages || [];
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
        const pageSectionsMap = new Map();
        for (const block of contentBlocks || []) {
            const section = {
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
export const createWikiPage = async (pageData) => {
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
    if (page && pageData.sections && pageData.sections.length > 0) {
        const contentBlocksToInsert = pageData.sections.map((section, index) => ({
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
    const newWikiPage = {
        id: page.id,
        created_at: page.created_at,
        created_by: page.created_by,
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        folder_id: page.folder_id,
        is_published: page.is_published,
        category_id: page.category_id,
        view_count: page.view_count,
        updated_at: page.updated_at,
        content: page.content,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        seo_keywords: page.seo_keywords,
        category: page.category,
        user: page.user,
        sections: pageData.sections,
    };
    return newWikiPage;
};
/**
 * Update an existing wiki page
 */
export const updateWikiPage = async (id, updates) => {
    const { sections: incomingSections, ...updateData } = updates;
    if (updates.title) {
        updateData.slug = await generateSlug(updates.title);
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
    if (page && incomingSections) {
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
        if (incomingSections.length > 0) {
            const contentBlocksToInsert = incomingSections.map((section, index) => ({
                page_id: page.id,
                type: section.type,
                content: section.content,
                position: index,
                created_by: page.created_by,
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
    const updatedWikiPage = {
        id: page.id,
        created_at: page.created_at,
        created_by: page.created_by,
        title: page.title,
        slug: page.slug,
        excerpt: page.excerpt,
        folder_id: page.folder_id,
        is_published: page.is_published,
        category_id: page.category_id,
        view_count: page.view_count,
        updated_at: page.updated_at,
        content: page.content,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        seo_keywords: page.seo_keywords,
        category: page.category,
        user: page.user,
        sections: incomingSections,
    };
    return updatedWikiPage;
};
/**
 * Delete a wiki page
 */
export const deleteWikiPage = async (id) => {
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
export const fetchCategories = async () => {
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
export const createCategory = async (categoryData) => {
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
    return data;
};
/**
 * Update a category
 */
export const updateCategory = async (id, updates) => {
    const updateData = { ...updates };
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
    return data;
};
/**
 * Delete a category
 */
export const deleteCategory = async (id) => {
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
export const uploadWikiMedia = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `wiki/${fileName}`;
    const { data: _uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Failed to upload file');
    }
    const { data: { publicUrl: _publicUrl } } = supabase.storage
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
    return data;
};
/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = async (str) => {
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
export const getWikiPageUrl = (page) => {
    return `/wiki/${page.slug}`;
};
/**
 * Get the URL for a wiki category
 */
export const getCategoryUrl = (category) => {
    return `/wiki/category/${category.slug}`;
};
/**
 * Get the URL for a wiki tag
 */
export const getTagUrl = (tag) => {
    return `/wiki/tag/${tag.id}`;
};
