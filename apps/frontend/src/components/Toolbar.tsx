import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Underline, Strikethrough, Code, 
  List, ListOrdered, Quote, Minus, 
  Type, Text, Palette, Image as ImageIcon, Link as LinkIcon, 
  Table, Columns, Info, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, AlignJustify // Corrected text alignment imports
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onSave: (html: string) => void;
  onImageUploadRequest?: () => void; // New prop
}

export function Toolbar({ editor, onSave, onImageUploadRequest }: ToolbarProps) {
  if (!editor) {
    return null;
  }

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

  // Modified addImage to use onImageUploadRequest
  const handleImageClick = () => {
    if (onImageUploadRequest) {
      onImageUploadRequest();
    } else {
      const url = window.prompt('Image URL');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 dark:bg-gray-700 dark:border-gray-600">
      {/* Row 1 – Text & Style Controls */}
      <button 
        onClick={() => editor.chain().focus().undo().run()} 
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Undo size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().redo().run()} 
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Redo size={18} />
      </button>

      <div className="h-8 border-l border-gray-300 mx-1 dark:border-gray-600"></div>

      <select 
        onChange={e => editor.chain().focus().setHeading({ level: parseInt(e.target.value) }).run()}
        value={editor.isActive('heading', { level: 1 }) ? '1' :
               editor.isActive('heading', { level: 2 }) ? '2' :
               editor.isActive('heading', { level: 3 }) ? '3' :
               editor.isActive('heading', { level: 4 }) ? '4' :
               editor.isActive('heading', { level: 5 }) ? '5' :
               editor.isActive('heading', { level: 6 }) ? '6' : 'paragraph'}
        className="p-2 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
      >
        <option value="paragraph">Paragraph</option>
        {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>H{l}</option>)}
      </select>

      {/* Font Family and Size - Tiptap doesn't have built-in extensions for these, would require custom implementation */}
      {/* <select className="p-2 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"><option>Font</option></select> */}
      {/* <select className="p-2 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"><option>Size</option></select> */}

      <button 
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <Bold size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <Italic size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <Strikethrough size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <Code size={18} />
      </button>

      <input 
        type="color" 
        onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()} 
        className="w-8 h-8 p-1 border-none rounded cursor-pointer"
      />
      <button 
        onClick={() => editor.chain().focus().unsetColor().run()} 
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Palette size={18} />
      </button>

      {/* Background Color */}
      <input 
        type="color" 
        onInput={e => editor.chain().focus().toggleHighlight({ color: (e.target as HTMLInputElement).value }).run()} 
        className="w-8 h-8 p-1 border-none rounded cursor-pointer"
      />
      <button 
        onClick={() => editor.chain().focus().toggleHighlight({ color: 'transparent' }).run()} 
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Palette size={18} /> {/* Reusing Palette icon for unset background color */}
      </button>

      <div className="h-8 border-l border-gray-300 mx-1 dark:border-gray-600"></div>

      {/* Text Alignment Controls */}
      <button 
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <AlignLeft size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <AlignCenter size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <AlignRight size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <AlignJustify size={18} />
      </button>

      <div className="h-8 border-l border-gray-300 mx-1 dark:border-gray-600"></div>

      {/* Row 2 – Content & Structure Controls */}
      <button 
        onClick={handleImageClick} // Changed to handleImageClick
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <ImageIcon size={18} />
      </button>
      {/* Image Float/Wrap - Requires custom Tiptap extension or more advanced logic */}
      {/* <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"><ImageFloat size={18} /></button> */}

      <button 
        onClick={() => editor.chain().focus().setInfoBox().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Info size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Table size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().setColumns({ count: 2 }).run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Columns size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().addFootnote().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Footnote size={18} />
      </button>
      <button 
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <LinkIcon size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <Quote size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
      >
        <Minus size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <List size={18} />
      </button>
      <button 
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
      >
        <ListOrdered size={18} />
      </button>

      <button 
        onClick={() => onSave(editor.getHTML())} 
        className="ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}