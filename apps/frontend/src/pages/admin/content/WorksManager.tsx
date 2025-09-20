import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
  FileText,
  Layers,
  Archive,
  Calendar,
  Star,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ContentItem, 
  ContentItemWithChildren, 
  ContentItemType, 
  HIERARCHY_LEVELS, 
  STATUS_COLORS,
  CreateContentItemForm
} from '../../../types/content';
import { contentApi, supabaseContentApi, buildContentTree, generateSlug, validateContentItem, getAvailableChildTypes } from '../../../lib/contentApi';
import ImageInput from '../../../components/ImageInput';
import { FileRecord } from '../../../utils/fileUpload';

interface TreeItemProps {
  item: ContentItemWithChildren;
  depth: number;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onAddChild: (parentItem: ContentItem) => void;
  expandedItems: Set<string>;
  toggleExpanded: (id: string) => void;
}

function TreeItem({ item, depth, onEdit, onDelete, onAddChild, expandedItems, toggleExpanded }: TreeItemProps) {
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const indentClass = `ml-${depth * 6}`;
  
  const getTypeIcon = (type: ContentItemType) => {
    const icons = {
      book: BookOpen,
      volume: Layers,
      saga: Archive,
      arc: FileText,
      issue: FileText
    };
    return icons[type];
  };
  
  const TypeIcon = getTypeIcon(item.type);
  
  return (
    <div className="border-l border-gray-200">
      <div className={`flex items-center space-x-3 p-3 hover:bg-gray-50 ${indentClass}`}>
        {/* Expand/Collapse Button */}
        <button
          onClick={() => toggleExpanded(item.id)}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>
        
        {/* Cover Image Thumbnail */}
        <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
          {item.cover_image_url || item.cover_file_url ? (
            <img 
              src={item.cover_file_url || item.cover_image_url} 
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
              <TypeIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              STATUS_COLORS[item.status]
            }`}>
              {item.status}
            </span>
            <span className="text-xs text-gray-500 uppercase">
              {HIERARCHY_LEVELS[item.type].label}
            </span>
            {/* Published indicator */}
            {item.status === 'published' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Eye className="w-3 h-3 mr-1" />Public
              </span>
            )}
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-500 truncate mt-1">{item.description}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-gray-600">{item.average_rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({item.rating_count})</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-600">{item.completion_percentage}%</span>
            </div>
            
            {item.metadata?.chapter_count && (
              <div className="flex items-center space-x-1">
                <FileText className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-gray-600">{item.metadata.chapter_count} chapters</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors duration-200"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          {getAvailableChildTypes(item.type).length > 0 && (
            <button
              onClick={() => onAddChild(item)}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
              title="Add Child"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          
          {item.type === 'issue' && (
            <Link
              to={`/admin/content/chapters?issue=${item.id}`}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Manage Chapters"
            >
              <FileText className="w-4 h-4" />
            </Link>
          )}
          
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6">
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ContentItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ContentItem;
  parentItem?: ContentItem;
  onSave: (data: CreateContentItemForm) => void;
  loading: boolean;
}

function ContentItemModal({ isOpen, onClose, item, parentItem, onSave, loading }: ContentItemModalProps) {
  const [formData, setFormData] = useState<CreateContentItemForm>({
    type: 'book',
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    cover_file_id: undefined,
    parent_id: parentItem?.id,
    order_index: 0,
    status: 'published', // Default to published so content is visible immediately
    published_at: new Date().toISOString().slice(0, 16), // Current date/time
    metadata: {}
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<FileRecord | null>(null);
  
  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type,
        title: item.title,
        slug: item.slug,
        description: item.description || '',
        cover_image_url: item.cover_image_url || '',
        cover_file_id: item.cover_file_id,
        parent_id: item.parent_id,
        order_index: item.order_index,
        status: item.status,
        published_at: item.published_at || new Date().toISOString().slice(0, 16),
        metadata: item.metadata || {}
      });
      
      // Set cover file if exists
      if (item.cover_file_id) {
        setCoverFile({ id: item.cover_file_id } as FileRecord);
      } else {
        setCoverFile(null);
      }
    } else if (parentItem) {
      // Set appropriate child type based on parent
      const availableTypes = getAvailableChildTypes(parentItem.type);
      const defaultType = availableTypes[0] || 'book';
      
      setFormData(prev => ({
        ...prev,
        type: defaultType,
        parent_id: parentItem.id,
        status: 'published', // Default to published
        published_at: new Date().toISOString().slice(0, 16)
      }));
      setCoverFile(null);
    } else {
      // Reset to default for new root item
      setFormData({
        type: 'book',
        title: '',
        slug: '',
        description: '',
        cover_image_url: '',
        cover_file_id: undefined,
        parent_id: undefined,
        order_index: 0,
        status: 'published', // Default to published
        published_at: new Date().toISOString().slice(0, 16),
        metadata: {}
      });
      setCoverFile(null);
    }
    setErrors([]);
  }, [item, parentItem, isOpen]);
  
  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !item) { // Only auto-generate for new items
      const slug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, item]);
  
  const handleCoverFileChange = (file: FileRecord | null) => {
    setCoverFile(file);
    setFormData(prev => ({
      ...prev,
      cover_file_id: file?.id,
      // Clear URL if we're using file upload
      cover_image_url: file ? '' : prev.cover_image_url
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateContentItem(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clean up the form data before submission
    const cleanedData = {
      ...formData,
      // Convert empty strings to null for optional fields
      description: formData.description?.trim() || null,
      cover_image_url: formData.cover_image_url?.trim() || null,
      cover_file_id: coverFile?.id || null,
      published_at: formData.status === 'published' ? 
        (formData.published_at?.trim() || new Date().toISOString()) : null,
      // Ensure parent_id is properly set or null
      parent_id: formData.parent_id || null,
      // Ensure metadata is a valid object
      metadata: formData.metadata || {}
    };
    
    setErrors([]);
    onSave(cleanedData);
  };
  
  if (!isOpen) return null;
  
  const getAvailableTypesForForm = () => {
    if (!parentItem) return ['book'];
    return getAvailableChildTypes(parentItem.type);
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {item ? 'Edit' : 'Create'} {HIERARCHY_LEVELS[formData.type]?.label || 'Content'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {parentItem && `Adding to: ${parentItem.title}`}
            </p>
            
            {!item && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Publishing Automatically</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  New content will be published immediately and visible to all users in the library.
                </p>
              </div>
            )}
            
            {errors.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Please fix the following errors:</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 space-y-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentItemType }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={!!parentItem} // Disabled if we have a parent (type is determined)
              >
                {getAvailableTypesForForm().map(type => (
                  <option key={type} value={type}>
                    {HIERARCHY_LEVELS[type as ContentItemType].label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                placeholder="Enter the title"
              />
            </div>
            
            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                placeholder="enter-slug-here"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly version of the title. Only lowercase letters, numbers, and dashes.
              </p>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Brief description of the content"
              />
            </div>
            
            {/* Cover Image - New ImageInput Component */}
            <div>
              <ImageInput
                label="Cover Image"
                value={coverFile}
                onChange={handleCoverFileChange}
                placeholder="Select a cover image from your gallery..."
                allowedTypes={['images']}
                showPreview={true}
                previewSize="large"
              />
            </div>
            
            {/* Legacy Cover Image URL - Show if no file selected */}
            {!coverFile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or use External Image URL
                </label>
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use uploaded images above for better performance, or paste an external URL here.
                </p>
              </div>
            )}
            
            {/* Status & Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published (Recommended)</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
                {formData.status === 'published' && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Will be visible to all users immediately
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
            
            {/* Published At (for scheduled items or published items) */}
            {(formData.status === 'scheduled' || formData.status === 'published') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.status === 'scheduled' ? 'Publish Date' : 'Published Date'}
                </label>
                <input
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
          
          {/* Modal Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.slug}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{item ? 'Update' : 'Create & Publish'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Success/Error notification component
function Notification({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-md ${
      type === 'success' 
        ? 'bg-green-50 text-green-800 border-green-200' 
        : 'bg-red-50 text-red-800 border-red-200'
    }`}>
      <div className="flex items-center space-x-2">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function WorksManager() {
  const [hierarchyData, setHierarchyData] = useState<ContentItemWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentItemType | 'all'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [parentForNew, setParentForNew] = useState<ContentItem | null>(null);
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      // Try to use Supabase directly since backend might not be set up yet
      const items = await supabaseContentApi.getContentItems();
      const tree = buildContentTree(items);
      setHierarchyData(tree);
      
      // Auto-expand first few levels
      const autoExpand = new Set<string>();
      tree.forEach(item => {
        autoExpand.add(item.id);
        if (item.children) {
          item.children.forEach(child => {
            autoExpand.add(child.id);
            if (child.children) {
              child.children.forEach(grandchild => autoExpand.add(grandchild.id));
            }
          });
        }
      });
      setExpandedItems(autoExpand);
    } catch (error) {
      console.error('Error loading content items:', error);
      setNotification({ message: 'Failed to load content items', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };
  
  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setParentForNew(null);
    setShowModal(true);
  };
  
  const handleAddChild = (parentItem: ContentItem) => {
    setEditingItem(null);
    setParentForNew(parentItem);
    setShowModal(true);
  };
  
  const handleCreateNew = () => {
    setEditingItem(null);
    setParentForNew(null);
    setShowModal(true);
  };
  
  const handleSave = async (data: CreateContentItemForm) => {
    try {
      setOperationLoading(true);
      
      if (editingItem) {
        // Update existing item
        await supabaseContentApi.updateContentItem(editingItem.id, data);
        setNotification({ 
          message: `Content updated and ${data.status === 'published' ? 'published' : 'saved'} successfully!`, 
          type: 'success' 
        });
      } else {
        // Create new item
        await supabaseContentApi.createContentItem(data);
        setNotification({ 
          message: `Content created and ${data.status === 'published' ? 'published' : 'saved'} successfully! ${data.status === 'published' ? 'It is now visible to all users.' : ''}`, 
          type: 'success' 
        });
      }
      
      setShowModal(false);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error saving item:', error);
      setNotification({ 
        message: error instanceof Error ? error.message : 'Failed to save content', 
        type: 'error' 
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  const handleDelete = async (item: ContentItem) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${item.title}"? This will also delete all child items and cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      setOperationLoading(true);
      await supabaseContentApi.deleteContentItem(item.id);
      setNotification({ message: 'Content deleted successfully!', type: 'success' });
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({ 
        message: error instanceof Error ? error.message : 'Failed to delete content', 
        type: 'error' 
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (items: ContentItemWithChildren[]) => {
      items.forEach(item => {
        allIds.add(item.id);
        if (item.children) collectIds(item.children);
      });
    };
    collectIds(hierarchyData);
    setExpandedItems(allIds);
  };
  
  const collapseAll = () => {
    setExpandedItems(new Set());
  };
  
  // Filter data based on search and type
  const filteredData = hierarchyData.filter(item => {
    if (searchQuery) {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    
    if (selectedType !== 'all' && item.type !== selectedType) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Hierarchy</h1>
            <p className="text-gray-600 mt-1">
              Manage your BOOKS → VOLUMES → SAGAS → ARCS → ISSUES structure
            </p>
            <p className="text-sm text-blue-600 mt-1">
              💡 New content is automatically published and visible to all users
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/content/files"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              📁 Manage Files
            </Link>
            <button
              onClick={expandAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
              disabled={loading}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
              disabled={loading}
            >
              Collapse All
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
              disabled={operationLoading}
            >
              <Plus className="w-4 h-4" />
              <span>New Book</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="volume">Volumes</option>
            <option value="saga">Sagas</option>
            <option value="arc">Arcs</option>
            <option value="issue">Issues</option>
          </select>
        </div>
      </div>

      {/* Content Tree - Full height with scroll */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading content...</h3>
            <p className="text-gray-600">Please wait while we fetch your content hierarchy</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hierarchyData.length === 0 ? 'No content yet' : 'No matching content'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hierarchyData.length === 0 
                ? 'Start by creating your first book' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {hierarchyData.length === 0 && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Book</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                depth={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ContentItemModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={editingItem}
        parentItem={parentForNew}
        onSave={handleSave}
        loading={operationLoading}
      />
    </div>
  );
}