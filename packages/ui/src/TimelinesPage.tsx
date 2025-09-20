import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  X, 
  Calendar,
  Scroll,
  Crown,
  Sword,
  BookOpen,
  Sparkles,
  Eye,
  Clock,
  Star,
  Globe2,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { LoadingSkeleton } from './LoadingSkeleton';
import './styles/fantasy-timeline.css';

// Import supabase using ES6 import syntax
import { supabase } from '@zoroaster/shared/lib/supabase';

// Enhanced Types with Nested Structure
interface NestedEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  children?: NestedEvent[];
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  details?: string;
  era: string;
  category: string;
  background_image?: string;
  is_published: boolean;
  order_index: number;
  parent_event_id?: string;
  depth: number;
  children?: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

interface Era {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  events: TimelineEvent[];
}

// Real Supabase API Functions (Public - Only Published Events)
const fetchPublicTimelineEvents = async (): Promise<{ data: Era[] }> => {
  try {
    // Only fetch published events for public view
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('is_published', true)
      .order('era', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      // Return fallback data if database fails
      return { data: getFallbackData() };
    }

    if (!data || data.length === 0) {
      // Return sample data if no events exist yet
      return { data: getFallbackData() };
    }

    // Group events by era and build hierarchy
    const eventsByEra = new Map<string, TimelineEvent[]>();
    const eventMap = new Map<string, TimelineEvent>();

    // First pass: create all event objects
    data.forEach(event => {
      const timelineEvent: TimelineEvent = {
        id: event.id,
        title: event.title,
        date: event.date,
        description: event.description || '',
        details: event.details,
        era: event.era,
        category: event.category || 'Other',
        background_image: event.background_image,
        is_published: event.is_published,
        order_index: event.order_index || 0,
        parent_event_id: event.parent_event_id,
        depth: event.depth || 0,
        children: [],
        created_at: event.created_at,
        updated_at: event.updated_at
      };
      eventMap.set(event.id, timelineEvent);
    });

    // Second pass: build parent-child relationships
    const rootEvents: TimelineEvent[] = [];
    eventMap.forEach(event => {
      if (event.parent_event_id) {
        const parent = eventMap.get(event.parent_event_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(event);
        }
      } else {
        rootEvents.push(event);
      }
    });

    // Group root events by era
    rootEvents.forEach(event => {
      if (!eventsByEra.has(event.era)) {
        eventsByEra.set(event.era, []);
      }
      eventsByEra.get(event.era)!.push(event);
    });

    // Convert to Era format with descriptions
    const eras: Era[] = Array.from(eventsByEra.entries()).map(([eraName, events]) => ({
      id: eraName.toLowerCase().replace(/\s+/g, '-'),
      title: eraName,
      start: events.length > 0 ? events[0].date : 'Unknown',
      end: events.length > 0 ? events[events.length - 1].date : 'Unknown',
      description: getEraDescription(eraName),
      events: events.sort((a, b) => a.order_index - b.order_index)
    }));

    return { data: eras };
  } catch (error) {
    console.error('Error fetching timeline events:', error);
    // Return fallback data on any error
    return { data: getFallbackData() };
  }
};

// Fallback data for when database is unavailable or empty
const getFallbackData = (): Era[] => [
  {
    id: "age-of-flame",
    title: "Age of Flame",
    start: "Dawn of Time",
    end: "Year 1247",
    description: "When Ahura Mazda first kindled the Sacred Fires and light pierced the primordial darkness. The first temples rose, and prophets walked among mortals.",
    events: [
      {
        id: "af-1",
        title: "The First Sacred Fire",
        date: "Dawn of Time",
        description: "Ahura Mazda kindles the eternal flame that shall never be extinguished.",
        era: "Age of Flame",
        category: "Magical",
        is_published: true,
        order_index: 0,
        depth: 0,
        children: [
          {
            id: "af-1-1",
            title: "Gathering of the Magi",
            date: "First Dawn + 7 Days",
            description: "Seven wise men witness the divine flame and become its first guardians.",
            era: "Age of Flame",
            category: "Religious",
            is_published: true,
            order_index: 1,
            parent_event_id: "af-1",
            depth: 1,
            children: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
];

const getEraDescription = (eraName: string): string => {
  const descriptions: Record<string, string> = {
    'The First Age': 'The age of creation and the first civilizations in the Zoroasterverse.',
    'Golden Age': 'An era of prosperity, peace, and magical advancement.',
    'The Dark Times': 'A period of chaos, war, and the falling of the ancient ways.',
    'Second Dawn': 'The age of rebuilding and new hope.',
    'Age of Flame': 'When Ahura Mazda first kindled the Sacred Fires and light pierced the primordial darkness.',
    'The Shadow Wars': 'When darkness crept across the lands and the Sacred Fires flickered.',
    'Dawn of the Second Sun': 'The age of renewal, when the Sacred Fires burn brighter than ever.'
  };
  return descriptions[eraName] || 'A significant period in the history of the Zoroasterverse.';
};

const CATEGORY_ICONS = {
  Political: Crown,
  Religious: Scroll,
  Military: Sword,
  Cultural: BookOpen,
  Magical: Flame,
  Technological: Star,
  Natural: Globe2,
  Other: Sparkles
};

// Fantasy Event Component
const FantasyEvent: React.FC<{ 
  event: TimelineEvent; 
  depth: number;
}> = ({ event, depth }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const hasChildren = event.children && event.children.length > 0;
  const Icon = CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] || Sparkles;

  return (
    <div className="event" style={{ '--depth': depth } as React.CSSProperties}>
      <div className="event-row">
        <span className="event-connector" aria-hidden="true" />
        
        <div className="event-node">
          <div className="relative">
            <div className="relative w-3 h-3 bg-gradient-to-br from-purple-400 to-yellow-500 rounded-full border border-white/30">
              <div className="absolute inset-0.5 bg-white/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="event-content">
          <div className="event-head">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-yellow-400" />
              <h3 className="event-title">{event.title}</h3>
            </div>
            {event.date && (
              <Badge variant="outline" className="event-date bg-black/20 border-white/10 text-gray-300">
                {event.date}
              </Badge>
            )}
          </div>
          
          <p className="event-blurb">{event.description}</p>
          
          {event.details && (
            <div className="mt-3 text-sm text-purple-200 bg-black/10 rounded p-3 border-l-2 border-purple-500/30">
              {event.details}
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-300 text-xs">
              {event.category}
            </Badge>
          </div>
          
          {hasChildren && (
            <button
              className="event-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              {isOpen ? 'Hide tales' : `Show ${event.children!.length} tales`}
            </button>
          )}
        </div>
      </div>

      {hasChildren && isOpen && (
        <AnimatePresence>
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="event-children"
          >
            {event.children!.map((child) => (
              <li key={child.id}>
                <FantasyEvent event={child} depth={depth + 1} />
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>
      )}
    </div>
  );
};

// Fantasy Era Component  
const FantasyEra: React.FC<{ era: Era; position: number }> = ({ era, position }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <section className="era" aria-labelledby={`${era.id}-title`}>
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: position * 0.2 }}
        className="era-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${era.id}-panel`}
      >
        <span className="era-marker" />
        
        <div className="era-text">
          <h2 id={`${era.id}-title`} className="era-title">
            {era.title}
          </h2>
          <p className="era-meta">
            {era.start} — {era.end}
          </p>
          {era.description && (
            <p className="era-desc">{era.description}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="bg-black/20 border-white/10 text-gray-300 text-xs">
              <Scroll className="w-3 h-3 mr-1" />
              {era.events.length} chronicles
            </Badge>
            <Badge variant="outline" className="bg-black/20 border-yellow-500/20 text-yellow-300 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {era.events.reduce((sum, event) => sum + (event.children?.length || 0), 0)} tales
            </Badge>
          </div>
        </div>
        
        <span className="chevron">
          <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            id={`${era.id}-panel`} 
            className="era-panel"
            hidden={!isOpen}
          >
            {era.events?.length ? (
              <ol className="event-list">
                {era.events.map((event) => (
                  <li key={event.id}>
                    <FantasyEvent event={event} depth={0} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">The scribes have recorded no events from this age...</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Main Timeline Component
export const TimelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Real database query with error handling
  const { data: timelineData, isLoading, error } = useQuery({
    queryKey: ['publicTimelineEvents'],
    queryFn: fetchPublicTimelineEvents,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests
    retryDelay: 1000, // 1 second delay between retries
  });

  const filteredEras = useMemo(() => {
    if (!timelineData?.data) return [];
    
    if (!searchTerm && selectedCategory === 'all') return timelineData.data;
    
    return timelineData.data.map(era => ({
      ...era,
      events: era.events.filter(event => {
        const matchesSearch = searchTerm === '' || 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.children && event.children.some(child => 
            child.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.description.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
    })).filter(era => era.events.length > 0);
  }, [timelineData, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="page">
        <header className="page-header">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-4xl">Loading Chronicles...</h1>
          </div>
          <p className="subtitle">The ancient scrolls are being prepared for thy viewing...</p>
        </header>
        <main>
          <div className="timeline">
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <LoadingSkeleton className="h-20 w-full mb-4" />
                  <div className="ml-12 space-y-3">
                    {[...Array(2)].map((_, j) => (
                      <LoadingSkeleton key={j} className="h-16 w-3/4" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">The Chronicles Are Sealed</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            The ancient scrolls are temporarily sealed by mystical forces. 
            Fear not - the fallback chronicles shall appear shortly...
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border border-red-400/30"
          >
            <Flame className="w-4 h-4 mr-2" />
            Rekindle the Sacred Fires
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Mystical Header */}
      <header className="page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Flame className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <h1>Chronicle of Ages</h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
          <p className="subtitle">
            Wherein the great deeds of mortals and immortals are set down for posterity, 
            that none may forget the turning of the ages.
          </p>
        </motion.div>
      </header>

      {/* Mystical Controls */}
      <div className="controls-section">
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
          {/* Enchanted Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
            <Input
              placeholder="Search the chronicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-12 bg-black/40 border-purple-500/30 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/50"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-purple-400 hover:text-white hover:bg-purple-500/20"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400/50"
          >
            <option value="all">All Chronicles</option>
            <option value="Magical">🔥 Magical</option>
            <option value="Religious">📜 Religious</option>
            <option value="Political">👑 Political</option>
            <option value="Military">⚔️ Military</option>
            <option value="Cultural">📚 Cultural</option>
            <option value="Technological">⭐ Technological</option>
            <option value="Natural">🌍 Natural</option>
            <option value="Other">✨ Other</option>
          </select>
        </div>
      </div>

      {/* Timeline Content */}
      <main>
        {filteredEras.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Chronicles Found</h3>
              <p className="text-gray-400 mb-8">
                The scribes have found no records matching thy search. Perhaps try different terms, 
                or clear the filters to see all recorded history.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border border-purple-400/30"
              >
                <X className="w-4 h-4 mr-2" />
                Clear the Binding Runes
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="timeline">
            <div className="timeline-rail" aria-hidden="true" />
            <ol className="era-list">
              {filteredEras.map((era, idx) => (
                <li key={era.id} className="era-item">
                  <FantasyEra era={era} position={idx} />
                </li>
              ))}
            </ol>
          </div>
        )}
      </main>
    </div>
  );
};