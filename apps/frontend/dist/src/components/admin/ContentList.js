import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '@zoroaster/shared';
const ContentList = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase
                .from('homepage_content')
                .select('*');
            if (error) {
                console.error('Error fetching content:', error);
            }
            else {
                setContent(data);
            }
            setLoading(false);
        };
        fetchContent();
    }, []);
    if (loading) {
        return _jsx("div", { children: "Loading content..." });
    }
    return (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("h2", { className: "text-xl mb-4", children: "Existing Content" }), _jsx("div", { className: "space-y-4", children: content.map((item) => (_jsxs("div", { className: "p-4 border rounded", children: [_jsx("h3", { className: "font-bold", children: item.title }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Section: ", item.section] }), _jsx("p", { className: "mt-2", children: item.content }), _jsxs("div", { className: "mt-4 space-x-2", children: [_jsx("button", { className: "p-2 bg-yellow-500 text-white rounded text-sm", children: "Edit" }), _jsx("button", { className: "p-2 bg-red-500 text-white rounded text-sm", children: "Delete" })] })] }, item.id))) })] }));
};
export default ContentList;
//# sourceMappingURL=ContentList.js.map