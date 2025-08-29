import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { marked } from 'marked';
const MarkdownViewer = ({ filePath }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMarkdown = async () => {
            try {
                setLoading(true);
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const markdown = await response.text();
                const html = await marked(markdown); // Added await
                setContent(html);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMarkdown();
    }, [filePath]);
    if (loading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading content..." });
    }
    if (error) {
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error loading content: ", error] });
    }
    return (_jsx("div", { className: "prose lg:prose-lg max-w-none", dangerouslySetInnerHTML: { __html: content } }));
};
export default MarkdownViewer;
//# sourceMappingURL=MarkdownViewer.js.map