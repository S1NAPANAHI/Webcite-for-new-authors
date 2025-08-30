import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from 'lucide-react';
export function RichTextEditor({ content, onChange, placeholder = 'Start writing...', className = '' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });
    useEffect(() => {
        if (editor) {
            const currentContent = editor.getHTML();
            if (content !== currentContent) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);
    if (!editor) {
        return _jsx("div", { children: "Loading editor..." });
    }
    const addImage = () => {
        const url = window.prompt('Enter the URL of the image:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };
    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        // cancelled
        if (url === null) {
            return;
        }
        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };
    return (_jsxs("div", { className: `border rounded-lg ${className}`, children: [_jsxs("div", { className: "border-b p-2 flex flex-wrap gap-1", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().toggleBold().run(), className: editor.isActive('bold') ? 'bg-gray-200' : '', "aria-label": "Bold", children: _jsx(Bold, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().toggleItalic().run(), className: editor.isActive('italic') ? 'bg-gray-200' : '', "aria-label": "Italic", children: _jsx(Italic, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().toggleStrike().run(), className: editor.isActive('strike') ? 'bg-gray-200' : '', "aria-label": "Strikethrough", children: _jsx(Strikethrough, { className: "h-4 w-4" }) }), _jsx("div", { className: "h-8 border-l mx-1" }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().toggleBulletList().run(), className: editor.isActive('bulletList') ? 'bg-gray-200' : '', "aria-label": "Bullet List", children: _jsx(List, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().toggleOrderedList().run(), className: editor.isActive('orderedList') ? 'bg-gray-200' : '', "aria-label": "Numbered List", children: _jsx(ListOrdered, { className: "h-4 w-4" }) }), _jsx("div", { className: "h-8 border-l mx-1" }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: setLink, className: editor.isActive('link') ? 'bg-gray-200' : '', "aria-label": "Add Link", children: _jsx(LinkIcon, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: addImage, "aria-label": "Add Image", children: _jsx(ImageIcon, { className: "h-4 w-4" }) }), _jsx("div", { className: "flex-1" }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), "aria-label": "Undo", children: _jsx(Undo, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), "aria-label": "Redo", children: _jsx(Redo, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "p-4 min-h-[200px] max-h-[500px] overflow-y-auto", children: _jsx(EditorContent, { editor: editor, className: "prose max-w-none" }) })] }));
}
//# sourceMappingURL=RichTextEditor.js.map