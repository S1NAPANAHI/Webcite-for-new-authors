import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
const fetchPageBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published') // Only fetch published pages
        .single(); // Expect a single result
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw new Error(error.message);
    }
    return data;
};
const GenericPage = () => {
    const { slug } = useParams();
    const { data: page, isLoading, isError, error } = useQuery({
        queryKey: ['genericPage', slug],
        queryFn: () => (slug ? fetchPageBySlug(slug) : Promise.resolve(null)),
        enabled: !!slug, // Only run query if slug is available
    });
    if (isLoading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading page..." });
    }
    if (isError) {
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error loading page: ", error?.message] });
    }
    if (!page) {
        return _jsx("div", { className: "text-center py-8 text-gray-600", children: "Page not found or not published." });
    }
    return (_jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("article", { className: "bg-white rounded-lg shadow-md p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: page.title }), _jsx("div", { className: "prose lg:prose-lg max-w-none text-gray-800 leading-relaxed", dangerouslySetInnerHTML: { __html: page.content } })] }) }));
};
export default GenericPage;
//# sourceMappingURL=GenericPage.js.map