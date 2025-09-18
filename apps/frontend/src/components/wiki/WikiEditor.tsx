import React, { useState, useEffect, useRef } from 'react'
import { WikiItem } from '../../types/wiki'
import { DocumentIcon } from '@heroicons/react/24/outline'
import { TagInput } from './TagInput'
import { PropertyEditor } from './PropertyEditor'

interface WikiEditorProps {
  item?: WikiItem
  onSave: (item: Partial<WikiItem>) => void
  onChange: (item: Partial<WikiItem>) => void
}

export const WikiEditor: React.FC<WikiEditorProps> = ({ 
  item,
  onSave,
  onChange
}) => {
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [properties, setProperties] = useState<Record<string, any>>({})
  const [isPreview, setIsPreview] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (item) {
      setContent(item.content || '')
      setName(item.name)
      setTags(item.tags || [])
      setProperties(item.properties || {})
    }
  }, [item])

  const handleSave = () => {
    if (!item) return

    onSave({
      id: item.id,
      name,
      content,
      tags,
      properties,
      // word_count: content.split(/\s+/).length // Word count can be calculated on backend or client
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }

    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = editorRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newContent = content.substring(0, start) + '  ' + content.substring(end)
        setContent(newContent)
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }, 0)
      }
    }
  }

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <DocumentIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Select an item to edit</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-xl font-semibold border-none bg-transparent focus:outline-none focus:ring-0"
            placeholder="Item name..."
          />
          <div className="flex items-center space-x-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-1 text-sm rounded ${isPreview ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Main Editor */}
        <div className="flex-1 p-6">
          {isPreview ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(content) 
              }}
            />
          ) : (
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full resize-none border-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Start writing..."
            />
          )}
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Properties</h3>
          
          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <TagInput
              tags={tags}
              onChange={setTags}
              placeholder="Add tags..."
            />
          </div>

          {/* Custom Properties */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Custom Fields</h4>
            <PropertyEditor
              properties={properties}
              onChange={setProperties}
            />
          </div>

          {/* Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <div>Words: {content.split(/\s+/).filter(Boolean).length}</div>
              <div>Characters: {content.length}</div>
              <div>Lines: {content.split('\n').length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert markdown to HTML
function markdownToHtml(markdown: string): string {
  // This is a simplified version - you'd want to use a proper markdown parser
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br>')
}
