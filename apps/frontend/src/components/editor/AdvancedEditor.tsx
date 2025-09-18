'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { TableKit } from '@tiptap/extension-table'
import { InfoBox } from './extensions/InfoBox'
import { Footnote } from './extensions/Footnote'
import { Columns, Column } from './extensions/Columns'
import { EditorToolbar } from './EditorToolbar'

interface AdvancedEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

export function AdvancedEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  className = ''
}: AdvancedEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] }
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      TextStyle,
      Color,
      TableKit.configure({ resizable: true }),
      InfoBox,
      Footnote,
      Columns,
      Column
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none p-4 min-h-[400px] ${className}`
      }
    }
  })

  if (!editor) return null

  return (
    <div className="border rounded-lg bg-white">
      <EditorToolbar editor={editor} />
      <div className="border-t">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
