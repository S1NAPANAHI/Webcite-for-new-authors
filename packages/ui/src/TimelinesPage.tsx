import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Calendar, MapPin, Users, BookOpen, Sparkles, ArrowUp, Filter, Search, X, 
  ChevronDown, ChevronRight, Eye, Star, Zap, Crown, Sword, Scroll, Globe2,
  ImageIcon, Play, Pause, Volume2, VolumeX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { LoadingSkeleton } from './LoadingSkeleton';

// Enhanced Types with Hierarchical Structure
interface NestedTimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  };
  category?: 'political' | 'cultural' | 'technological' | 'religious' | 'military' | 'other';
  importance?: 'low' | 'medium' | 'high' | 'critical';
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  details?: string;
  date: string;
  background_image?: string;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  // New hierarchical structure
  nested_events?: NestedTimelineEvent[];
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  };
  category?: 'political' | 'cultural' | 'technological' | 'religious' | 'military' | 'other';
  importance?: 'low' | 'medium' | 'high' | 'critical';
  coordinates?: { x: number; y: number }; // For visual positioning
}

interface TimelineEventWithPosition extends TimelineEvent {
  year: number;
  era?: string;
}

// Enhanced Mock API with Hierarchical Data
const fetchTimelineEvents = async ({ includeUnpublished = false }) => {
  return {
    data: [
      {
        id: '1',
        title: 'The Great Reformation',
        description: 'A pivotal religious movement that reshaped European Christianity and society.',
        details: '<p>The Protestant Reformation fundamentally changed religious practices and political structures across Europe.</p>',
        date: '1517 CE',
        background_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        is_published: true,
        order: 0,
        category: 'religious',
        importance: 'critical',
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
        },
        nested_events: [
          {
            id: '1-1',
            title: 'Luther\'s 95 Theses',
            description: 'Martin Luther posts his famous theses on the church door.',
            date: 'October 31, 1517',
            category: 'religious',
            importance: 'critical',
            media: {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
            }
          },
          {
            id: '1-2', 
            title: 'Diet of Worms',
            description: 'Luther defends his teachings before the Holy Roman Emperor.',
            date: 'April 1521',
            category: 'political',
            importance: 'high'
          },
          {
            id: '1-3',
            title: 'Translation of the Bible',
            description: 'Luther translates the Bible into German.',
            date: '1522-1534',
            category: 'cultural',
            importance: 'critical'
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Discovery of the New World',
        description: 'Columbus\'s voyages open new trade routes and change global history.',
        details: '<p>The Age of Exploration brought together two worlds and initiated massive cultural exchange.</p>',
        date: '1492 CE',
        background_image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
        is_published: true,
        order: 1,
        category: 'cultural',
        importance: 'critical',
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800'
        },
        nested_events: [
          {
            id: '2-1',
            title: 'First Voyage Begins',
            description: 'Columbus departs from Spain with three ships.',
            date: 'August 3, 1492',
            category: 'cultural',
            importance: 'high'
          },
          {
            id: '2-2',
            title: 'Land Sighted',
            description: 'First glimpse of the Caribbean islands.',
            date: 'October 12, 1492',
            category: 'cultural',
            importance: 'critical'
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Fall of Constantinople',
        description: 'The end of the Byzantine Empire marks a new era in European history.',
        date: '1453 CE',
        is_published: true,
        order: 2,
        category: 'military',
        importance: 'critical',
        nested_events: [
          {
            id: '3-1',
            title: 'Siege Begins',
            description: 'Ottoman forces surround the city.',
            date: 'April 6, 1453',
            category: 'military',
            importance: 'high'
          },
          {
            id: '3-2',
            title: 'Final Assault',
            description: 'The city walls are breached.',
            date: 'May 29, 1453',
            category: 'military',
            importance: 'critical'
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ] as TimelineEvent[]
  };
};

const CATEGORY_COLORS = {
  political: 'from-red-500 to-red-600',
  cultural: 'from-purple-500 to-purple-600', 
  technological: 'from-blue-500 to-blue-600',
  religious: 'from-yellow-500 to-yellow-600',
  military: 'from-gray-500 to-gray-600',
  other: 'from-green-500 to-green-600'
};

const IMPORTANCE_ICONS = {
  low: Clock,
  medium: Star,
  high: Zap,
  critical: Crown
};

const CATEGORY_ICONS = {
  political: Crown,
  cultural: BookOpen,
  technological: Zap,
  religious: Scroll,
  military: Sword,
  other: Globe2
};

const parseEventYear = (dateString: string): number => {
  const rangeMatch = dateString.match(/(\d{4})-(\d{4})/);
  if (rangeMatch) {
    return parseInt(rangeMatch[1]);
  }
  
  const yearMatch = dateString.match(/(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    return dateString.includes('BCE') || dateString.includes('BC') ? -year : year;
  }
  return 0;
};

// Enhanced Nested Event Component
const NestedEventCard: React.FC<{ 
  event: NestedTimelineEvent; 
  index: number;
  parentCategory?: string;
}> = ({ event, index, parentCategory }) => {
  const Icon = CATEGORY_ICONS[event.category || 'other'];
  const ImportanceIcon = IMPORTANCE_ICONS[event.importance || 'medium'];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative mb-4 group"
    >
      {/* Connection line */}
      <div className={`absolute left-4 top-0 w-px h-full bg-gradient-to-b ${CATEGORY_COLORS[event.category || parentCategory || 'other']} opacity-60`} />
      
      {/* Event dot */}
      <div className={`absolute left-2 top-6 w-4 h-4 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[event.category || parentCategory || 'other']} shadow-lg flex items-center justify-center`}>
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
      
      {/* Event card */}
      <div className="ml-8 relative">
        <Card className="group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 bg-white/90 backdrop-blur-sm border border-gray-200/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900 text-sm">{event.title}</h4>
                  <ImportanceIcon className={`w-3 h-3 ${
                    event.importance === 'critical' ? 'text-red-500' :
                    event.importance === 'high' ? 'text-yellow-500' :
                    event.importance === 'medium' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                
                <Badge variant="outline" className="text-xs mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {event.date}
                </Badge>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {event.description}
                </p>
                
                {event.media && (
                  <div className="mt-3">
                    {event.media.type === 'image' && (
                      <img 
                        src={event.media.url} 
                        alt={event.title}
                        className="w-full h-20 object-cover rounded-md" 
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Enhanced Main Timeline Event Component
const TimelineEventCard: React.FC<{ 
  event: TimelineEventWithPosition; 
  index: number;
  onToggleNested: (eventId: string) => void;
  expandedNested: Set<string>;
}> = ({ event, index, onToggleNested, expandedNested }) => {
  const Icon = CATEGORY_ICONS[event.category || 'other'];
  const ImportanceIcon = IMPORTANCE_ICONS[event.importance || 'medium'];
  const isExpanded = expandedNested.has(event.id);
  const hasNested = event.nested_events && event.nested_events.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, type: 'spring', bounce: 0.3 }}
      className={`relative mb-12 ${index % 2 === 0 ? 'mr-auto pr-8 text-right' : 'ml-auto pl-8'} w-1/2 group`}
    >
      {/* Enhanced timeline connector dot */}
      <div 
        className={`absolute top-8 ${index % 2 === 0 ? '-right-4' : '-left-4'} w-8 h-8 rounded-full bg-gradient-to-br ${CATEGORY_COLORS[event.category || 'other']} shadow-xl border-4 border-white flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      
      {/* Importance indicator */}
      <div 
        className={`absolute top-6 ${index % 2 === 0 ? '-right-2' : '-left-2'} w-4 h-4 rounded-full bg-white shadow-lg flex items-center justify-center z-20`}
      >
        <ImportanceIcon className={`w-2 h-2 ${
          event.importance === 'critical' ? 'text-red-500' :
          event.importance === 'high' ? 'text-yellow-500' :
          event.importance === 'medium' ? 'text-blue-500' : 'text-gray-400'
        }`} />
      </div>
      
      {/* Event card with enhanced design */}
      <Card className="group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-3 bg-gradient-to-br from-white via-white to-gray-50/50 backdrop-blur-sm border border-gray-200/60 overflow-hidden">
        {/* Background media */}
        {event.media?.url && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={event.media.url} 
              alt={event.title}
              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" 
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${CATEGORY_COLORS[event.category || 'other']} opacity-60`} />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        
        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className={`text-xl font-bold bg-gradient-to-r ${CATEGORY_COLORS[event.category || 'other']} bg-clip-text text-transparent group-hover:scale-105 transition-transform origin-left duration-300`}>
                {event.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={`text-xs bg-gradient-to-r ${CATEGORY_COLORS[event.category || 'other']} text-white border-none shadow-sm`}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {event.date}
                </Badge>
                
                <Badge variant="secondary" className="text-xs capitalize">
                  {event.category || 'other'}
                </Badge>
                
                {hasNested && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {event.nested_events!.length} events
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${CATEGORY_COLORS[event.category || 'other']} shadow-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300`}>
                <Icon className="w-7 h-7" />
              </div>
              
              {hasNested && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleNested(event.id)}
                  className="p-1 h-8 w-8 rounded-full hover:bg-gray-100"
                >
                  {isExpanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            {event.details && (
              <Button variant="outline" size="sm" className="group/btn">
                <BookOpen className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                Read More
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Public</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Nested events */}
      <AnimatePresence>
        {hasNested && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="mt-6 overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200/60">
                <Sparkles className="w-4 h-4 text-gray-500" />
                <h4 className="font-semibold text-gray-700">Related Events</h4>
              </div>
              
              <div className="space-y-2">
                {event.nested_events!.map((nestedEvent, nestedIndex) => (
                  <NestedEventCard 
                    key={nestedEvent.id} 
                    event={nestedEvent} 
                    index={nestedIndex}
                    parentCategory={event.category}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Era Section Component
const TimelineEraSection: React.FC<{ 
  era: string; 
  events: TimelineEventWithPosition[];
  onToggleNested: (eventId: string) => void;
  expandedNested: Set<string>;
}> = ({ era, events, onToggleNested, expandedNested }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate era statistics
  const totalNestedEvents = events.reduce((sum, event) => sum + (event.nested_events?.length || 0), 0);
  const criticalEvents = events.filter(event => event.importance === 'critical').length;
  
  return (
    <div className="mb-16">
      {/* Era Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-between p-8 h-auto bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/30 hover:border-indigo-300/60 backdrop-blur-sm group hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {era}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                  {events.length} events
                </Badge>
                {totalNestedEvents > 0 && (
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    +{totalNestedEvents} sub-events
                  </Badge>
                )}
                {criticalEvents > 0 && (
                  <Badge variant="outline" className="border-red-200 text-red-700">
                    <Crown className="w-3 h-3 mr-1" />
                    {criticalEvents} critical
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform duration-300 text-indigo-600 ${isCollapsed ? '-rotate-90' : ''}`} />
        </Button>
      </motion.div>
      
      {/* Era Timeline */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="relative">
              {/* Enhanced central timeline line with gradient */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full shadow-lg" />
              
              {/* Animated timeline dots */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full -top-1 shadow-lg animate-pulse" />
              
              {events.map((event, index) => (
                <TimelineEventCard 
                  key={event.id} 
                  event={event} 
                  index={index}
                  onToggleNested={onToggleNested}
                  expandedNested={expandedNested}
                />
              ))}
              
              {/* End dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full -bottom-1 shadow-lg animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Scroll to Top Component
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl z-50 hover:shadow-indigo-500/25 transition-all duration-300 backdrop-blur-sm border border-white/20"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main Enhanced Timeline Page Component
export const TimelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedNested, setExpandedNested] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ['timelineEvents', { includeUnpublished: false }],
    queryFn: () => fetchTimelineEvents({ includeUnpublished: false }),
  });
  
  const processedEvents = useMemo(() => {
    if (!timelineData?.data) return [];
    
    return timelineData.data
      .filter(event => event.is_published)
      .map(event => ({
        ...event,
        year: parseEventYear(event.date),
        era: (() => {
          const year = parseEventYear(event.date);
          if (year < 0 || event.date.includes('BC')) return 'Ancient Era';
          if (year < 1000) return 'Classical Era';
          if (year < 1500) return 'Medieval Era';
          if (year < 1800) return 'Renaissance Era';
          if (year < 1900) return 'Industrial Era';
          if (year < 2000) return 'Modern Era';
          return 'Contemporary Era';
        })()
      } as TimelineEventWithPosition))
      .sort((a, b) => sortOrder === 'asc' ? a.year - b.year : b.year - a.year);
  }, [timelineData, sortOrder]);
  
  const filteredEvents = useMemo(() => {
    return processedEvents.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.nested_events && event.nested_events.some(nested => 
          nested.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nested.description.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [processedEvents, searchTerm, selectedCategory]);
  
  const eventsByEra = useMemo(() => {
    const grouped = filteredEvents.reduce((acc, event) => {
      const era = event.era || 'Unknown Era';
      if (!acc[era]) acc[era] = [];
      acc[era].push(event);
      return acc;
    }, {} as Record<string, TimelineEventWithPosition[]>);
    
    const eraOrder = ['Ancient Era', 'Classical Era', 'Medieval Era', 'Renaissance Era', 'Industrial Era', 'Modern Era', 'Contemporary Era'];
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
      const indexA = eraOrder.indexOf(a);
      const indexB = eraOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return sortOrder === 'asc' ? indexA - indexB : indexB - indexA;
    });
    
    return Object.fromEntries(sortedEntries);
  }, [filteredEvents, sortOrder]);
  
  const handleToggleNested = (eventId: string) => {
    const newExpanded = new Set(expandedNested);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedNested(newExpanded);
  };
  
  // Calculate statistics
  const totalEvents = processedEvents.length;
  const totalNestedEvents = processedEvents.reduce((sum, event) => sum + (event.nested_events?.length || 0), 0);
  const publishedEvents = processedEvents.filter(event => event.is_published).length;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <LoadingSkeleton className="h-16 w-96 mx-auto mb-4 rounded-xl" />
            <LoadingSkeleton className="h-8 w-128 mx-auto rounded-lg" />
          </div>
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-8">
                <LoadingSkeleton className="h-20 w-full rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <LoadingSkeleton className="h-64 rounded-xl" />
                  <LoadingSkeleton className="h-64 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Timeline Unavailable</h1>
          <p className="text-gray-600 mb-6">
            We're experiencing technical difficulties loading the timeline. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-b border-indigo-200/30 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-6xl font-bold text-white">
                Zoroasterverse Timeline
              </h1>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <p className="text-xl text-indigo-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Journey through the interconnected tapestry of history. Explore pivotal moments, 
              discover hidden connections, and witness the unfolding of civilizations through 
              an immersive, hierarchical timeline experience.
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Clock, label: 'Main Events', value: totalEvents },
                { icon: Sparkles, label: 'Sub Events', value: totalNestedEvents },
                { icon: MapPin, label: 'Eras Covered', value: Object.keys(eventsByEra).length },
                { icon: Eye, label: 'Published', value: publishedEvents }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-indigo-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced Controls */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Enhanced Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search events & sub-events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/80 backdrop-blur-sm border-gray-200/60 focus:border-indigo-300 rounded-xl"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {/* Enhanced Category Filter */}
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200/60 rounded-xl bg-white/80 backdrop-blur-sm focus:border-indigo-300 focus:outline-none h-12 min-w-48"
              >
                <option value="all">All Categories</option>
                <option value="political">👑 Political</option>
                <option value="cultural">📚 Cultural</option>
                <option value="technological">⚡ Technological</option>
                <option value="religious">📜 Religious</option>
                <option value="military">⚔️ Military</option>
                <option value="other">🌍 Other</option>
              </select>
            </div>
            
            {/* Enhanced Sort Order */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 h-12 px-6 bg-white/80 backdrop-blur-sm border-gray-200/60 hover:border-indigo-300 rounded-xl"
              >
                <Clock className="w-4 h-4" />
                {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              </Button>
              
              <Button
                variant={isPlaying ? 'default' : 'outline'}
                onClick={() => setIsPlaying(!isPlaying)}
                className={`h-12 w-12 p-0 rounded-xl ${isPlaying ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-white/80 backdrop-blur-sm border-gray-200/60 hover:border-indigo-300'}`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Timeline Content */}
      <div className="container mx-auto px-4 py-12">
        {Object.keys(eventsByEra).length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">No Events Found</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                No timeline events match your current filters. Try adjusting your search or category selection to explore more content.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl px-8 py-3"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {Object.entries(eventsByEra).map(([era, events]) => (
              <TimelineEraSection 
                key={era} 
                era={era} 
                events={events}
                onToggleNested={handleToggleNested}
                expandedNested={expandedNested}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};