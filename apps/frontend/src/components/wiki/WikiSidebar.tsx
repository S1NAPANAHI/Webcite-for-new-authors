import React, { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { WikiTreeNode, WikiItem } from '../../types/wiki'
import { ContextMenu } from './ContextMenu'

interface WikiSidebarProps {
  treeData: WikiTreeNode[]
  currentItem?: WikiItem
  collapsed: boolean
  onToggleCollapse: () => void
  onSelectItem: (item: WikiItem) => void
  onCreateItem: (parentId?: string) => void
  onDeleteItem: (id: string) => void
}

export const WikiSidebar: React.FC<WikiSidebarProps> = ({
  treeData,
  currentItem,
  collapsed,
  onToggleCollapse,
  onSelectItem,
  onCreateItem,
  onDeleteItem
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    item: WikiItem
  } | null>(null)

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderTreeNode = (node: WikiTreeNode, level = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = currentItem?.id === node.id
    const hasChildren = node.has_children || node.children.length > 0

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer
            ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
          `}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onSelectItem(node)}
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              item: node
            })
          }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              className="mr-1 p-1 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(node.id)
              }}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-3 h-3" />
              ) : (
                <ChevronRightIcon className="w-3 h-3" />
              )}
            </button>
          )}

          {/* Icon */}
          <div className="mr-2">
            {node.type === 'folder' ? (
              <FolderIcon className="w-4 h-4 text-blue-500" />
            ) : (
              <DocumentIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>

          {/* Name */}
          {!collapsed && (
            <span className="text-sm truncate flex-1">
              {node.name}
            </span>
          )}

          {/* Status Indicator */}
          {!collapsed && node.status === 'draft' && (
            <span className="ml-2 px-1 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
              Draft
            </span>
          )}
        </div>

        {/* Children */}
        {isExpanded && node.children.map(child => renderTreeNode(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <h2 className="font-semibold text-gray-800">Wiki Content</h2>}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRightIcon className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto">
        {treeData.map(node => renderTreeNode(node))}
      </div>

      {/* Actions */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onCreateItem()}
            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New Item
          </button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onCreateChild={() => onCreateItem(contextMenu.item.id)}
          onDelete={() => onDeleteItem(contextMenu.item.id)}
        />
      )}
    </div>
  )
}