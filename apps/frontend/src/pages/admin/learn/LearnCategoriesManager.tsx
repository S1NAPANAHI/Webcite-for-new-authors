import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Spinner,
  Chip
} from '@nextui-org/react';
import { Plus, Edit, Trash2, Folder, Hash } from 'lucide-react';
import { supabase } from '@zoroaster/shared';
import { toast } from 'react-hot-toast';

interface LearnCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    learn_content: number;
  };
}

interface FormData {
  name: string;
  description: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export default function LearnCategoriesManager() {
  const [categories, setCategories] = useState<LearnCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<LearnCategory | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    slug: '',
    icon: '',
    sort_order: 0,
    is_active: true
  });
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasTable, setHasTable] = useState(false);

  useEffect(() => {
    checkTableAndFetchCategories();
  }, []);

  const checkTableAndFetchCategories = async () => {
    try {
      setLoading(true);
      
      // First check if learn_categories table exists by trying to query it
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('learn_categories')
        .select('*')
        .order('sort_order')
        .limit(1);

      if (categoriesError) {
        // Table doesn't exist, show mock categories
        console.log('learn_categories table not found, showing mock data');
        setHasTable(false);
        setCategories(getMockCategories());
      } else {
        // Table exists, fetch real data
        setHasTable(true);
        await fetchRealCategories();
      }

    } catch (error) {
      console.error('Error checking table:', error);
      setCategories(getMockCategories());
    } finally {
      setLoading(false);
    }
  };

  const fetchRealCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('learn_categories')
        .select('*')
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      // Get count of content for each category
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (category) => {
          try {
            const { count } = await supabase
              .from('learn_content')
              .select('*', { count: 'exact' })
              .eq('category_id', category.id);

            return {
              ...category,
              _count: {
                learn_content: count || 0
              }
            };
          } catch {
            return {
              ...category,
              _count: {
                learn_content: 0
              }
            };
          }
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching real categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const getMockCategories = (): LearnCategory[] => {
    return [
      {
        id: '1',
        name: 'Basics',
        description: 'Fundamental concepts and introductory material',
        slug: 'basics',
        icon: 'book-open',
        sort_order: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { learn_content: 2 }
      },
      {
        id: '2', 
        name: 'Sacred Texts',
        description: 'Religious texts and scriptural studies',
        slug: 'sacred-texts',
        icon: 'scroll',
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { learn_content: 1 }
      },
      {
        id: '3',
        name: 'Practices',
        description: 'Rituals, ceremonies, and daily practices',
        slug: 'practices',
        icon: 'flame',
        sort_order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { learn_content: 1 }
      },
      {
        id: '4',
        name: 'History',
        description: 'Historical context and development',
        slug: 'history',
        icon: 'clock',
        sort_order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { learn_content: 0 }
      },
      {
        id: '5',
        name: 'Philosophy',
        description: 'Philosophical concepts and teachings',
        slug: 'philosophy',
        icon: 'lightbulb',
        sort_order: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _count: { learn_content: 0 }
      }
    ];
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleCreate = () => {
    setMode('create');
    setFormData({
      name: '',
      description: '',
      slug: '',
      icon: '',
      sort_order: categories.length,
      is_active: true
    });
    onOpen();
  };

  const handleEdit = (category: LearnCategory) => {
    setMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      icon: category.icon || '',
      sort_order: category.sort_order,
      is_active: category.is_active
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!hasTable) {
      toast.info('Category management requires the learn_categories table. Please run the database migration first.');
      return;
    }

    try {
      if (mode === 'create') {
        const { error } = await supabase
          .from('learn_categories')
          .insert([formData]);

        if (error) throw error;
        toast.success('Category created successfully!');
      } else if (selectedCategory) {
        const { error } = await supabase
          .from('learn_categories')
          .update(formData)
          .eq('id', selectedCategory.id);

        if (error) throw error;
        toast.success('Category updated successfully!');
      }

      await fetchRealCategories();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id: string, hasContent: boolean) => {
    if (!hasTable) {
      toast.info('Category management requires the learn_categories table.');
      return;
    }

    if (hasContent) {
      toast.error('Cannot delete category with associated content. Please move or delete the content first.');
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('learn_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Category deleted successfully!');
      await fetchRealCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    if (!hasTable) {
      toast.info('Category management requires the learn_categories table.');
      return;
    }

    try {
      const { error } = await supabase
        .from('learn_categories')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'}!`);
      await fetchRealCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Failed to update category status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading Categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learn Categories</h1>
          <p className="text-muted-foreground">Organize your learning content into categories</p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleCreate}
        >
          Add Category
        </Button>
      </div>

      {/* Info Card */}
      <Card className={`mb-6 ${hasTable ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
        <CardBody>
          <div className="flex items-center gap-3">
            <div className={`p-2 ${hasTable ? 'bg-green-100' : 'bg-blue-100'} rounded-lg`}>
              <Hash className={`w-5 h-5 ${hasTable ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`font-medium ${hasTable ? 'text-green-800' : 'text-blue-800'}`}>
                {hasTable ? 'Categories Connected' : 'Mock Categories'}
              </p>
              <p className={`text-sm ${hasTable ? 'text-green-600' : 'text-blue-600'}`}>
                {hasTable 
                  ? `Connected to database. Managing ${categories.length} categories.`
                  : 'Database table not found. Showing sample categories. Run the migration to enable full management.'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">All Categories</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Categories table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>SLUG</TableColumn>
              <TableColumn>CONTENT COUNT</TableColumn>
              <TableColumn>ORDER</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded">
                        <Folder className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {category._count?.learn_content || 0} items
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="bordered">
                      {category.sort_order}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Switch
                      isSelected={category.is_active}
                      onValueChange={() => toggleActive(category.id, category.is_active)}
                      size="sm"
                      isDisabled={!hasTable}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEdit(category)}
                        isDisabled={!hasTable}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(
                          category.id,
                          (category._count?.learn_content || 0) > 0
                        )}
                        isDisabled={!hasTable}
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
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>
            {mode === 'create' ? 'Create New Category' : 'Edit Category'}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                isRequired
              />
              
              <Input
                label="Slug"
                placeholder="category-slug"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                description="URL-friendly version of the name"
                isRequired
              />

              <Textarea
                label="Description"
                placeholder="Brief description of this category"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Icon"
                  placeholder="book-open"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  description="Icon name (Lucide icons)"
                />

                <Input
                  label="Sort Order"
                  type="number"
                  placeholder="0"
                  value={formData.sort_order.toString()}
                  onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  description="Display order"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  isSelected={formData.is_active}
                  onValueChange={(checked) => setFormData({...formData, is_active: checked})}
                  size="sm"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSubmit} isDisabled={!hasTable}>
              {mode === 'create' ? 'Create' : 'Update'} Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}