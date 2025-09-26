import React, { useState, useEffect } from 'react';
import {
  Book,
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Calendar,
  FileText,
  User,
  TrendingUp,
  BarChart3,
  Settings,
  Archive,
  Star,
  Target,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';

interface Work {
  id: string;
  title: string;
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  parent_id?: string;
  order_in_parent?: number;
  description?: string;
  status: 'planning' | 'writing' | 'editing' | 'published' | 'on_hold';
  progress_percentage?: number;
  release_date?: string;
  estimated_release?: string;
  cover_image_url?: string;
  is_featured: boolean;
  is_premium: boolean;
  is_free: boolean;
  word_count?: number;
  target_word_count?: number;
  created_at: string;
  updated_at: string;
  // Aggregated data
  chapters_count?: number;
  published_chapters?: number;
  subscribers_count?: number;
  rating?: number;
  reviews_count?: number;
}

interface Chapter {
  id: string;
  work_id: string;
  title: string;
  chapter_number: number;
  content?: string;
  file_path?: string;
  is_published: boolean;
  is_premium: boolean;
  is_free: boolean;
  word_count?: number;
  estimated_read_time?: number;
  created_at: string;
  updated_at: string;
}

const WorksManagementPage: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder data loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading works and chapters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            Works Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your literary works, upload chapters for subscribers, and showcase in library
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Chapter
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Work
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Placeholder Content */}
      <div className="text-center py-12">
        <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Works Management</h3>
        <p className="text-muted-foreground mb-4">
          This page will contain the full works management functionality.
          For now, this is a placeholder to fix the build error.
        </p>
      </div>
    </div>
  );
};

export { WorksManagementPage };