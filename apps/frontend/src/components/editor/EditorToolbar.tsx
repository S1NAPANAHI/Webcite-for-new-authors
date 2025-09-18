'use client'
import { Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Info,
  Columns,
  Type,
  Palette
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addFootnote = () => {
    const number = window.prompt('Footnote number')
    const content = window.prompt('Footnote content')
    if (number && content) {
      editor.chain().focus().setFootnote({ number, content }).run()
    }
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
      {/* Row 1: Text Formatting */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <select
          className="text-sm border rounded px-2 py-1"
          onChange={(e) => {
            const level = parseInt(e.target.value)
            if (level === 0) {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
            }
          }}
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <select className="text-sm border rounded px-2 py-1 ml-2">
          <option>Inter</option>
          <option>Georgia</option>
          <option>Times</option>
          <option>Arial</option>
        </select>

        <select className="text-sm border rounded px-2 py-1 ml-2">
          <option>14px</option>
          <option>12px</option>
          <option>16px</option>
          <option>18px</option>
          <option>20px</option>
        </select>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${editor.isActive('underline') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <Underline size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded ${editor.isActive('strike') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <Strikethrough size={16} />
        </button>

        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          className="w-8 h-8 border rounded"
          title="Text Color"
        />
      </div>

      {/* Row 2: Layout & Content */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r">
        <button
          onClick={addImage}
          className="p-1 rounded hover:bg-gray-200"
          title="Insert Image"
        >
          <Image size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setInfoBox().run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Info Box"
        >
          <Info size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Insert Table"
        >
          <Table size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setColumns().run()}
          className="p-1 rounded hover:bg-gray-200"
          title="2 Columns"
        >
          <Columns size={16} />
        </button>
        <button
          onClick={addFootnote}
          className="p-1 rounded hover:bg-gray-200"
          title="Footnote"
        >
          <Type size={16} />
        </button>
        <button
          onClick={addLink}
          className="p-1 rounded hover:bg-gray-200"
          title="Add Link"
        >
          <Link size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <Quote size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 rounded ${editor.isActive('code') ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        >
          <Code size={16} />
        </button>
      </div>
    </div>
  )
}
