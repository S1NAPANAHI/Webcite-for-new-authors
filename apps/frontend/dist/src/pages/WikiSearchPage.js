import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchWikiPages } from '@zoroaster/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft, BookOpen, Clock, Eye, BookMarked } from 'lucide-react';
import { LoadingSkeleton as Skeleton } from '@zoroaster/ui';
const WikiSearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });
    // Get search query from URL
    const query = searchParams.get('q') || '';
    useEffect(() => {
        // Update local state when URL changes
        setSearchQuery(query);
        if (query) {
            performSearch(query, 1);
        }
        else {
            setLoading(false);
            setSearchResults([]);
        }
    }, [query]);
    const performSearch = async (query, page) => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchWikiPages({
                search: query,
                isPublished: true,
                page,
                pageSize: pagination.pageSize,
                sortBy: 'relevance',
            });
            setSearchResults(result.data);
            setPagination(prev => ({
                ...prev,
                page,
                total: result.count,
            }));
        }
        catch (err) {
            console.error('Search error:', err);
            setError('Failed to perform search. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/wiki/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.pageSize)) {
            performSearch(query, newPage);
            // Scroll to top of results
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    if (!query) {
        return (_jsxs("div", { className: "container mx-auto p-4 max-w-4xl", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate(-1), className: "mb-6", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back"] }), _jsxs("div", { className: "text-center py-12", children: [_jsx(Search, { className: "mx-auto h-12 w-12 text-muted-foreground mb-4" }), _jsx("h2", { className: "text-2xl font-bold mb-2", children: "Search the Wiki" }), _jsx("p", { className: "text-muted-foreground mb-8", children: "Enter a search term to find pages in the wiki." }), _jsx("form", { onSubmit: handleSearch, className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" }), _jsx(Input, { type: "search", placeholder: "Search the wiki...", className: "w-full pl-10 pr-4 py-6 text-base", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), autoFocus: true }), _jsx(Button, { type: "submit", className: "absolute right-1.5 top-1/2 transform -translate-y-1/2", size: "sm", children: "Search" })] }) })] })] }));
    }
    return (_jsxs("div", { className: "container mx-auto p-4 max-w-4xl", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate(-1), className: "mb-6", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back"] }), _jsx("form", { onSubmit: handleSearch, className: "mb-8", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" }), _jsx(Input, { type: "search", placeholder: "Search the wiki...", className: "w-full pl-10 pr-4 py-6 text-base", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Button, { type: "submit", className: "absolute right-1.5 top-1/2 transform -translate-y-1/2", size: "sm", children: "Search" })] }) }), _jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-2xl font-bold mb-6", children: ["Search Results for \"", query, "\"", pagination.total > 0 && (_jsxs("span", { className: "text-muted-foreground font-normal ml-2", children: ["(", pagination.total, " ", pagination.total === 1 ? 'result' : 'results', ")"] }))] }), loading ? (_jsx("div", { className: "space-y-6", children: [...Array(3)].map((_, i) => (_jsx(Card, { className: "overflow-hidden", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(Skeleton, { className: "h-6 w-3/4 mb-4" }), _jsx(Skeleton, { className: "h-4 w-full mb-2" }), _jsx(Skeleton, { className: "h-4 w-5/6 mb-4" }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Skeleton, { className: "h-4 w-24" }), _jsx(Skeleton, { className: "h-4 w-20" })] })] }) }, i))) })) : error ? (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", children: [_jsx("strong", { className: "font-bold", children: "Error: " }), _jsx("span", { className: "block sm:inline", children: error })] })) : searchResults.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(BookOpen, { className: "mx-auto h-12 w-12 text-muted-foreground mb-4" }), _jsx("h3", { className: "text-xl font-medium mb-2", children: "No results found" }), _jsxs("p", { className: "text-muted-foreground mb-6", children: ["We couldn't find any pages matching \"", query, "\". Try different keywords or check the spelling."] }), _jsx(Button, { variant: "outline", onClick: () => navigate('/wiki'), children: "Browse all wiki pages" })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-6 mb-8", children: searchResults.map((page) => (_jsx(Card, { className: "overflow-hidden hover:shadow-md transition-shadow", children: _jsx(Link, { to: `/wiki/${page.slug}`, className: "block", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-semibold mb-2 text-primary hover:underline", children: page.title }), page.excerpt && (_jsx("p", { className: "text-muted-foreground mb-3 line-clamp-2", children: page.excerpt })), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [page.category && (_jsxs("div", { className: "flex items-center", children: [_jsx(BookMarked, { className: "h-4 w-4 mr-1" }), page.category.name] })), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), "Updated ", new Date(page.updated_at).toLocaleDateString()] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), page.view_count, " views"] })] })] }), page.cover_image && (_jsx("div", { className: "sm:w-32 flex-shrink-0 h-32 overflow-hidden rounded-md", children: _jsx("img", { src: page.cover_image, alt: "", className: "w-full h-full object-cover" }) }))] }) }) }) }, page.id))) }), pagination.total > pagination.pageSize && (_jsxs("div", { className: "flex items-center justify-between mt-8", children: [_jsx(Button, { variant: "outline", onClick: () => handlePageChange(pagination.page - 1), disabled: pagination.page === 1, children: "Previous" }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Page ", pagination.page, " of ", Math.ceil(pagination.total / pagination.pageSize)] }), _jsx(Button, { variant: "outline", onClick: () => handlePageChange(pagination.page + 1), disabled: pagination.page * pagination.pageSize >= pagination.total, children: "Next" })] }))] }))] }), _jsxs(Card, { className: "bg-muted/50", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: "Search Tips" }) }), _jsx(CardContent, { children: _jsxs("ul", { className: "list-disc pl-5 space-y-2 text-sm text-muted-foreground", children: [_jsx("li", { children: "Use quotes to search for an exact phrase: \"character creation\"" }), _jsx("li", { children: "Use OR to combine multiple search terms: magic OR spells" }), _jsx("li", { children: "Use a minus sign to exclude terms: magic -spells" }), _jsx("li", { children: "Search in title only: title:\"character\"" }), _jsx("li", { children: "Search by category: category:lore" })] }) })] })] }));
};
export default WikiSearchPage;
//# sourceMappingURL=WikiSearchPage.js.map