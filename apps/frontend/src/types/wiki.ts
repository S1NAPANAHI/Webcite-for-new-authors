export interface WikiItem {
  id: string
  name: string
  type: 'folder' | 'page'
  parent_id?: string
  content?: string
  slug: string
  full_path?: string
  depth?: number
  tags?: string[]
  properties?: Record<string, any>
  status?: 'draft' | 'published' | 'archived'
  visibility?: 'public' | 'private' | 'restricted'
  created_at: string
  updated_at: string
  created_by?: string
  view_count?: number
  category_id?: string
  excerpt?: string
  is_published?: boolean
  
}

export interface WikiTreeNode extends WikiItem {
  children: WikiTreeNode[]
  expanded: boolean
  child_count?: number
  has_children?: boolean
}