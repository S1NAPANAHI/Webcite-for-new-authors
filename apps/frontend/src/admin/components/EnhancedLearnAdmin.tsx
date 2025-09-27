import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Spinner
} from '@nextui-org/react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BookOpen,
  Users,
  Clock,
  Tag
} from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { toast } from 'react-hot-toast';

interface LearnResource {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  image_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface FormData {
  title: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  image_url: string;
  tags: string;
}

const DIFFICULTY_OPTIONS = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' }
];

const STATUS_OPTIONS = [
  { key: 'draft', label: 'Draft' },
  { key: 'published', label: 'Published' },
  { key: 'archived', label: 'Archived' }
];

const CATEGORY_OPTIONS = [
  { key: 'Basics', label: 'Basics' },
  { key: 'Sacred Texts', label: 'Sacred Texts' },
  { key: 'Practices', label: 'Practices' },
  { key: 'History', label: 'History' },
  { key: 'Philosophy', label: 'Philosophy' },
  { key: 'Rituals', label: 'Rituals' },
  { key: 'Modern Practice', label: 'Modern Practice' }
];

export default function EnhancedLearnAdmin() {
  const [resources, setResources] = useState<LearnResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<LearnResource | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: '',
    difficulty: 'beginner',
    status: 'draft',
    image_url: '',
    tags: ''
  });
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learn_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResources(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const published = data?.filter(r => r.status === 'published').length || 0;
      const draft = data?.filter(r => r.status === 'draft').length || 0;
      
      setStats({ total, published, draft });

    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setMode('create');
    setFormData({
      title: '',
      content: '',
      category: '',
      difficulty: 'beginner',
      status: 'draft',
      image_url: '',
      tags: ''
    });
    onOpen();
  };

  const handleEdit = (resource: LearnResource) => {
    setMode('edit');
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      content: resource.content,
      category: resource.category,
      difficulty: resource.difficulty,
      status: resource.status,
      image_url: resource.image_url || '',
      tags: resource.tags?.join(', ') || ''
    });
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      const resourceData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        difficulty: formData.difficulty,
        status: formData.status,
        image_url: formData.image_url || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('learn_content')
          .insert([resourceData]);

        if (error) throw error;
        toast.success('Resource created successfully!');
      } else if (selectedResource) {
        const { error } = await supabase
          .from('learn_content')
          .update(resourceData)
          .eq('id', selectedResource.id);

        if (error) throw error;
        toast.success('Resource updated successfully!');
      }

      await fetchResources();
      onClose();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('learn_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Resource deleted successfully!');
      await fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const toggleStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('learn_content')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Resource ${newStatus}!`);
      await fetchResources();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading Learn Resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learn Resources</h1>
          <p className="text-muted-foreground">Manage learning content for your community</p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleCreate}
        >
          Add Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody className="flex flex-row items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Resources</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Eye className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.published}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Edit className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">All Resources</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Learn resources table">
            <TableHeader>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>DIFFICULTY</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CREATED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.content.substring(0, 100)}...
                      </p>
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.tags.slice(0, 2).map((tag, index) => (
                            <Chip key={index} size="sm" variant="flat">
                              {tag}
                            </Chip>
                          ))}
                          {resource.tags.length > 2 && (
                            <Chip size="sm" variant="flat">
                              +{resource.tags.length - 2}
                            </Chip>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {resource.category}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      color={getDifficultyColor(resource.difficulty)}
                      variant="flat"
                    >
                      {resource.difficulty}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      color={getStatusColor(resource.status)}
                      variant="flat"
                    >
                      {resource.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(resource.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => toggleStatus(
                          resource.id, 
                          resource.status === 'published' ? 'draft' : 'published'
                        )}
                      >
                        {resource.status === 'published' ? 
                          <EyeOff className="w-4 h-4" /> : 
                          <Eye className="w-4 h-4" />
                        }
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEdit(resource)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(resource.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            {mode === 'create' ? 'Create New Resource' : 'Edit Resource'}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Title"
                placeholder="Enter resource title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                isRequired
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  placeholder="Select category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setFormData({...formData, category: selected});
                  }}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Difficulty"
                  selectedKeys={[formData.difficulty]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as 'beginner' | 'intermediate' | 'advanced';
                    setFormData({...formData, difficulty: selected});
                  }}
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Status"
                  selectedKeys={[formData.status]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as 'draft' | 'published' | 'archived';
                    setFormData({...formData, status: selected});
                  }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Image URL (Optional)"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />
              </div>

              <Input
                label="Tags"
                placeholder="tag1, tag2, tag3"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                description="Comma-separated tags"
              />

              <Textarea
                label="Content"
                placeholder="Write your resource content here..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                minRows={8}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              {mode === 'create' ? 'Create' : 'Update'} Resource
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}