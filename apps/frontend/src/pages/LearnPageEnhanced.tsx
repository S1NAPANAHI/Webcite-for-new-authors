import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Tabs, 
  Tab, 
  Spinner, 
  Card, 
  CardBody, 
  Button, 
  Input,
  Select,
  SelectItem,
  Chip,
  Progress,
  Avatar,
  Badge,
  Tooltip
} from '@nextui-org/react';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Video, 
  Download, 
  DollarSign, 
  Search, 
  Filter, 
  Clock, 
  User, 
  BookOpen, 
  Star,
  TrendingUp,
  Calendar,
  Eye,
  PlayCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Define types for the new tables
type AuthorJourneyPost = Database['public']['Tables']['authors_journey_posts']['Row'];
type WritingGuide = Database['public']['Tables']['writing_guides']['Row'];
type VideoTutorial = Database['public']['Tables']['video_tutorials']['Row'];
type DownloadableTemplate = Database['public']['Tables']['downloadable_templates']['Row'];
type ProfessionalService = Database['public']['Tables']['professional_services']['Row'];

type LearnSectionType = 'authors_journey' | 'educational_resources' | 'professional_services';
type EducationalResourceType = 'writing_guides' | 'video_tutorials' | 'downloadable_templates';
type SortOption = 'newest' | 'oldest' | 'popular' | 'title';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

const SECTION_TITLES = {
  authors_journey: "Author's Journey",
  educational_resources: 'Educational Resources',
  professional_services: 'Professional Services',
};

const EDUCATIONAL_RESOURCE_TITLES = {
  writing_guides: 'Writing Guides',
  video_tutorials: 'Video Tutorials',
  downloadable_templates: 'Downloadable Templates',
};

const DIFFICULTY_COLORS = {
  beginner: 'success',
  intermediate: 'warning', 
  advanced: 'danger'
} as const;

// Enhanced Content Card Component
const ContentCard = ({ 
  content, 
  type, 
  onClick 
}: { 
  content: any, 
  type: string, 
  onClick: () => void 
}) => {
  const getIcon = () => {
    switch(type) {
      case 'video_tutorials': return <Video className="w-8 h-8 text-blue-500" />;
      case 'downloadable_templates': return <Download className="w-8 h-8 text-green-500" />;
      case 'professional_services': return <DollarSign className="w-8 h-8 text-purple-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getDuration = () => {
    if (type === 'video_tutorials' && content.duration) {
      return `${content.duration} min`;
    }
    if (content.estimated_reading_time) {
      return `${content.estimated_reading_time} min read`;
    }
    return null;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        isPressable 
        onPress={onClick} 
        className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      >
        <CardBody className="p-6">
          {/* Header with icon and metadata */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div>
                {content.difficulty && (
                  <Chip 
                    size="sm" 
                    color={DIFFICULTY_COLORS[content.difficulty as keyof typeof DIFFICULTY_COLORS] || 'default'}
                    variant="flat"
                    className="mb-1"
                  >
                    {content.difficulty}
                  </Chip>
                )}
                {content.category && (
                  <Chip size="sm" variant="bordered" className="mb-1 ml-1">
                    {content.category}
                  </Chip>
                )}
              </div>
            </div>
            
            {/* Duration/Reading time */}
            {getDuration() && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {getDuration()}
              </div>
            )}
          </div>

          {/* Title and Description */}
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
            {content.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            {content.content ? 
              content.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
              content.description || 'No description available.'
            }
          </p>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              {content.author && (
                <div className="flex items-center space-x-2">
                  <Avatar size="sm" name={content.author} className="w-6 h-6" />
                  <span className="text-xs text-gray-500">{content.author}</span>
                </div>
              )}
              
              {type === 'professional_services' && content.price && (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-green-600">${content.price.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(content.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Progress indicator if applicable */}
          {content.completion_rate && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{content.completion_rate}%</span>
              </div>
              <Progress value={content.completion_rate} size="sm" />
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};

// Enhanced Learn Page Component
export default function LearnPageEnhanced() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<LearnSectionType>('authors_journey');
  const [activeEduTab, setActiveEduTab] = useState<EducationalResourceType>('writing_guides');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Data states
  const [authorsJourneyPosts, setAuthorsJourneyPosts] = useState<AuthorJourneyPost[]>([]);
  const [writingGuides, setWritingGuides] = useState<WritingGuide[]>([]);
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [downloadableTemplates, setDownloadableTemplates] = useState<DownloadableTemplate[]>([]);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all data with enhanced queries
      const [postsData, guidesData, videosData, templatesData, servicesData] = await Promise.all([
        supabase.from('authors_journey_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase.from('writing_guides')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase.from('video_tutorials')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase.from('downloadable_templates')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase.from('professional_services')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false })
      ]);

      if (postsData.error) throw postsData.error;
      if (guidesData.error) throw guidesData.error;
      if (videosData.error) throw videosData.error;
      if (templatesData.error) throw templatesData.error;
      if (servicesData.error) throw servicesData.error;

      setAuthorsJourneyPosts(postsData.data || []);
      setWritingGuides(guidesData.data || []);
      setVideoTutorials(videosData.data || []);
      setDownloadableTemplates(templatesData.data || []);
      setProfessionalServices(servicesData.data || []);

      // Extract categories for filtering
      const allCategories = new Set<string>();
      [...(guidesData.data || []), ...(videosData.data || []), ...(templatesData.data || [])]
        .forEach(item => {
          if (item.category) allCategories.add(item.category);
        });
      setCategories(Array.from(allCategories));

    } catch (error: any) {
      toast.error('Error fetching learn data: ' + error.message);
      console.error('Error fetching learn data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filtering and sorting logic
  const getFilteredAndSortedData = (data: any[], type: string) => {
    let filtered = [...data];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(item => item.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return (b.view_count || 0) - (a.view_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredAuthorsJourney = useMemo(() => 
    getFilteredAndSortedData(authorsJourneyPosts, 'authors_journey'), 
    [authorsJourneyPosts, searchQuery, sortBy, difficultyFilter, categoryFilter]
  );
  
  const filteredWritingGuides = useMemo(() => 
    getFilteredAndSortedData(writingGuides, 'writing_guides'), 
    [writingGuides, searchQuery, sortBy, difficultyFilter, categoryFilter]
  );
  
  const filteredVideoTutorials = useMemo(() => 
    getFilteredAndSortedData(videoTutorials, 'video_tutorials'), 
    [videoTutorials, searchQuery, sortBy, difficultyFilter, categoryFilter]
  );
  
  const filteredTemplates = useMemo(() => 
    getFilteredAndSortedData(downloadableTemplates, 'downloadable_templates'), 
    [downloadableTemplates, searchQuery, sortBy, difficultyFilter, categoryFilter]
  );
  
  const filteredServices = useMemo(() => 
    getFilteredAndSortedData(professionalServices, 'professional_services'), 
    [professionalServices, searchQuery, sortBy]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading content..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Learn & Grow
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Explore our comprehensive resources for writers, from beginner guides to advanced techniques
          </motion.p>
        </div>

        {/* Search and Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              variant="bordered"
              classNames={{
                input: "text-sm",
                inputWrapper: "h-12"
              }}
            />
            
            <Select
              placeholder="Sort by"
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as SortOption)}
              variant="bordered"
              classNames={{ trigger: "h-12" }}
            >
              <SelectItem key="newest">Newest First</SelectItem>
              <SelectItem key="oldest">Oldest First</SelectItem>
              <SelectItem key="title">Alphabetical</SelectItem>
              <SelectItem key="popular">Most Popular</SelectItem>
            </Select>
            
            <Select
              placeholder="Difficulty"
              selectedKeys={[difficultyFilter]}
              onSelectionChange={(keys) => setDifficultyFilter(Array.from(keys)[0] as DifficultyLevel)}
              variant="bordered"
              classNames={{ trigger: "h-12" }}
            >
              <SelectItem key="all">All Levels</SelectItem>
              <SelectItem key="beginner">Beginner</SelectItem>
              <SelectItem key="intermediate">Intermediate</SelectItem>
              <SelectItem key="advanced">Advanced</SelectItem>
            </Select>
            
            <Select
              placeholder="Category"
              selectedKeys={[categoryFilter]}
              onSelectionChange={(keys) => setCategoryFilter(Array.from(keys)[0] as string)}
              variant="bordered"
              classNames={{ trigger: "h-12" }}
            >
              <SelectItem key="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category}>{category}</SelectItem>
              ))}
            </Select>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs 
          selectedKey={activeMainTab}
          onSelectionChange={(key) => setActiveMainTab(key as LearnSectionType)}
          aria-label="Learn main sections"
          color="primary"
          variant="underlined"
          size="lg"
          classNames={{
            tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider justify-center mb-8",
            cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
            tab: "max-w-fit px-0 h-14 text-lg",
            tabContent: "group-data-[selected=true]:font-bold group-data-[selected=true]:text-blue-600"
          }}
        >
          {(Object.keys(SECTION_TITLES) as LearnSectionType[]).map((key) => (
            <Tab key={key} title={SECTION_TITLES[key]}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  {/* Content for each main tab */}
                  {key === 'authors_journey' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAuthorsJourney.length > 0 ? (
                        filteredAuthorsJourney.map((post) => (
                          <ContentCard 
                            key={post.id} 
                            content={post} 
                            type="authors_journey"
                            onClick={() => navigate(`/learn/authors-journey/${post.slug}`)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg">No author's journey posts match your criteria.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {key === 'educational_resources' && (
                    <Tabs 
                      selectedKey={activeEduTab}
                      onSelectionChange={(key) => setActiveEduTab(key as EducationalResourceType)}
                      aria-label="Educational resources sub-sections"
                      color="secondary"
                      variant="bordered"
                      classNames={{
                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider justify-center mb-6",
                        cursor: "w-full",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:font-semibold"
                      }}
                    >
                      {(Object.keys(EDUCATIONAL_RESOURCE_TITLES) as EducationalResourceType[]).map((eduKey) => (
                        <Tab key={eduKey} title={EDUCATIONAL_RESOURCE_TITLES[eduKey]}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eduKey === 'writing_guides' && filteredWritingGuides.map((guide) => (
                              <ContentCard 
                                key={guide.id} 
                                content={guide} 
                                type="writing_guides"
                                onClick={() => navigate(`/learn/writing-guides/${guide.slug}`)}
                              />
                            ))}
                            
                            {eduKey === 'video_tutorials' && filteredVideoTutorials.map((video) => (
                              <ContentCard 
                                key={video.id} 
                                content={video} 
                                type="video_tutorials"
                                onClick={() => window.open(video.video_url || '', '_blank')}
                              />
                            ))}
                            
                            {eduKey === 'downloadable_templates' && filteredTemplates.map((template) => (
                              <ContentCard 
                                key={template.id} 
                                content={template} 
                                type="downloadable_templates"
                                onClick={() => window.open(template.file_path || '', '_blank')}
                              />
                            ))}
                            
                            {/* Show empty state if no content */}
                            {((eduKey === 'writing_guides' && filteredWritingGuides.length === 0) ||
                              (eduKey === 'video_tutorials' && filteredVideoTutorials.length === 0) ||
                              (eduKey === 'downloadable_templates' && filteredTemplates.length === 0)) && (
                              <div className="col-span-full text-center py-12">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                  No {EDUCATIONAL_RESOURCE_TITLES[eduKey].toLowerCase()} match your criteria.
                                </p>
                              </div>
                            )}
                          </div>
                        </Tab>
                      ))}
                    </Tabs>
                  )}

                  {key === 'professional_services' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                          <ContentCard 
                            key={service.id} 
                            content={service} 
                            type="professional_services"
                            onClick={() => {}}
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg">No professional services match your criteria.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}