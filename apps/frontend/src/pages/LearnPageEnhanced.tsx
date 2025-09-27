import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Chip,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import { 
  Search, 
  Clock, 
  BookOpen, 
  Eye,
  Filter,
  GraduationCap,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import { supabase, useAuth } from '@zoroaster/shared';
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
}

interface LearnProgress {
  id: string;
  user_id: string;
  resource_id: string;
  completed: boolean;
  completion_date?: string;
  time_spent: number;
  notes?: string;
}

interface UserStats {
  totalResources: number;
  completedResources: number;
  totalTimeSpent: number;
  currentStreak: number;
}

export default function LearnPageEnhanced() {
  const [resources, setResources] = useState<LearnResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LearnResource[]>([]);
  const [userProgress, setUserProgress] = useState<{ [key: string]: LearnProgress }>({});
  const [userStats, setUserStats] = useState<UserStats>({
    totalResources: 0,
    completedResources: 0,
    totalTimeSpent: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedResource, setSelectedResource] = useState<LearnResource | null>(null);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated } = useAuth();

  const categories = ['All', 'Basics', 'Sacred Texts', 'Practices', 'History', 'Philosophy', 'Rituals', 'Modern Practice'];
  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchResources();
    if (isAuthenticated && user) {
      fetchUserProgress();
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('learn_content')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load learning resources');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      // First, check if learn_progress table exists by attempting to select from it
      const { data: progressData, error: progressError } = await supabase
        .from('learn_progress')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (progressError) {
        // Table doesn't exist yet, just continue without progress tracking
        console.log('Learn progress table not found, continuing without progress tracking');
        return;
      }

      // Get all progress data
      const { data: allProgress, error: allProgressError } = await supabase
        .from('learn_progress')
        .select('*')
        .eq('user_id', user.id);

      if (allProgressError) throw allProgressError;

      const progressMap = (allProgress || []).reduce((acc, progress) => {
        acc[progress.resource_id] = progress;
        return acc;
      }, {} as { [key: string]: LearnProgress });

      setUserProgress(progressMap);

      // Calculate user stats
      const completed = allProgress?.filter(p => p.completed).length || 0;
      const totalTime = allProgress?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;

      setUserStats({
        totalResources: resources.length,
        completedResources: completed,
        totalTimeSpent: totalTime,
        currentStreak: 0 // TODO: Calculate streak based on completion dates
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedDifficulty && selectedDifficulty !== 'All') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    setFilteredResources(filtered);
  };

  const openResourceModal = (resource: LearnResource) => {
    setSelectedResource(resource);
    setReadingStartTime(Date.now());
    onOpen();
  };

  const closeResourceModal = async () => {
    if (selectedResource && readingStartTime && isAuthenticated && user) {
      const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000 / 60); // minutes
      await updateProgress(selectedResource.id, false, timeSpent);
    }
    
    setSelectedResource(null);
    setReadingStartTime(null);
    onClose();
  };

  const updateProgress = async (resourceId: string, completed: boolean, additionalTime: number = 0) => {
    if (!user) return;

    try {
      const existingProgress = userProgress[resourceId];
      const newTimeSpent = (existingProgress?.time_spent || 0) + additionalTime;

      const { error } = await supabase
        .from('learn_progress')
        .upsert({
          user_id: user.id,
          resource_id: resourceId,
          completed,
          completion_date: completed ? new Date().toISOString() : existingProgress?.completion_date,
          time_spent: newTimeSpent,
          notes: existingProgress?.notes
        }, {
          onConflict: 'user_id,resource_id'
        });

      if (error) throw error;

      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [resourceId]: {
          ...prev[resourceId],
          resource_id: resourceId,
          user_id: user.id,
          completed,
          time_spent: newTimeSpent,
          completion_date: completed ? new Date().toISOString() : prev[resourceId]?.completion_date
        } as LearnProgress
      }));

      if (completed) {
        toast.success('Resource marked as completed! 🎉');
        await fetchUserProgress(); // Refresh stats
      }

    } catch (error) {
      // If progress table doesn't exist, just show a message
      if (error && typeof error === 'object' && 'code' in error) {
        console.log('Progress tracking not available yet');
        if (completed) {
          toast.success('Great job completing this resource! Progress tracking will be available soon.');
        }
      } else {
        console.error('Error updating progress:', error);
        toast.error('Failed to update progress');
      }
    }
  };

  const markAsCompleted = async () => {
    if (!selectedResource || !user) return;
    
    const timeSpent = readingStartTime ? Math.floor((Date.now() - readingStartTime) / 1000 / 60) : 0;
    await updateProgress(selectedResource.id, true, timeSpent);
    closeResourceModal();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const getProgressPercentage = (resourceId: string) => {
    const progress = userProgress[resourceId];
    return progress?.completed ? 100 : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading learning resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-full">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Learn & Grow
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover comprehensive resources about Zoroastrianism, from ancient wisdom to modern practice. 
          Expand your knowledge and deepen your understanding.
        </p>
      </div>

      {/* User Stats (if authenticated) */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardBody className="text-center">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{userStats.totalResources}</p>
              <p className="text-sm text-blue-600">Resources Available</p>
            </CardBody>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardBody className="text-center">
              <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{userStats.completedResources}</p>
              <p className="text-sm text-green-600">Completed</p>
            </CardBody>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardBody className="text-center">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">{Math.floor(userStats.totalTimeSpent / 60)}h {userStats.totalTimeSpent % 60}m</p>
              <p className="text-sm text-purple-600">Time Spent</p>
            </CardBody>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardBody className="text-center">
              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-800">{Math.round((userStats.completedResources / userStats.totalResources) * 100) || 0}%</p>
              <p className="text-sm text-orange-600">Progress</p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-8">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            
            <Select
              placeholder="All Categories"
              className="md:w-48"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedCategory(selected === 'All' ? '' : selected);
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder="All Levels"
              className="md:w-48"
              selectedKeys={selectedDifficulty ? [selectedDifficulty] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedDifficulty(selected === 'All' ? '' : selected);
              }}
            >
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty === 'All' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </Select>

            <Button
              variant="light"
              onPress={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDifficulty('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const progress = userProgress[resource.id];
          const isCompleted = progress?.completed;
          
          return (
            <Card key={resource.id} className="h-full hover:shadow-lg transition-shadow cursor-pointer" isPressable onPress={() => openResourceModal(resource)}>
              {resource.image_url && (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={resource.image_url} 
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                    {resource.title}
                  </h3>
                  {isCompleted && (
                    <Chip size="sm" color="success" variant="flat">
                      ✓ Complete
                    </Chip>
                  )}
                </div>
              </CardHeader>
              
              <CardBody className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {resource.content.substring(0, 150)}...
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Chip size="sm" variant="flat">
                    {resource.category}
                  </Chip>
                  <Chip size="sm" color={getDifficultyColor(resource.difficulty)} variant="flat">
                    {resource.difficulty}
                  </Chip>
                </div>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Chip key={index} size="sm" variant="bordered">
                        {tag}
                      </Chip>
                    ))}
                    {resource.tags.length > 3 && (
                      <Chip size="sm" variant="bordered">
                        +{resource.tags.length - 3}
                      </Chip>
                    )}
                  </div>
                )}

                {isAuthenticated && progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{isCompleted ? '100%' : '0%'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${getProgressPercentage(resource.id)}%` }}
                      />
                    </div>
                    {progress.time_spent > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Time spent: {Math.floor(progress.time_spent / 60)}h {progress.time_spent % 60}m
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  color={isCompleted ? "success" : "primary"} 
                  variant={isCompleted ? "flat" : "solid"}
                  className="w-full"
                  startContent={isCompleted ? <Eye className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                >
                  {isCompleted ? 'Review' : 'Start Reading'}
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && !loading && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No resources found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory || selectedDifficulty
              ? 'Try adjusting your filters to find more resources.'
              : 'No learning resources are available at the moment.'}
          </p>
          <Button
            variant="light"
            onPress={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedDifficulty('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Resource Reading Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={closeResourceModal}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {selectedResource && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{selectedResource.title}</h2>
                <div className="flex gap-2">
                  <Chip size="sm" variant="flat">
                    {selectedResource.category}
                  </Chip>
                  <Chip size="sm" color={getDifficultyColor(selectedResource.difficulty)} variant="flat">
                    {selectedResource.difficulty}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="prose prose-gray max-w-none">
                  {selectedResource.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={closeResourceModal}>
                  Close
                </Button>
                {isAuthenticated && !userProgress[selectedResource.id]?.completed && (
                  <Button color="success" onPress={markAsCompleted}>
                    Mark as Completed
                  </Button>
                )}
                {isAuthenticated && userProgress[selectedResource.id]?.completed && (
                  <Chip color="success" variant="flat">
                    ✓ Completed
                  </Chip>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}