import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '@zoroaster/shared';
const ContentForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [section, setSection] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('homepage_content')
            .insert([{ title, content, section }]);
        if (error) {
            setMessage(`Error: ${error.message}`);
        }
        else {
            setMessage('Content created successfully!');
            setTitle('');
            setContent('');
            setSection('');
        }
    };
    return (_jsxs("div", { className: "p-4 border rounded-lg", children: [_jsx("h2", { className: "text-xl mb-4", children: "Add New Content" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1", children: "Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full p-2 border", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1", children: "Section" }), _jsx("input", { type: "text", value: section, onChange: (e) => setSection(e.target.value), className: "w-full p-2 border", placeholder: "e.g., hero, about, features", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1", children: "Content" }), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), className: "w-full p-2 border", rows: 6, required: true })] }), _jsx("button", { type: "submit", className: "p-2 bg-blue-500 text-white rounded", children: "Create Content" }), message && _jsx("p", { className: "mt-4", children: message })] })] }));
};
export default ContentForm;
//# sourceMappingURL=ContentForm.js.map