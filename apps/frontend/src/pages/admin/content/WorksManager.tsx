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
  BarChart3
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

// Mock data for development
const mockHierarchyData: ContentItemWithChildren[] = [
  {
    id: '1',
    type: 'book',
    title: 'The Chronicles of Ahura',
    slug: 'chronicles-of-ahura',
    description: 'The epic tale of light versus darkness in ancient Persia',
    cover_image_url: '/covers/chronicles-book.jpg',
    order_index: 1,
    completion_percentage: 45,
    average_rating: 4.8,
    rating_count: 127,
    status: 'published',
    published_at: '2025-01-15T00:00:00Z',
    metadata: {},
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-09-15T00:00:00Z',
    children: [
      {
        id: '2',
        type: 'volume',
        title: 'Volume I: The Awakening',
        slug: 'volume-1-awakening',
        description: 'The beginning of the great journey',
        parent_id: '1',
        order_index: 1,
        completion_percentage: 75,
        average_rating: 4.9,
        rating_count: 89,
        status: 'published',
        published_at: '2025-01-15T00:00:00Z',
        metadata: {},
        created_at: '2025-01-05T00:00:00Z',
        updated_at: '2025-09-10T00:00:00Z',
        children: [
          {
            id: '3',
            type: 'saga',
            title: 'The Fire Temple Saga',
            slug: 'fire-temple-saga',
            description: 'The discovery of the ancient fire temple',
            parent_id: '2',
            order_index: 1,
            completion_percentage: 100,
            average_rating: 4.7,
            rating_count: 64,
            status: 'published',
            published_at: '2025-01-20T00:00:00Z',
            metadata: {},
            created_at: '2025-01-10T00:00:00Z',
            updated_at: '2025-08-15T00:00:00Z',
            children: [
              {
                id: '4',
                type: 'arc',
                title: 'The First Trial Arc',
                slug: 'first-trial-arc',
                description: 'The protagonist faces their first major challenge',
                parent_id: '3',
                order_index: 1,
                completion_percentage: 100,
                average_rating: 4.6,
                rating_count: 45,
                status: 'published',
                published_at: '2025-02-01T00:00:00Z',
                metadata: {},
                created_at: '2025-01-15T00:00:00Z',
                updated_at: '2025-07-20T00:00:00Z',
                children: [
                  {
                    id: '5',
                    type: 'issue',
                    title: 'Issue #1: The Calling',
                    slug: 'issue-1-the-calling',
                    description: 'The journey begins with a mysterious calling',
                    parent_id: '4',
                    order_index: 1,
                    completion_percentage: 75,
                    average_rating: 4.8,
                    rating_count: 32,
                    status: 'published',
                    published_at: '2025-02-10T00:00:00Z',
                    metadata: { chapter_count: 4 },
                    created_at: '2025-01-20T00:00:00Z',
                    updated_at: '2025-09-18T00:00:00Z'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

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
        
        {/* Type Icon */}
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-4 h-4 text-white" />
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
          
          <button
            onClick={() => onAddChild(item)}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
            title="Add Child"
          >
            <Plus className="w-4 h-4" />
          </button>
          
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
}

function ContentItemModal({ isOpen, onClose, item, parentItem, onSave }: ContentItemModalProps) {
  const [formData, setFormData] = useState<CreateContentItemForm>({
    type: 'book',
    title: '',
    slug: '',
    description: '',
    cover_image_url: '',
    parent_id: parentItem?.id,
    order_index: 0,
    status: 'draft',
    published_at: '',
    metadata: {}
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type,
        title: item.title,
        slug: item.slug,
        description: item.description || '',
        cover_image_url: item.cover_image_url || '',
        parent_id: item.parent_id,
        order_index: item.order_index,
        status: item.status,
        published_at: item.published_at || '',
        metadata: item.metadata || {}
      });
    } else if (parentItem) {
      // Set appropriate child type based on parent
      const childTypes = {
        book: 'volume',
        volume: 'saga', 
        saga: 'arc',
        arc: 'issue'
      };
      
      setFormData(prev => ({
        ...prev,
        type: childTypes[parentItem.type as keyof typeof childTypes] || 'book',
        parent_id: parentItem.id
      }));
    }
  }, [item, parentItem]);
  
  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !item) { // Only auto-generate for new items
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, item]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  const getAvailableTypes = () => {
    if (!parentItem) return ['book'];
    
    const childTypes = {
      book: ['volume'],
      volume: ['saga'],
      saga: ['arc'],
      arc: ['issue']
    };
    
    return childTypes[parentItem.type as keyof typeof childTypes] || [];
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
                {getAvailableTypes().map(type => (
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
              />
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
              />
            </div>
            
            {/* Cover Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.cover_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
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
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
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
                />
              </div>
            </div>
            
            {/* Published At (for scheduled items) */}
            {formData.status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
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
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.slug}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WorksManager() {
  const [hierarchyData, setHierarchyData] = useState<ContentItemWithChildren[]>(mockHierarchyData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentItemType | 'all'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1', '2', '3', '4']));
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [parentForNew, setParentForNew] = useState<ContentItem | null>(null);
  
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
    // Here you would make API call to save the data
    console.log('Saving:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh data after save
    // In real implementation, you'd refetch from API
    setShowModal(false);
  };
  
  const handleDelete = async (item: ContentItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"? This will also delete all child items.`)) {
      // API call to delete
      console.log('Deleting:', item.id);
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
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Hierarchy</h1>
            <p className="text-gray-600 mt-1">
              Manage your BOOKS → VOLUMES → SAGAS → ARCS → ISSUES structure
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={expandAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Collapse All
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
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
        {hierarchyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first book</p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Book</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {hierarchyData.map((item) => (
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
      />
    </div>
  );
}