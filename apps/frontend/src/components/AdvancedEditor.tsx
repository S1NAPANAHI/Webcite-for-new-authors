import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// Custom extensions
import { Toolbar } from './Toolbar';
import InfoBox from './extensions/InfoBoxExtension'; // Corrected import
import Footnote from './extensions/FootnoteExtension'; // Corrected import
import Columns from './extensions/ColumnsExtension'; // Corrected import

// Supabase Storage
import { uploadImageToSupabase } from '../lib/supabaseStorage';
import React from 'react'; // Added React import

export default function AdvancedEditor({ initialContent, onSave }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      InfoBox,
      Footnote,
      Columns,
      // Removed 'Column' as it was not imported and likely a typo
    ],
    content: initialContent || '<p>Start writing…</p>',
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUploadRequest = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImageToSupabase(file);
      if (imageUrl) {
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } else {
        console.error('Image upload failed.');
        // Optionally, show a user-friendly error message
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded bg-white">
      <Toolbar editor={editor} onSave={onSave} onImageUploadRequest={handleImageUploadRequest} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <EditorContent editor={editor} className="p-4 min-h-[400px] border-t border-gray-200" />
    </div>
  );
}
