import React, { useState, useEffect } from 'react'
import { WikiSidebar } from './WikiSidebar'
import { WikiEditor } from './WikiEditor'
import { WikiBreadcrumbs } from './WikiBreadcrumbs'
import { useWikiStore } from '../../stores/wikiStore'
import { CreateItemModal } from './CreateItemModal'

export const WikiAdmin: React.FC = () => {
  const {
    currentItem,
    treeData,
    isLoading,
    loadTree,
    selectItem,
    createItem,
    updateItem,
    deleteItem
  } = useWikiStore()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadTree()
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-12' : 'w-80'}`}>
        <WikiSidebar
          treeData={treeData}
          currentItem={currentItem}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSelectItem={selectItem}
          onCreateItem={() => setShowCreateModal(true)}
          onDeleteItem={deleteItem}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <WikiBreadcrumbs item={currentItem} onNavigate={selectItem} />
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <WikiEditor
            item={currentItem}
            onSave={updateItem}
            onChange={updateItem}
          />
        </div>
      </div>

      {/* Create Item Modal */}
      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createItem}
          parentId={currentItem?.type === 'folder' ? currentItem.id : currentItem?.parent_id}
        />
      )}
    </div>
  )
}