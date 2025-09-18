// =====================================================
// Hierarchical Content System Types
// =====================================================

export type ContentItemType = 'book' | 'volume' | 'saga' | 'arc' | 'issue';
export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type ChapterStatus = 'draft' | 'published' | 'archived' | 'scheduled';

// =====================================================
// Core Content Types
// =====================================================

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  parent_id?: string;
  order_index: number;
  completion_percentage: number;
  average_rating: number;
  rating_count: number;
  status: ContentStatus;
  published_at?: string;
  metadata: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItemWithChildren extends ContentItem {
  children?: ContentItemWithChildren[];
  chapters?: Chapter[];
  parent?: ContentItem;
}

export interface ContentItemWithPath extends ContentItem {
  path: string;
  depth: number;
  sort_path: number[];
}

export interface Chapter {
  id: string;
  issue_id: string;
  title: string;
  slug: string;
  content: any; // TipTap JSON content
  plain_content?: string;
  chapter_number: number;
  word_count: number;
  estimated_read_time: number;
  status: ChapterStatus;
  published_at?: string;
  metadata: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ChapterWithIssue extends Chapter {
  issue?: ContentItem;
}

// =====================================================
// User Library Types
// =====================================================

export interface UserLibraryItem {
  id: string;
  user_id: string;
  content_item_id: string;
  added_at: string;
  last_accessed_at: string;
  is_favorite: boolean;
  personal_rating?: number;
  personal_notes?: string;
}

export interface UserLibraryItemWithContent extends UserLibraryItem {
  content_item: ContentItemWithChildren;
  reading_progress?: ReadingProgress[];
  overall_progress?: number; // Calculated progress across all chapters
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  progress_percentage: number;
  last_read_at: string;
  completed: boolean;
  reading_time_minutes: number;
  bookmarks: Bookmark[];
  notes: ReadingNote[];
}

export interface ReadingProgressWithChapter extends ReadingProgress {
  chapter: Chapter;
}

export interface Bookmark {
  id: string;
  position: number; // Position in the chapter content
  label?: string;
  created_at: string;
}

export interface ReadingNote {
  id: string;
  position: number;
  text: string;
  highlight_text?: string;
  created_at: string;
}

// =====================================================
// Rating System Types
// =====================================================

export interface ContentRating {
  id: string;
  user_id: string;
  content_item_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentRatingWithUser extends ContentRating {
  user: {
    email: string;
    name?: string;
  };
}

// =====================================================
// Form Types
// =====================================================

export interface CreateContentItemForm {
  type: ContentItemType;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  parent_id?: string;
  order_index: number;
  status: ContentStatus;
  published_at?: string;
  metadata?: Record<string, any>;
}

export interface UpdateContentItemForm extends Partial<CreateContentItemForm> {
  id: string;
}

export interface CreateChapterForm {
  issue_id: string;
  title: string;
  slug: string;
  content: any; // TipTap JSON
  chapter_number: number;
  status: ChapterStatus;
  published_at?: string;
  metadata?: Record<string, any>;
}

export interface UpdateChapterForm extends Partial<CreateChapterForm> {
  id: string;
}

// =====================================================
// API Response Types
// =====================================================

export interface ContentHierarchyResponse {
  items: ContentItemWithChildren[];
  total: number;
}

export interface LibraryResponse {
  items: UserLibraryItemWithContent[];
  total: number;
  pagination: {
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface ChapterResponse {
  chapters: ChapterWithIssue[];
  total: number;
}

export interface ReadingProgressResponse {
  progress: ReadingProgressWithChapter[];
  stats: {
    total_chapters: number;
    completed_chapters: number;
    total_reading_time: number;
    current_streak: number;
  };
}

// =====================================================
// Search and Filter Types
// =====================================================

export interface ContentFilters {
  type?: ContentItemType;
  status?: ContentStatus;
  parent_id?: string;
  search?: string;
  sort_by?: 'title' | 'created_at' | 'updated_at' | 'order_index' | 'completion_percentage' | 'average_rating';
  sort_direction?: 'asc' | 'desc';
}

export interface LibraryFilters {
  type?: ContentItemType;
  completion_status?: 'not_started' | 'in_progress' | 'completed';
  rating?: number;
  is_favorite?: boolean;
  search?: string;
  sort_by?: 'added_at' | 'last_accessed_at' | 'title' | 'average_rating';
  sort_direction?: 'asc' | 'desc';
}

export interface ChapterFilters {
  issue_id?: string;
  status?: ChapterStatus;
  search?: string;
  sort_by?: 'chapter_number' | 'created_at' | 'title';
  sort_direction?: 'asc' | 'desc';
}

// =====================================================
// UI State Types
// =====================================================

export interface ContentTreeNode {
  item: ContentItemWithChildren;
  expanded: boolean;
  selected: boolean;
  children: ContentTreeNode[];
}

export interface LibraryCardData {
  item: ContentItemWithChildren;
  userLibraryItem?: UserLibraryItem;
  overallProgress: number;
  nextChapter?: Chapter;
  inUserLibrary: boolean;
}

// =====================================================
// Analytics Types
// =====================================================

export interface ContentAnalytics {
  total_views: number;
  unique_readers: number;
  average_rating: number;
  completion_rate: number;
  popular_chapters: Array<{
    chapter: Chapter;
    views: number;
    average_time: number;
  }>;
  reading_patterns: {
    peak_hours: number[];
    preferred_devices: Record<string, number>;
    session_lengths: Record<string, number>;
  };
}

// =====================================================
// Utility Types
// =====================================================

export type ContentItemCreate = Omit<ContentItem, 'id' | 'created_at' | 'updated_at' | 'average_rating' | 'rating_count' | 'completion_percentage'>;
export type ContentItemUpdate = Partial<ContentItemCreate> & { id: string };

export type ChapterCreate = Omit<Chapter, 'id' | 'created_at' | 'updated_at' | 'word_count' | 'estimated_read_time'>;
export type ChapterUpdate = Partial<ChapterCreate> & { id: string };

// Helper type for the hierarchy levels
export const HIERARCHY_LEVELS: Record<ContentItemType, { label: string; order: number; parent?: ContentItemType }> = {
  book: { label: 'Book', order: 0 },
  volume: { label: 'Volume', order: 1, parent: 'book' },
  saga: { label: 'Saga', order: 2, parent: 'volume' },
  arc: { label: 'Arc', order: 3, parent: 'saga' },
  issue: { label: 'Issue', order: 4, parent: 'arc' }
};

export const HIERARCHY_ORDER: ContentItemType[] = ['book', 'volume', 'saga', 'arc', 'issue'];

// Status display helpers
export const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
  scheduled: 'bg-blue-100 text-blue-800'
};

export const CHAPTER_STATUS_COLORS: Record<ChapterStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
  scheduled: 'bg-blue-100 text-blue-800'
};