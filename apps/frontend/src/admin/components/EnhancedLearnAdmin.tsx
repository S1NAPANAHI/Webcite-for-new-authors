import React, { useState, useEffect, useCallback } from 'react';
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Progress,
  Spacer,
  Divider
} from '@nextui-org/react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp,
  Users,
  BookOpen,
  Video,
  Download,
  DollarSign,
  Calendar,
  Filter,
  Search,
  BarChart3,
  FileText,
  Upload,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
type AuthorJourneyPost = Database['public']['Tables']['authors_journey_posts']['Row'];
type WritingGuide = Database['public']['Tables']['writing_guides']['Row'];
type VideoTutorial = Database['public']['Tables']['video_tutorials']['Row'];
type DownloadableTemplate = Database['public']['Tables']['downloadable_templates']['Row'];
type ProfessionalService = Database['public']['Tables']['professional_services']['Row'];

type ContentType = 'authors_journey' | 'writing_guides' | 'video_tutorials' | 'downloadable_templates' | 'professional_services';
type ContentStatus = 'draft' | 'published' | 'archived';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  status: ContentStatus;
  difficulty?: DifficultyLevel;
  category?: string;
  view_count?: number;
  created_at: string;
  updated_at: string;
  author?: string;
  price?: number;
  duration?: number;
  file_path?: string;
  video_url?: string;
  slug?: string;
}

interface AnalyticsData {
  totalViews: number;
  totalContent: number;
  popularContent: ContentItem[];
  categoryBreakdown: { [key: string]: number };
  difficultyBreakdown: { [key: string]: number };
  recentActivity: any[];
}

// Content Form Component
const ContentForm = ({ 
  type, 
  content, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  type: ContentType;
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) => {
  const [formData, setFormData] = useState<Partial<ContentItem>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(content);
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        status: 'draft',
        difficulty: 'beginner',
        category: '',
        author: '',
        price: 0,
        duration: 0,
        file_path: '',
        video_url: '',
        slug: ''
      });
    }
  }, [content, isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
      toast.success(`${content ? 'Updated' : 'Created'} successfully!`);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !content ? generateSlug(title) : prev.slug // Only auto-generate for new content
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          {content ? 'Edit' : 'Create'} {type.replace('_', ' ')}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Title"
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              variant="bordered"
              isRequired
            />
            
            <Input
              label="Slug"
              value={formData.slug || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              variant="bordered"
              description="URL-friendly version of the title"
            />
            
            <Textarea
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              variant="bordered"
              rows={3}
            />
            
            {(type === 'authors_journey' || type === 'writing_guides') && (
              <Textarea
                label="Content"
                value={formData.content || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                variant="bordered"
                rows={8}
                description="Main content (HTML supported)"
              />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                selectedKeys={formData.status ? [formData.status] : []}
                onSelectionChange={(keys) => setFormData(prev => ({ 
                  ...prev, 
                  status: Array.from(keys)[0] as ContentStatus 
                }))}
                variant="bordered"
              >
                <SelectItem key="draft">Draft</SelectItem>
                <SelectItem key="published">Published</SelectItem>
                <SelectItem key="archived">Archived</SelectItem>
              </Select>
              
              <Select
                label="Difficulty"
                selectedKeys={formData.difficulty ? [formData.difficulty] : []}
                onSelectionChange={(keys) => setFormData(prev => ({ 
                  ...prev, 
                  difficulty: Array.from(keys)[0] as DifficultyLevel 
                }))}
                variant="bordered"
              >
                <SelectItem key="beginner">Beginner</SelectItem>
                <SelectItem key="intermediate">Intermediate</SelectItem>
                <SelectItem key="advanced">Advanced</SelectItem>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Category"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                variant="bordered"
              />
              
              <Input
                label="Author"
                value={formData.author || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                variant="bordered"
              />
            </div>
            
            {type === 'video_tutorials' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Video URL"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  variant="bordered"
                />
                
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration?.toString() || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  variant="bordered"
                />
              </div>
            )}
            
            {type === 'downloadable_templates' && (
              <Input
                label="File Path/URL"
                value={formData.file_path || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, file_path: e.target.value }))}
                variant="bordered"
              />
            )}
            
            {type === 'professional_services' && (
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                value={formData.price?.toString() || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                variant="bordered"
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            isLoading={isLoading}
          >
            {content ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = ({ data }: { data: AnalyticsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardBody className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{data.totalViews.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Views</p>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody className="text-center">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{data.totalContent}</p>
          <p className="text-sm text-gray-500">Total Content</p>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{data.popularContent.length}</p>
          <p className="text-sm text-gray-500">Popular Items</p>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">{Object.keys(data.categoryBreakdown).length}</p>
          <p className="text-sm text-gray-500">Categories</p>
        </CardBody>
      </Card>
    </div>
  );
};

// Content Table Component
const ContentTable = ({ 
  data, 
  type, 
  onEdit, 
  onDelete, 
  onView 
}: { 
  data: ContentItem[];
  type: ContentType;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onView: (item: ContentItem) => void;
}) => {
  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty?: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  return (
    <Table aria-label={`${type} content table`}>
      <TableHeader>
        <TableColumn>TITLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>DIFFICULTY</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>VIEWS</TableColumn>
        <TableColumn>CREATED</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div>
                <p className="font-medium">{item.title}</p>
                {item.author && (
                  <p className="text-sm text-gray-500">by {item.author}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Chip 
                size="sm" 
                color={getStatusColor(item.status)}
                variant="flat"
              >
                {item.status}
              </Chip>
            </TableCell>
            <TableCell>
              {item.difficulty && (
                <Chip 
                  size="sm" 
                  color={getDifficultyColor(item.difficulty)}
                  variant="flat"
                >
                  {item.difficulty}
                </Chip>
              )}
            </TableCell>
            <TableCell>{item.category || '-'}</TableCell>
            <TableCell>{(item.view_count || 0).toLocaleString()}</TableCell>
            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="light" 
                    size="sm" 
                    isIconOnly
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem 
                    key="view" 
                    startContent={<Eye className="w-4 h-4" />}
                    onPress={() => onView(item)}
                  >
                    View
                  </DropdownItem>
                  <DropdownItem 
                    key="edit" 
                    startContent={<Edit3 className="w-4 h-4" />}
                    onPress={() => onEdit(item)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem 
                    key="delete" 
                    className="text-danger" 
                    color="danger"
                    startContent={<Trash2 className="w-4 h-4" />}
                    onPress={() => onDelete(item.id)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Main Enhanced Learn Admin Component
export default function EnhancedLearnAdmin() {
  const [activeTab, setActiveTab] = useState<ContentType>('authors_journey');
  const [data, setData] = useState<{ [key in ContentType]: ContentItem[] }>({
    authors_journey: [],
    writing_guides: [],
    video_tutorials: [],
    downloadable_templates: [],
    professional_services: []
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalContent: 0,
    popularContent: [],
    categoryBreakdown: {},
    difficultyBreakdown: {},
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tableNames: { [key in ContentType]: string } = {
    authors_journey: 'authors_journey_posts',
    writing_guides: 'writing_guides',
    video_tutorials: 'video_tutorials',
    downloadable_templates: 'downloadable_templates',
    professional_services: 'professional_services'
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const promises = Object.entries(tableNames).map(async ([key, tableName]) => {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return [key, data || []];
      });

      const results = await Promise.all(promises);
      const newData = Object.fromEntries(results) as { [key in ContentType]: ContentItem[] };
      setData(newData);

      // Calculate analytics
      const totalContent = Object.values(newData).reduce((sum, items) => sum + items.length, 0);
      const totalViews = Object.values(newData).flat().reduce((sum, item) => sum + (item.view_count || 0), 0);
      const popularContent = Object.values(newData).flat()
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5);
      
      const categoryBreakdown: { [key: string]: number } = {};
      const difficultyBreakdown: { [key: string]: number } = {};
      
      Object.values(newData).flat().forEach(item => {
        if (item.category) {
          categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;
        }
        if (item.difficulty) {
          difficultyBreakdown[item.difficulty] = (difficultyBreakdown[item.difficulty] || 0) + 1;
        }
      });

      setAnalytics({
        totalContent,
        totalViews,
        popularContent,
        categoryBreakdown,
        difficultyBreakdown,
        recentActivity: []
      });
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (formData: Partial<ContentItem>) => {
    const tableName = tableNames[activeTab];
    
    if (selectedContent) {
      // Update existing
      const { error } = await supabase
        .from(tableName)
        .update(formData)
        .eq('id', selectedContent.id);
      
      if (error) throw error;
    } else {
      // Create new
      const { error } = await supabase
        .from(tableName)
        .insert([formData]);
      
      if (error) throw error;
    }
    
    await fetchData();
    setSelectedContent(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const tableName = tableNames[activeTab];
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error(`Error deleting: ${error.message}`);
      return;
    }
    
    toast.success('Deleted successfully!');
    await fetchData();
  };

  const handleView = (item: ContentItem) => {
    if (item.slug) {
      const baseUrl = activeTab === 'authors_journey' ? '/learn/authors-journey' : '/learn/writing-guides';
      window.open(`${baseUrl}/${item.slug}`, '_blank');
    }
  };

  const filteredData = data[activeTab]?.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const tabIcons = {
    authors_journey: BookOpen,
    writing_guides: FileText,
    video_tutorials: Video,
    downloadable_templates: Download,
    professional_services: DollarSign
  };

  const tabLabels = {
    authors_journey: "Author's Journey",
    writing_guides: 'Writing Guides',
    video_tutorials: 'Video Tutorials',
    downloadable_templates: 'Templates',
    professional_services: 'Services'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Learn admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learn Content Management</h1>
        <p className="text-gray-600">Manage all educational content and professional services</p>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard data={analytics} />

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="w-4 h-4" />}
                className="w-64"
              />
            </div>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={() => {
                setSelectedContent(null);
                setIsFormOpen(true);
              }}
            >
              Add {tabLabels[activeTab]}
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as ContentType)}
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:font-semibold"
            }}
          >
            {(Object.keys(tabLabels) as ContentType[]).map((key) => {
              const Icon = tabIcons[key];
              return (
                <Tab
                  key={key}
                  title={
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{tabLabels[key]}</span>
                      <Chip size="sm" variant="flat">
                        {data[key]?.length || 0}
                      </Chip>
                    </div>
                  }
                >
                  <div className="mt-6">
                    {filteredData.length > 0 ? (
                      <ContentTable
                        data={filteredData}
                        type={activeTab}
                        onEdit={(item) => {
                          setSelectedContent(item);
                          setIsFormOpen(true);
                        }}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-4">
                          {searchQuery ? 'No content matches your search.' : `No ${tabLabels[activeTab].toLowerCase()} found.`}
                        </p>
                        <Button
                          color="primary"
                          startContent={<Plus className="w-4 h-4" />}
                          onPress={() => {
                            setSelectedContent(null);
                            setIsFormOpen(true);
                          }}
                        >
                          Create First {tabLabels[activeTab]}
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>
              );
            })}
          </Tabs>
        </CardBody>
      </Card>

      {/* Content Form Modal */}
      <ContentForm
        type={activeTab}
        content={selectedContent}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedContent(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}