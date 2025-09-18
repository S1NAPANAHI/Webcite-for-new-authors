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

interface WorkFormData {
  title: string;
  type: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  parent_id?: string;
  description: string;
  status: 'planning' | 'writing' | 'editing' | 'published' | 'on_hold';
  progress_percentage: number;
  release_date: string;
  estimated_release: string;
  cover_image_url: string;
  is_featured: boolean;
  is_premium: boolean;
  is_free: boolean;
  target_word_count?: number;
}

type WorkStatus = 'all' | 'planning' | 'writing' | 'editing' | 'published' | 'on_hold';
type WorkType = 'all' | 'book' | 'volume' | 'saga' | 'arc' | 'issue';

const WorksManagementPage: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'works' | 'chapters'>('works');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkStatus>('all');
  const [typeFilter, setTypeFilter] = useState<WorkType>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [showChapterUpload, setShowChapterUpload] = useState(false);
  
  const [formData, setFormData] = useState<WorkFormData>({
    title: '',
    type: 'book',
    description: '',
    status: 'planning',
    progress_percentage: 0,
    release_date: '',
    estimated_release: '',
    cover_image_url: '',
    is_featured: false,
    is_premium: false,
    is_free: true,
    target_word_count: undefined
  });

  // Fetch works
  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/admin/works?include_stats=true');
      if (!response.ok) throw new Error('Failed to fetch works');
      
      const data = await response.json();
      setWorks(data.works || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch works');
    }
  };

  // Fetch chapters
  const fetchChapters = async (workId?: string) => {
    try {
      const url = workId ? `/api/admin/chapters?work_id=${workId}` : '/api/admin/chapters';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch chapters');
      
      const data = await response.json();
      setChapters(data.chapters || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chapters');
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchWorks(), fetchChapters()]);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter works
  const filteredWorks = works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || work.status === statusFilter;
    const matchesType = typeFilter === 'all' || work.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Filter chapters for selected work
  const filteredChapters = selectedWork 
    ? chapters.filter(chapter => chapter.work_id === selectedWork.id)
    : chapters;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingWork ? `/api/admin/works/${editingWork.id}` : '/api/admin/works';
      const method = editingWork ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          progress_percentage: formData.progress_percentage || 0,
          target_word_count: formData.target_word_count || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save work');
      }

      await fetchWorks();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save work');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      type: 'book',
      description: '',
      status: 'planning',
      progress_percentage: 0,
      release_date: '',
      estimated_release: '',
      cover_image_url: '',
      is_featured: false,
      is_premium: false,
      is_free: true,
      target_word_count: undefined
    });
    setEditingWork(null);
  };

  // Open edit modal
  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      type: work.type,
      parent_id: work.parent_id,
      description: work.description || '',
      status: work.status,
      progress_percentage: work.progress_percentage || 0,
      release_date: work.release_date || '',
      estimated_release: work.estimated_release || '',
      cover_image_url: work.cover_image_url || '',
      is_featured: work.is_featured,
      is_premium: work.is_premium,
      is_free: work.is_free,
      target_word_count: work.target_word_count
    });
    setShowModal(true);
  };

  // Delete work
  const handleDelete = async (work: Work) => {
    if (!confirm(`Are you sure you want to delete "${work.title}"? This will also delete all associated chapters.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/works/${work.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete work');
      
      await fetchWorks();
      if (selectedWork?.id === work.id) {
        setSelectedWork(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete work');
    }
  };

  // Toggle work visibility
  const toggleWorkVisibility = async (work: Work, field: 'is_featured' | 'is_premium' | 'is_free') => {
    try {
      const response = await fetch(`/api/admin/works/${work.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !work[field] })
      });

      if (!response.ok) throw new Error('Failed to update work');
      
      await fetchWorks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update work');
    }
  };

  // Publish/unpublish chapter
  const toggleChapterPublication = async (chapter: Chapter) => {
    try {
      const response = await fetch(`/api/admin/chapters/${chapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !chapter.is_published })
      });

      if (!response.ok) throw new Error('Failed to update chapter');
      
      await fetchChapters(selectedWork?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update chapter');
    }
  };

  // Get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'published':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle };
      case 'writing':
        return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20', icon: Edit };
      case 'editing':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: Settings };
      case 'planning':
        return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20', icon: Target };
      case 'on_hold':
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', icon: PauseCircle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', icon: Clock };
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <Book className="w-4 h-4" />;
      case 'volume': return <BookOpen className="w-4 h-4" />;
      case 'saga': return <Archive className="w-4 h-4" />;
      case 'arc': return <TrendingUp className="w-4 h-4" />;
      case 'issue': return <FileText className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <button
            onClick={() => setShowChapterUpload(true)}
            className="bg-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Chapter
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
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
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('works');
              setSelectedWork(null);
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'works'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Works ({works.length})
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'chapters'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Chapters ({chapters.length})
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        {activeTab === 'works' && (
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as WorkStatus)}
                className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="writing">Writing</option>
                <option value="editing">Editing</option>
                <option value="published">Published</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as WorkType)}
              className="px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="book">Books</option>
              <option value="volume">Volumes</option>
              <option value="saga">Sagas</option>
              <option value="arc">Arcs</option>
              <option value="issue">Issues</option>
            </select>
          </div>
        )}
      </div>

      {/* Works Tab */}
      {activeTab === 'works' && (
        <div className="space-y-4">
          {filteredWorks.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No works found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first work to get started'
                }
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                Create First Work
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredWorks.map((work) => {
                const statusDisplay = getStatusDisplay(work.status);
                const StatusIcon = statusDisplay.icon;
                
                return (
                  <div key={work.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Work Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(work.type)}
                              <h3 className="text-lg font-semibold text-foreground">{work.title}</h3>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {work.status}
                            </span>
                            {work.is_featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>Updated {formatDate(work.updated_at)}</p>
                            {work.chapters_count && (
                              <p>{work.published_chapters}/{work.chapters_count} chapters published</p>
                            )}
                          </div>
                        </div>

                        {/* Work Details */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <span className="ml-2 text-foreground capitalize">{work.type}</span>
                          </div>
                          {work.progress_percentage !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Progress:</span>
                              <span className="ml-2 text-foreground">{work.progress_percentage}%</span>
                            </div>
                          )}
                          {work.word_count && (
                            <div>
                              <span className="text-muted-foreground">Words:</span>
                              <span className="ml-2 text-foreground">
                                {work.word_count.toLocaleString()}
                                {work.target_word_count && ` / ${work.target_word_count.toLocaleString()}`}
                              </span>
                            </div>
                          )}
                          {work.rating && (
                            <div>
                              <span className="text-muted-foreground">Rating:</span>
                              <span className="ml-2 text-foreground">{work.rating.toFixed(1)} ⭐ ({work.reviews_count})</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {work.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {work.description}
                          </p>
                        )}

                        {/* Dates */}
                        <div className="flex gap-6 text-sm">
                          {work.release_date && (
                            <div>
                              <span className="text-muted-foreground">Released:</span>
                              <span className="ml-2 text-foreground">{formatDate(work.release_date)}</span>
                            </div>
                          )}
                          {work.estimated_release && !work.release_date && (
                            <div>
                              <span className="text-muted-foreground">Est. Release:</span>
                              <span className="ml-2 text-foreground">{work.estimated_release}</span>
                            </div>
                          )}
                        </div>

                        {/* Visibility Toggles */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleWorkVisibility(work, 'is_featured')}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              work.is_featured 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Star className="w-3 h-3" />
                            Featured
                          </button>
                          <button
                            onClick={() => toggleWorkVisibility(work, 'is_premium')}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              work.is_premium 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            Premium
                          </button>
                          <button
                            onClick={() => toggleWorkVisibility(work, 'is_free')}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              work.is_free 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            Free
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(work)}
                              className="text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWork(work);
                                setActiveTab('chapters');
                                fetchChapters(work.id);
                              }}
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
                            >
                              <BookOpen className="w-4 h-4" />
                              Chapters ({work.chapters_count || 0})
                            </button>
                            <button
                              onClick={() => handleDelete(work)}
                              className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cover Image */}
                      {work.cover_image_url && (
                        <div className="ml-4 flex-shrink-0">
                          <img
                            src={work.cover_image_url}
                            alt={work.title}
                            className="w-16 h-20 object-cover rounded-lg border border-border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Chapters Tab */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          {/* Selected Work Header */}
          {selectedWork && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Chapters for: {selectedWork.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredChapters.length} chapters • {filteredChapters.filter(c => c.is_published).length} published
                  </p>
                </div>
                <button
                  onClick={() => setShowChapterUpload(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Chapter
                </button>
              </div>
            </div>
          )}

          {filteredChapters.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No chapters found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedWork 
                  ? `No chapters uploaded for "${selectedWork.title}" yet`
                  : 'Select a work to view its chapters or upload new content'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredChapters
                .sort((a, b) => a.chapter_number - b.chapter_number)
                .map((chapter) => (
                  <div key={chapter.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-muted-foreground">
                          Ch. {chapter.chapter_number}
                        </span>
                        <h4 className="font-medium text-foreground">{chapter.title}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          chapter.is_published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {chapter.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Updated {formatDate(chapter.updated_at)}</span>
                        {chapter.word_count && <span>{chapter.word_count.toLocaleString()} words</span>}
                        {chapter.estimated_read_time && <span>{chapter.estimated_read_time} min read</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleChapterPublication(chapter)}
                        className={`p-2 rounded-lg transition-colors ${
                          chapter.is_published 
                            ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20' 
                            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        title={chapter.is_published ? 'Unpublish chapter' : 'Publish chapter'}
                      >
                        {chapter.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Work Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {editingWork ? 'Edit Work' : 'Create New Work'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="book">Book</option>
                    <option value="volume">Volume</option>
                    <option value="saga">Saga</option>
                    <option value="arc">Arc</option>
                    <option value="issue">Issue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="planning">Planning</option>
                    <option value="writing">Writing</option>
                    <option value="editing">Editing</option>
                    <option value="published">Published</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Progress %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percentage}
                    onChange={(e) => setFormData({ ...formData, progress_percentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estimated Release
                  </label>
                  <input
                    type="text"
                    value={formData.estimated_release}
                    onChange={(e) => setFormData({ ...formData, estimated_release: e.target.value })}
                    placeholder="e.g., Spring 2024"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Word Count
                </label>
                <input
                  type="number"
                  value={formData.target_word_count || ''}
                  onChange={(e) => setFormData({ ...formData, target_word_count: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Flags */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-foreground">
                    Featured (highlight in library)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_premium"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_premium" className="ml-2 text-sm font-medium text-foreground">
                    Premium content (requires subscription/purchase)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="is_free" className="ml-2 text-sm font-medium text-foreground">
                    Free to read (no subscription required)
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingWork ? 'Update Work' : 'Create Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chapter Upload Modal Placeholder */}
      {showChapterUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl shadow-xl border border-border max-w-md w-full">
            <div className="p-6 text-center">
              <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Chapter Upload</h3>
              <p className="text-muted-foreground mb-4">
                Use the existing Chapter Upload page or integrate the upload functionality here.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowChapterUpload(false);
                    // Navigate to chapter upload page
                    window.open('/account/admin/media', '_blank');
                  }}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Go to Upload Page
                </button>
                <button
                  onClick={() => setShowChapterUpload(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-foreground px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorksManagementPage;
