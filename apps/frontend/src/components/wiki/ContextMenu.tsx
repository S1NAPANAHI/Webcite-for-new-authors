import React, { useEffect, useRef } from 'react'
import { WikiItem } from '../../types/wiki'

interface ContextMenuProps {
  x: number
  y: number
  item: WikiItem
  onClose: () => void
  onCreateChild: () => void
  onDelete: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x, y, item, onClose, onCreateChild, onDelete
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleCreateChild = () => {
    onCreateChild()
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      onDelete()
      onClose()
    }
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1"
      style={{ top: y, left: x }}
    >
      {item.type === 'folder' && (
        <button
          onClick={handleCreateChild}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Create New Item in Folder
        </button>
      )}
      <button
        onClick={handleDelete}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Delete {item.type === 'folder' ? 'Folder' : 'Page'}
      </button>
    </div>
  )
}