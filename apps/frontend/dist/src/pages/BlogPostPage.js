import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
const fetchPostBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published') // Only fetch published posts
        .single(); // Expect a single result
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw new Error(error.message);
    }
    return data;
};
const BlogPostPage = () => {
    const { slug } = useParams();
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['blogPost', slug],
        queryFn: () => (slug ? fetchPostBySlug(slug) : Promise.resolve(null)),
        enabled: !!slug, // Only run query if slug is available
    });
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8 text-gray-300", children: "Loading post..." });
    }
    if (isError) {
        return _jsxs("div", { className: "text-center py-8 text-red-400", children: ["Error loading post: ", error?.message] });
    }
    if (!post) {
        return _jsx("div", { className: "text-center py-8 text-gray-400", children: "Post not found or not published." });
    }
    // Simple excerpt generation (can be improved with a dedicated field in DB)
    const excerpt = post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content;
    return (_jsx("div", { className: "container mx-auto px-4 py-8 max-w-3xl relative z-20", children: _jsxs("article", { className: "blog-post relative overflow-hidden transition-transform duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg-custom", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] via-[#b8860b] to-[#d4af37]" }), _jsxs("div", { className: "post-meta flex justify-between items-center mb-8 pb-4 border-b border-gold-300-opacity flex-wrap gap-4", children: [_jsx("span", { className: "post-date text-[#d4af37] font-semibold text-sm tracking-wider", children: new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }), _jsx("span", { className: "post-category bg-gradient-to-br from-[#d4af37] to-[#b8860b] text-[#1a1a2e] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider", children: "World Building" })] }), _jsx("h1", { className: "post-title font-cinzel text-4xl text-[#f0f0f0] mb-6 leading-tight text-shadow-md", children: post.title }), _jsx("div", { className: "post-excerpt text-lg text-[#c0c0c0] mb-8 italic border-l-4 border-[#d4af37] pl-6", dangerouslySetInnerHTML: { __html: excerpt } }), _jsx("div", { className: "post-content text-lg leading-relaxed text-[#e8e8e8] prose prose-lg max-w-none", dangerouslySetInnerHTML: { __html: post.content } }), _jsxs("div", { className: "post-footer mt-12 pt-8 border-t border-gold-300-opacity flex justify-between items-center flex-wrap gap-4", children: [_jsxs("div", { className: "post-tags flex gap-2 flex-wrap", children: [_jsx("span", { className: "tag bg-gold-300-opacity-20 text-[#d4af37] px-3 py-1 rounded-full text-sm border border-gold-300-opacity-30 transition-all duration-300 hover:bg-gold-300-opacity-30 hover:scale-105", children: "#Magic" }), _jsx("span", { className: "tag bg-gold-300-opacity-20 text-[#d4af37] px-3 py-1 rounded-full text-sm border border-gold-300-opacity-30 transition-all duration-300 hover:bg-gold-300-opacity-30 hover:scale-105", children: "#WorldBuilding" })] }), _jsxs("div", { className: "social-share flex gap-4", children: [_jsx("button", { className: "share-btn bg-white-opacity-10 border border-white-opacity-20 text-[#e8e8e8] p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gold-300-opacity-20 hover:border-[#d4af37] hover:translate-y-[-2px]", children: "\uD83D\uDCF1" }), _jsx("button", { className: "share-btn bg-white-opacity-10 border border-white-opacity-20 text-[#e8e8e8] p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gold-300-opacity-20 hover:border-[#d4af37] hover:translate-y-[-2px]", children: "\uD83D\uDCD8" }), _jsx("button", { className: "share-btn bg-white-opacity-10 border border-white-opacity-20 text-[#e8e8e8] p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gold-300-opacity-20 hover:border-[#d4af37] hover:translate-y-[-2px]", children: "\uD83D\uDD17" })] })] })] }) }));
};
export default BlogPostPage;
//# sourceMappingURL=BlogPostPage.js.map