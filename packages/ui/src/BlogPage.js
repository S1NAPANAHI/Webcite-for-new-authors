import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
import { Link } from 'react-router-dom';
// Async function to fetch published posts from Supabase
const fetchPublishedPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published') // Only fetch published posts
        .order('created_at', { ascending: false }); // Order by newest first
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
export const BlogPage = () => {
    const { data: posts, isLoading, isError, error } = useQuery({
        queryKey: ['blogPosts'],
        queryFn: fetchPublishedPosts
    });
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading blog posts..." });
    }
    if (isError) {
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error loading posts: ", error?.message] });
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-8", children: "Blog & News" }), posts && posts.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: posts.map((post) => (_jsx("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-800 mb-2", children: post.title }), _jsxs("p", { className: "text-sm text-gray-500 mb-4", children: ["Published on ", new Date(post.created_at).toLocaleDateString()] }), _jsx("div", { className: "text-gray-700 leading-relaxed line-clamp-3", dangerouslySetInnerHTML: { __html: post.content } }), _jsx(Link, { to: `/blog/${post.slug}`, className: "mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium", children: "Read More \u2192" })] }) }, post.id))) })) : (_jsxs("div", { className: "text-center py-12 text-gray-600", children: [_jsx("p", { className: "text-xl mb-4", children: "No blog posts published yet." }), _jsx("p", { children: "Check back soon for new content!" })] }))] }));
};
