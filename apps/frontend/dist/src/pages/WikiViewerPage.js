import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchWikiPage } from '@zoroaster/shared';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft, Tag, Clock, Eye, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useAuth } from '@zoroaster/shared';
import { LoadingSkeleton as Skeleton } from '@zoroaster/ui';
const WikiViewerPage = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const loadPage = async () => {
            try {
                if (!slug) {
                    navigate('/wiki');
                    return;
                }
                setLoading(true);
                const pageData = await fetchWikiPage(slug);
                setPage(pageData);
            }
            catch (err) {
                console.error('Error loading wiki page:', err);
                setError('Failed to load wiki page. It may not exist or you may not have permission to view it.');
            }
            finally {
                setLoading(false);
            }
        };
        loadPage();
    }, [slug, navigate]);
    if (loading) {
        return (_jsxs("div", { className: "container mx-auto p-4 max-w-4xl", children: [_jsx("div", { className: "flex items-center space-x-4 mb-6", children: _jsx(Skeleton, { className: "h-10 w-24" }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-10 w-3/4" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Skeleton, { className: "h-6 w-24" }), _jsx(Skeleton, { className: "h-6 w-20" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-5/6" }), _jsx(Skeleton, { className: "h-4 w-4/5" })] }), _jsxs("div", { className: "pt-4 space-y-2", children: [_jsx(Skeleton, { className: "h-6 w-32" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-11/12" }), _jsx(Skeleton, { className: "h-4 w-5/6" }), _jsx(Skeleton, { className: "h-4 w-4/5" })] })] })] })] }));
    }
    if (error) {
        return (_jsx("div", { className: "container mx-auto p-4 max-w-4xl", children: _jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative", role: "alert", children: [_jsx("strong", { className: "font-bold", children: "Error: " }), _jsx("span", { className: "block sm:inline", children: error }), _jsx("div", { className: "mt-4", children: _jsxs(Button, { variant: "outline", onClick: () => navigate('/wiki'), children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Wiki Home"] }) })] }) }));
    }
    if (!page) {
        return (_jsx("div", { className: "container mx-auto p-4 max-w-4xl", children: _jsxs("div", { className: "text-center py-12", children: [_jsx(BookOpen, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsx("h2", { className: "mt-2 text-2xl font-bold text-gray-900", children: "Page Not Found" }), _jsx("p", { className: "mt-1 text-gray-600", children: "The requested wiki page could not be found." }), _jsx("div", { className: "mt-6", children: _jsxs(Button, { onClick: () => navigate('/wiki'), children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Wiki Home"] }) })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-4 max-w-4xl", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate(-1), className: "mb-4 sm:mb-0", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back"] }), isAdmin && (_jsxs(Button, { variant: "outline", onClick: () => navigate(`/account/admin/wiki/edit/${page.id}`), children: [_jsx(Edit, { className: "mr-2 h-4 w-4" }), " Edit Page"] }))] }), _jsxs("article", { className: "prose prose-slate dark:prose-invert max-w-none", children: [_jsxs("header", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2", children: page.title }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4", children: [page.category && (_jsxs("div", { className: "flex items-center", children: [_jsx(Tag, { className: "h-4 w-4 mr-1" }), _jsx(Link, { to: `/wiki/category/${page.category.slug}`, className: "hover:underline hover:text-primary", children: page.category.name })] })), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: ["Last updated ", format(new Date(page.updated_at), 'MMMM d, yyyy')] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [page.view_count, " views"] })] })] }), page.excerpt && (_jsx("p", { className: "text-lg text-muted-foreground", children: page.excerpt }))] }), _jsx("div", { className: "prose prose-slate dark:prose-invert max-w-none", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex], components: {
                                // Custom components for markdown rendering
                                h1: ({ node, ...props }) => _jsx("h2", { className: "text-3xl font-bold mt-8 mb-4", ...props }),
                                h2: ({ node, ...props }) => _jsx("h3", { className: "text-2xl font-bold mt-6 mb-3", ...props }),
                                h3: ({ node, ...props }) => _jsx("h4", { className: "text-xl font-bold mt-5 mb-2", ...props }),
                                p: ({ node, ...props }) => _jsx("p", { className: "my-4 leading-relaxed", ...props }),
                                a: ({ node, ...props }) => (_jsx("a", { className: "text-primary hover:underline", target: "_blank", rel: "noopener noreferrer", ...props })),
                                img: ({ node, ...props }) => (_jsxs("div", { className: "my-6 rounded-lg overflow-hidden", children: [_jsx("img", { className: "mx-auto max-h-[500px] w-auto rounded-lg", alt: props.alt || '', ...props }), props.title && (_jsx("p", { className: "text-center text-sm text-muted-foreground mt-2", children: props.title }))] })),
                                table: ({ node, ...props }) => (_jsx("div", { className: "my-6 border rounded-lg overflow-x-auto", children: _jsx("table", { className: "w-full", ...props }) })),
                                code: ({ node, inline, className, children, ...props }) => {
                                    if (inline) {
                                        return (_jsx("code", { className: "bg-muted px-1.5 py-0.5 rounded text-sm font-mono", children: children }));
                                    }
                                    return (_jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto my-4", children: _jsx("code", { className: "font-mono text-sm", ...props, children: children }) }));
                                },
                            }, children: page.content }) }), _jsxs("footer", { className: "mt-12 pt-6 border-t border-border", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-muted-foreground", children: "Last updated" }), _jsx("p", { className: "text-sm", children: format(new Date(page.updated_at), 'MMMM d, yyyy') })] }), isAdmin && (_jsxs(Button, { variant: "outline", onClick: () => navigate(`/account/admin/wiki/edit/${page.id}`), children: [_jsx(Edit, { className: "mr-2 h-4 w-4" }), " Edit this page"] }))] }), page.category && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Category" }), _jsx("div", { className: "flex flex-wrap gap-2", children: _jsxs(Badge, { variant: "secondary", className: "text-sm", children: [_jsx(Tag, { className: "h-3 w-3 mr-1" }), page.category.name] }) })] }))] })] })] }));
};
export default WikiViewerPage;
//# sourceMappingURL=WikiViewerPage.js.map