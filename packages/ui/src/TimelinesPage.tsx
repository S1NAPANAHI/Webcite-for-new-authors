import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, Users, BookOpen, Sparkles, ArrowUp, Filter, Search, X, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { LoadingSkeleton } from './LoadingSkeleton';

// Types
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
}

interface TimelineEventWithPosition extends TimelineEvent {
  year: number;
  era?: string;
  category?: 'political' | 'cultural' | 'technological' | 'religious' | 'military' | 'other';
}

// Mock API function - replace with actual implementation
const fetchTimelineEvents = async ({ includeUnpublished = false }) => {
  // This is a mock - replace with actual API call
  return {
    data: [
      {
        id: '1',
        title: 'The Great Reformation',
        description: 'A pivotal moment in religious history that reshaped the spiritual landscape of Europe and beyond.',
        details: '<p>The Protestant Reformation was a major movement within Western Christianity that posed a religious and political challenge to the Catholic Church.</p>',
        date: '1517 CE',
        background_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        is_published: true,
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Discovery of the New World',
        description: 'Columbus arrives in the Americas, opening a new chapter in human history and global exploration.',
        details: '<p>Christopher Columbus completed four round-trip voyages between Spain and the Americas, each voyage being sponsored by the Crown of Castile.</p>',
        date: '1492 CE',
        background_image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
        is_published: true,
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Fall of Constantinople',
        description: 'The capture of Constantinople by the Ottoman Empire marked the end of the Byzantine Empire.',
        details: '<p>The fall of Constantinople was the capture of the capital of the Byzantine Empire by the Ottoman Empire.</p>',
        date: '1453 CE',
        is_published: true,
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        title: 'The Black Death',
        description: 'A devastating pandemic that swept across Europe, fundamentally changing society.',
        date: '1347-1351 CE',
        is_published: true,
        order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Founding of Rome',
        description: 'According to legend, the city of Rome was founded by Romulus and Remus.',
        date: '753 BCE',
        is_published: true,
        order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ] as TimelineEvent[]
  };
};

const CATEGORY_COLORS = {
  political: 'bg-red-500',
  cultural: 'bg-purple-500', 
  technological: 'bg-blue-500',
  religious: 'bg-yellow-500',
  military: 'bg-gray-500',
  other: 'bg-green-500'
};

const CATEGORY_LABELS = {
  political: 'Political',
  cultural: 'Cultural', 
  technological: 'Technological',
  religious: 'Religious',
  military: 'Military',
  other: 'Other'
};

const parseEventYear = (dateString: string): number => {
  // Handle ranges like "1347-1351 CE"
  const rangeMatch = dateString.match(/(\d{4})-(\d{4})/);
  if (rangeMatch) {
    return parseInt(rangeMatch[1]);
  }
  
  // Try to extract year from various date formats
  const yearMatch = dateString.match(/(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    // Handle BCE dates
    return dateString.includes('BCE') || dateString.includes('BC') ? -year : year;
  }
  return 0;
};

const categorizeEvent = (event: TimelineEvent): TimelineEventWithPosition['category'] => {
  const title = event.title.toLowerCase();
  const description = event.description.toLowerCase();
  const text = `${title} ${description}`;
  
  if (text.includes('war') || text.includes('battle') || text.includes('conquest') || text.includes('fall')) return 'military';
  if (text.includes('king') || text.includes('emperor') || text.includes('dynasty') || text.includes('empire')) return 'political';
  if (text.includes('temple') || text.includes('religion') || text.includes('god') || text.includes('reformation') || text.includes('church')) return 'religious';
  if (text.includes('culture') || text.includes('art') || text.includes('literature') || text.includes('discovery')) return 'cultural';
  if (text.includes('invention') || text.includes('discovery') || text.includes('technology')) return 'technological';
  
  return 'other';
};

const TimelineEventCard: React.FC<{ event: TimelineEventWithPosition; index: number }> = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative mb-8 ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'} w-1/2`}
    >
      {/* Timeline connector dot */}
      <div 
        className={`absolute top-6 ${index % 2 === 0 ? '-right-3' : '-left-3'} w-6 h-6 rounded-full border-4 border-background ${CATEGORY_COLORS[event.category || 'other']}`}
      />
      
      {/* Event card */}
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-card/95 backdrop-blur-sm border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {event.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {event.date}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs text-white ${CATEGORY_COLORS[event.category || 'other']}`}
                >
                  {CATEGORY_LABELS[event.category || 'other']}
                </Badge>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full ${CATEGORY_COLORS[event.category || 'other']} flex items-center justify-center text-white flex-shrink-0`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {event.description}
          </p>
          
          {event.details && (
            <Button variant="outline" size="sm" className="group">
              <BookOpen className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Read More
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TimelineEraSection: React.FC<{ era: string; events: TimelineEventWithPosition[] }> = ({ era, events }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="mb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-between p-6 h-auto bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:bg-primary/20"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">{era}</h2>
            <Badge variant="secondary" className="ml-2">{events.length} events</Badge>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {/* Central timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary/50 to-secondary/50 h-full rounded-full" />
              
              {events.map((event, index) => (
                <TimelineEventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg z-50 hover:shadow-xl transition-shadow"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export const TimelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
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
        category: categorizeEvent(event),
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
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
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
    
    // Sort eras chronologically
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <LoadingSkeleton className="h-12 w-64 mx-auto mb-4" />
          <LoadingSkeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-6">
              <LoadingSkeleton className="h-16 w-full" />
              <div className="space-y-4">
                {[...Array(2)].map((_, j) => (
                  <LoadingSkeleton key={j} className="h-32 w-1/2 mx-auto" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-destructive mb-4">Timeline Unavailable</h1>
          <p className="text-muted-foreground mb-6">
            We're experiencing technical difficulties loading the timeline. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Zoroasterverse Timeline
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Journey through the ages and discover the pivotal moments that shaped our world. 
              From ancient civilizations to modern breakthroughs, explore the interconnected tapestry of history.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{processedEvents.length} Events</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{Object.keys(eventsByEra).length} Eras</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Interactive Experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {/* Category Filter */}
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Timeline Content */}
      <div className="container mx-auto px-4 py-8">
        {Object.keys(eventsByEra).length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-6">
                No timeline events match your current filters. Try adjusting your search or category selection.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {Object.entries(eventsByEra).map(([era, events]) => (
              <TimelineEraSection key={era} era={era} events={events} />
            ))}
          </motion.div>
        )}
      </div>
      
      <ScrollToTopButton />
    </div>
  );
};