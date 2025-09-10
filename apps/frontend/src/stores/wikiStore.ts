import { create } from 'zustand'
import { WikiItem, WikiTreeNode } from '../types/wiki'
import { supabase } from '@zoroaster/shared'

interface WikiState {
  treeData: WikiTreeNode[]
  currentItem?: WikiItem
  isLoading: boolean
  searchResults: WikiItem[]
  
  // Actions
  loadTree: (rootId?: string) => Promise<void>
  selectItem: (item: WikiItem) => void
  createItem: (item: Partial<WikiItem>) => Promise<WikiItem>
  updateItem: (id: string, updates: Partial<WikiItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  searchContent: (query: string) => Promise<void>
  moveItem: (itemId: string, newParentId?: string) => Promise<void>
}

export const useWikiStore = create<WikiState>((set, get) => ({
  treeData: [],
  isLoading: false,
  searchResults: [],

  loadTree: async (rootId) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.rpc('get_folder_tree', { root_id: rootId })
      if (error) throw error
      
      // Transform flat data into tree structure
      const treeData = buildTreeStructure(data)
      set({ treeData })
    } catch (error) {
      console.error('Failed to load tree:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  selectItem: (item) => {
    set({ currentItem: item })
  },

  createItem: async (itemData) => {
    const { data, error } = await supabase
      .from('wiki_items')
      .insert(itemData)
      .select()
      .single()
    
    if (error) throw error
    
    // Reload tree to show new item
    await get().loadTree()
    
    return data
  },

  updateItem: async (id, updates) => {
    const { error } = await supabase
      .from('wiki_items')
      .update(updates)
      .eq('id', id)
    
    if (error) throw error
    
    // Update current item if it's the one being updated
    const currentItem = get().currentItem
    if (currentItem?.id === id) {
      set({ currentItem: { ...currentItem, ...updates } })
    }
    
    // Optionally reload tree if name changed
    if (updates.name) {
      await get().loadTree()
    }
  },

  deleteItem: async (id) => {
    const { error } = await supabase
      .from('wiki_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Clear current item if it was deleted
    const currentItem = get().currentItem
    if (currentItem?.id === id) {
      set({ currentItem: undefined })
    }
    
    await get().loadTree()
  },

  searchContent: async (query) => {
    const { data, error } = await supabase.rpc('search_content', { 
      search_query: query 
    })
    
    if (error) throw error
    set({ searchResults: data })
  },

  moveItem: async (itemId, newParentId) => {
    const { error } = await supabase
      .from('wiki_items')
      .update({ parent_id: newParentId })
      .eq('id', itemId)
    
    if (error) throw error
    await get().loadTree()
  }
}))

// Helper function to build tree structure from flat data
function buildTreeStructure(items: WikiItem[]): WikiTreeNode[] {
  const itemMap = new Map<string, WikiTreeNode>()
  const rootItems: WikiTreeNode[] = []

  // First pass: create all nodes
  items.forEach(item => {
    itemMap.set(item.id, {
      ...item,
      children: [],
      expanded: false
    })
  })

  // Second pass: build hierarchy
  items.forEach(item => {
    const node = itemMap.get(item.id)!
    if (item.parent_id && itemMap.has(item.parent_id)) {
      const parent = itemMap.get(item.parent_id)!
      parent.children.push(node)
    } else {
      rootItems.push(node)
    }
  })

  return rootItems
}