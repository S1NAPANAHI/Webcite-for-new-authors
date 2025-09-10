import { supabase } from './supabaseClient';
export const fetchFolders = async () => {
    const { data, error } = await supabase
        .from('wiki_folders')
        .select('*')
        .order('name');
    if (error)
        throw error;
    return data || [];
};
export const fetchWikiPage = async (identifier) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const query = supabase
        .from('wiki_pages')
        .select(`
      id, created_at, created_by, title, slug, excerpt, is_published, category_id, folder_id, updated_at, view_count,
      content, seo_title, seo_description, seo_keywords,
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
        const sections = contentBlocks?.map((block) => ({
            id: block.id,
            type: block.type,
            content: block.content,
            title: '', // Title is not stored in content blocks, so we'll leave it empty for now
        })) || [];
        await supabase.rpc('increment_wiki_page_views', { page_id: page.id });
        const fullPage = {
            ...page,
            sections: sections,
        };
        return fullPage;
    }
    return null;
};
//# sourceMappingURL=wiki.js.map