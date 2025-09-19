import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@zoroaster/shared';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  BookOpen, 
  Clock, 
  FileText, 
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  AlertCircle,
  Loader,
  RefreshCw
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  slug: string;
  chapter_number: number;
  issue_id: string;
  content: any;
  plain_content?: string;
  word_count: number;
  estimated_read_time: number;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
  issue?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Issue {
  id: string;
  title: string;
  slug: string;
  type: string;
}

const ChaptersManager = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchChaptersAndIssues();
  }, []);

  const fetchChaptersAndIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching chapters and issues...');
      
      // First, fetch all issues (content_items of type 'issue')
      const { data: issuesData, error: issuesError } = await supabase
        .from('content_items')
        .select('id, title, slug, type')
        .eq('type', 'issue')
        .eq('status', 'published')
        .order('title');

      if (issuesError) {
        console.error('❌ Error fetching issues:', issuesError);
        throw issuesError;
      }
      
      console.log('✅ Issues loaded:', issuesData?.length || 0);
      setIssues(issuesData || []);

      // Then fetch chapters with their associated issues
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select(`
          id,
          title,
          slug,
          chapter_number,
          issue_id,
          content,
          plain_content,
          word_count,
          estimated_read_time,
          status,
          published_at,
          created_at,
          updated_at,
          content_items!inner (
            id,
            title,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (chaptersError) {
        console.error('❌ Error fetching chapters:', chaptersError);
        throw chaptersError;
      }
      
      console.log('✅ Chapters loaded:', chaptersData?.length || 0);
      
      // Transform the data to include issue information
      const transformedChapters: Chapter[] = (chaptersData || []).map(chapter => ({
        ...chapter,
        issue: Array.isArray(chapter.content_items) ? chapter.content_items[0] : chapter.content_items
      }));
      
      setChapters(transformedChapters);

    } catch (error) {
      console.error('💥 Error fetching chapters or issues:', error);
      setError(error instanceof Error ? error.message : 'Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const getIssueTitle = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    return issue ? issue.title : 'Unknown Issue';
  };

  const deleteChapter = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the chapter "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting chapter:', id);
      
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Chapter deleted successfully');
      setChapters(chapters.filter(chapter => chapter.id !== id));
    } catch (error) {
      console.error('❌ Error deleting chapter:', error);
      alert('Failed to delete chapter. Please try again.');
    }
  };
  
  const toggleChapterStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      console.log('🔄 Toggling chapter status:', id, newStatus);
      
      const updateData: any = { 
        status: newStatus
      };
      
      // If publishing, set published_at
      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      } else {
        updateData.published_at = null;
      }
      
      const { error } = await supabase
        .from('chapters')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Chapter status updated successfully');
      
      // Update local state
      setChapters(chapters.map(chapter => 
        chapter.id === id 
          ? { 
              ...chapter, 
              status: newStatus as 'draft' | 'published',
              published_at: newStatus === 'published' ? new Date().toISOString() : undefined
            }
          : chapter
      ));
    } catch (error) {
      console.error('❌ Error updating chapter status:', error);
      alert('Failed to update chapter status. Please try again.');
    }
  };

  // Filter chapters based on search and filters
  const filteredChapters = chapters.filter(chapter => {
    // Search filter
    if (searchQuery && !chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !chapter.plain_content?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Issue filter
    if (selectedIssue !== 'all' && chapter.issue_id !== selectedIssue) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && chapter.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading chapters...</h3>
          <p className="text-gray-600">Fetching chapter data from database</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Chapters</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={fetchChaptersAndIssues}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapters Management</h1>
          <p className="text-gray-600 mt-1">
            Manage individual chapters within your issues
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchChaptersAndIssues}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <Link
            to="/admin/content/chapters/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chapter
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Issue Filter */}
          <div className="sm:w-48">
            <select
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Issues</option>
              {issues.map(issue => (
                <option key={issue.id} value={issue.id}>
                  {issue.title}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-32">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredChapters.length} of {chapters.length} chapters
        </span>
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {chapters.length === 0 ? 'No chapters found' : 'No chapters match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {chapters.length === 0 
                ? 'Create your first chapter to get started'
                : 'Try adjusting your search or filters'}
            </p>
            {chapters.length === 0 && (
              <Link
                to="/admin/content/chapters/new"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Chapter</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chapter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {chapter.chapter_number}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {chapter.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Chapter {chapter.chapter_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {chapter.issue?.title || getIssueTitle(chapter.issue_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {chapter.word_count.toLocaleString()} words
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {chapter.estimated_read_time} min read
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleChapterStatus(chapter.id, chapter.status)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                          chapter.status === 'published'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {chapter.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(chapter.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/content/chapters/${chapter.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          title="Edit chapter"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        {chapter.status === 'published' && (
                          <Link
                            to={`/library/issue/${chapter.issue?.slug || 'unknown'}`}
                            className="text-green-600 hover:text-green-900 transition-colors duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View chapter"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        
                        <button
                          onClick={() => deleteChapter(chapter.id, chapter.title)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Delete chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChaptersManager;