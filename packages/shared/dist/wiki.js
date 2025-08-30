"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagUrl = exports.getCategoryUrl = exports.getWikiPageUrl = exports.uploadWikiMedia = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.fetchCategories = exports.deleteWikiPage = exports.updateWikiPage = exports.createWikiPage = exports.fetchWikiPages = exports.fetchWikiPage = exports.fetchPages = exports.fetchFolders = void 0;
const supabaseClient_1 = require("./supabaseClient");
const uuid_1 = require("uuid");
const fetchFolders = async () => {
    const { data, error } = await supabaseClient_1.supabase
        .from('wiki_folders')
        .select('*')
        .order('name');
    if (error)
        throw error;
    return data || [];
};
exports.fetchFolders = fetchFolders;
const fetchPages = async () => {
    const { data, error } = await supabaseClient_1.supabase
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
    const rawPages = data;
    const wikiPagesWithSections = rawPages.map((page) => {
        const userValue = (page.user && 'error' in page.user) ? null : page.user;
        const categoryValue = (page.category && 'error' in page.category) ? null : page.category;
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
            sections: [],
            category: categoryValue,
            user: userValue,
        };
        return wikiPage;
    });
    return wikiPagesWithSections;
};
exports.fetchPages = fetchPages;
/**
 * Fetch a single wiki page by ID or slug
 */
const fetchWikiPage = async (identifier) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const query = supabaseClient_1.supabase
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
        const { data: contentBlocks, error: contentError } = await supabaseClient_1.supabase
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
        await supabaseClient_1.supabase.rpc('increment_wiki_page_views', { page_id: page.id });
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
exports.fetchWikiPage = fetchWikiPage;
/**
 * Fetch multiple wiki pages with filtering and pagination
 */
const fetchWikiPages = async ({ search, categoryId, isPublished = true, sortBy = 'updated_at', sortOrder = 'desc', page = 1, pageSize = 10, } = {}) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabaseClient_1.supabase
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
    const { data, error, count } = await query;
    if (error) {
        console.error('Error fetching wiki pages:', error);
        throw new Error('Failed to fetch wiki pages');
    }
    const rawWikiPages = data;
    const wikiPages = rawWikiPages.map((page) => {
        const userValue = (page.user && 'error' in page.user) ? null : page.user;
        const categoryValue = (page.category && 'error' in page.category) ? null : page.category;
        return {
            ...page,
            user: userValue,
            category: categoryValue,
            content: page.content || null,
            seo_title: page.seo_title || null,
            seo_description: page.seo_description || null,
            seo_keywords: page.seo_keywords || null,
            sections: [],
        };
    });
    if (wikiPages.length > 0) {
        const pageIds = wikiPages.map(p => p.id);
        const { data: contentBlocks, error: contentError } = await supabaseClient_1.supabase
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
                title: '',
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
exports.fetchWikiPages = fetchWikiPages;
/**
 * Create a new wiki page
 */
const createWikiPage = async (pageData) => {
    // Generate slug from title
    const slug = await generateSlug(pageData.title);
    const { data: page, error } = await supabaseClient_1.supabase
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
        const { error: contentError } = await supabaseClient_1.supabase
            .from('wiki_content_blocks')
            .insert(contentBlocksToInsert);
        if (contentError) {
            console.error('Error creating wiki content blocks:', contentError);
            // Optionally, you might want to delete the page if content creation fails
            await supabaseClient_1.supabase.from('wiki_pages').delete().eq('id', page.id);
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
exports.createWikiPage = createWikiPage;
/**
 * Update an existing wiki page
 */
const updateWikiPage = async (id, updates) => {
    const { sections: incomingSections, ...updateData } = updates;
    if (updates.title) {
        updateData.slug = await generateSlug(updates.title);
    }
    const { data: page, error } = await supabaseClient_1.supabase
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
        const { error: deleteError } = await supabaseClient_1.supabase
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
            const { error: insertError } = await supabaseClient_1.supabase
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
exports.updateWikiPage = updateWikiPage;
/**
 * Delete a wiki page
 */
const deleteWikiPage = async (id) => {
    const { error } = await supabaseClient_1.supabase
        .from('wiki_pages')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting wiki page:', error);
        throw new Error('Failed to delete wiki page');
    }
};
exports.deleteWikiPage = deleteWikiPage;
/**
 * Fetch all categories
 */
const fetchCategories = async () => {
    const { data, error } = await supabaseClient_1.supabase
        .from('wiki_categories')
        .select('*')
        .order('name', { ascending: true });
    if (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
    return data || [];
};
exports.fetchCategories = fetchCategories;
/**
 * Create a new category
 */
const createCategory = async (categoryData) => {
    const slug = await generateSlug(categoryData.name);
    const { data, error } = await supabaseClient_1.supabase
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
exports.createCategory = createCategory;
/**
 * Update a category
 */
const updateCategory = async (id, updates) => {
    const updateData = { ...updates };
    if (updates.name) {
        updateData.slug = await generateSlug(updates.name);
    }
    const { data, error } = await supabaseClient_1.supabase
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
exports.updateCategory = updateCategory;
/**
 * Delete a category
 */
const deleteCategory = async (id) => {
    // First, check if there are any pages using this category
    const { count, error: checkError } = await supabaseClient_1.supabase
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
    const { error } = await supabaseClient_1.supabase
        .from('wiki_categories')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting category:', error);
        throw new Error('Failed to delete category');
    }
};
exports.deleteCategory = deleteCategory;
/**
 * Upload a file to the wiki media library
 */
const uploadWikiMedia = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
    const filePath = `wiki/${fileName}`;
    const { data: _uploadData, error: uploadError } = await supabaseClient_1.supabase.storage
        .from('media')
        .upload(filePath, file);
    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Failed to upload file');
    }
    const { data: { publicUrl: _publicUrl } } = supabaseClient_1.supabase.storage
        .from('media')
        .getPublicUrl(filePath);
    const { data, error } = await supabaseClient_1.supabase
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
        await supabaseClient_1.supabase.storage.from('media').remove([filePath]);
        throw new Error('Failed to create media record');
    }
    return data;
};
exports.uploadWikiMedia = uploadWikiMedia;
/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = async (str) => {
    const { data, error } = await supabaseClient_1.supabase.rpc('generate_slug', { title: str });
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
const getWikiPageUrl = (page) => {
    return `/wiki/${page.slug}`;
};
exports.getWikiPageUrl = getWikiPageUrl;
/**
 * Get the URL for a wiki category
 */
const getCategoryUrl = (category) => {
    return `/wiki/category/${category.slug}`;
};
exports.getCategoryUrl = getCategoryUrl;
/**
 * Get the URL for a wiki tag
 */
const getTagUrl = (tag) => {
    return `/wiki/tag/${tag.id}`;
};
exports.getTagUrl = getTagUrl;
