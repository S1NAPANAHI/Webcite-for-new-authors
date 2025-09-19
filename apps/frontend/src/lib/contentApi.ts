import { supabase } from '@zoroaster/shared';
import {
  ContentItem,
  ContentItemWithChildren,
  ContentItemType,
  CreateContentItemForm,
  Chapter,
  CreateChapterForm
} from '../types/content';

// Base API configuration - Use environment variable for backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function for API calls
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// =====================================================
// CONTENT ITEMS API
// =====================================================

export const contentApi = {
  // Get all content items with optional filtering
  async getContentItems(params: {
    type?: ContentItemType | 'all';
    status?: string;
    search?: string;
    parent_id?: string;
    include_children?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall<{
      data: ContentItemWithChildren[];
      pagination: { page: number; limit: number; total: number };
    }>(`/content/items?${searchParams}`);
  },

  // Get specific content item
  async getContentItem(id: string, includeChildren = true, includeChapters = false) {
    const params = new URLSearchParams();
    if (includeChildren) params.append('include_children', 'true');
    if (includeChapters) params.append('include_chapters', 'true');
    
    return apiCall<ContentItemWithChildren>(`/content/items/${id}?${params}`);
  },

  // Create new content item
  async createContentItem(data: CreateContentItemForm) {
    return apiCall<ContentItem>('/content/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update content item
  async updateContentItem(id: string, data: Partial<CreateContentItemForm>) {
    return apiCall<ContentItem>(`/content/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete content item
  async deleteContentItem(id: string) {
    return apiCall<void>(`/content/items/${id}`, {
      method: 'DELETE',
    });
  },

  // =====================================================
  // CHAPTERS API
  // =====================================================

  // Get chapters
  async getChapters(params: {
    issue_id?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall<{
      data: Chapter[];
      pagination: { page: number; limit: number; total: number };
    }>(`/content/chapters?${searchParams}`);
  },

  // Get specific chapter
  async getChapter(id: string) {
    return apiCall<Chapter>(`/content/chapters/${id}`);
  },

  // Create new chapter
  async createChapter(data: CreateChapterForm) {
    return apiCall<Chapter>('/content/chapters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update chapter
  async updateChapter(id: string, data: Partial<CreateChapterForm>) {
    return apiCall<Chapter>(`/content/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete chapter
  async deleteChapter(id: string) {
    return apiCall<void>(`/content/chapters/${id}`, {
      method: 'DELETE',
    });
  },

  // =====================================================
  // USER LIBRARY API
  // =====================================================

  // Get user's library
  async getUserLibrary(params: {
    content_type?: string;
    library_filter?: string;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall<{
      data: any[];
      pagination: { page: number; limit: number; total: number };
    }>(`/content/library?${searchParams}`);
  },

  // Add item to library
  async addToLibrary(contentItemId: string, data: {
    is_favorite?: boolean;
    personal_rating?: number;
    personal_notes?: string;
  } = {}) {
    return apiCall<any>('/content/library', {
      method: 'POST',
      body: JSON.stringify({
        content_item_id: contentItemId,
        ...data
      }),
    });
  },

  // Remove item from library
  async removeFromLibrary(contentItemId: string) {
    return apiCall<void>(`/content/library/${contentItemId}`, {
      method: 'DELETE',
    });
  },

  // =====================================================
  // READING PROGRESS API
  // =====================================================

  // Get reading progress
  async getReadingProgress(params: {
    chapter_id?: string;
    content_item_id?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall<any[]>(`/content/progress?${searchParams}`);
  },

  // Update reading progress
  async updateReadingProgress(data: {
    chapter_id: string;
    progress_percentage?: number;
    completed?: boolean;
    reading_time_minutes?: number;
    bookmarks?: any[];
    notes?: any[];
  }) {
    return apiCall<any>('/content/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // =====================================================
  // CONTENT RATINGS API
  // =====================================================

  // Get ratings for content item
  async getContentRatings(contentItemId: string, page = 1, limit = 10) {
    return apiCall<{
      data: any[];
      pagination: { page: number; limit: number; total: number };
    }>(`/content/ratings/${contentItemId}?page=${page}&limit=${limit}`);
  },

  // Add/update rating
  async addRating(data: {
    content_item_id: string;
    rating: number;
    review_title?: string;
    review_text?: string;
  }) {
    return apiCall<any>('/content/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // =====================================================
  // SEARCH API
  // =====================================================

  // Search content
  async searchContent(params: {
    query?: string;
    content_type?: string;
    min_rating?: number;
    completion_status?: string;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall<{
      data: ContentItem[];
      pagination: { page: number; limit: number; total: number };
    }>(`/content/search?${searchParams}`);
  },
};

// =====================================================
// SUPABASE DIRECT QUERIES (Fallback)
// =====================================================

// Fallback functions using Supabase directly for when backend isn't available
export const supabaseContentApi = {
  // Get all content items
  async getContentItems() {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get content item by ID
  async getContentItem(id: string) {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create content item
  async createContentItem(data: CreateContentItemForm) {
    const { data: result, error } = await supabase
      .from('content_items')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Update content item
  async updateContentItem(id: string, data: Partial<CreateContentItemForm>) {
    const { data: result, error } = await supabase
      .from('content_items')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Delete content item
  async deleteContentItem(id: string) {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Build content tree from flat items
export function buildContentTree(items: ContentItem[]): ContentItemWithChildren[] {
  const itemMap = new Map<string, ContentItemWithChildren>();
  const roots: ContentItemWithChildren[] = [];
  
  // Create map of all items with children array
  items.forEach(item => {
    const itemWithChildren: ContentItemWithChildren = {
      ...item,
      children: []
    };
    itemMap.set(item.id, itemWithChildren);
  });
  
  // Build tree structure
  items.forEach(item => {
    const itemWithChildren = itemMap.get(item.id)!;
    
    if (item.parent_id && itemMap.has(item.parent_id)) {
      const parent = itemMap.get(item.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(itemWithChildren);
    } else {
      roots.push(itemWithChildren);
    }
  });
  
  // Sort children by order_index
  const sortChildren = (node: ContentItemWithChildren) => {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => a.order_index - b.order_index);
      node.children.forEach(sortChildren);
    }
  };
  
  roots.forEach(sortChildren);
  return roots.sort((a, b) => a.order_index - b.order_index);
}

// Get available child types based on parent type
export function getAvailableChildTypes(parentType?: ContentItemType): ContentItemType[] {
  if (!parentType) return ['book'];
  
  const childTypes: Record<ContentItemType, ContentItemType[]> = {
    book: ['volume'],
    volume: ['saga'],
    saga: ['arc'],
    arc: ['issue'],
    issue: [] // Issues don't have children content items (only chapters)
  };
  
  return childTypes[parentType] || [];
}

// Auto-generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '');
}

// Validate content item data
export function validateContentItem(data: Partial<CreateContentItemForm>): string[] {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.slug?.trim()) {
    errors.push('Slug is required');
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and dashes');
  }
  
  if (!data.type) {
    errors.push('Content type is required');
  }
  
  if (data.order_index !== undefined && data.order_index < 0) {
    errors.push('Order index must be non-negative');
  }
  
  return errors;
}

export default contentApi;