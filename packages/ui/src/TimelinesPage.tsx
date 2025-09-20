import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  X, 
  Crown,
  Sword,
  BookOpen,
  Sparkles,
  Star,
  Globe2,
  Flame,
  Scroll,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { LoadingSkeleton } from './LoadingSkeleton';
import { supabase } from '@zoroaster/shared/lib/supabase';

// Types
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
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  background_color: string;
  events: TimelineEvent[];
}

// API Functions
const fetchPublicTimelineEvents = async (): Promise<{ data: Era[] }> => {
  try {
    // Fetch eras and published events in parallel
    const [erasResult, eventsResult] = await Promise.all([
      supabase.from('timeline_eras').select('*').eq('is_active', true).order('order_index'),
      supabase.from('timeline_events').select('*').eq('is_published', true).order('era').order('order_index')
    ]);

    if (erasResult.error) throw erasResult.error;
    if (eventsResult.error) throw eventsResult.error;

    const eras = erasResult.data || [];
    const events = eventsResult.data || [];

    // Build hierarchy
    const eventMap = new Map<string, TimelineEvent>();
    const rootEvents: TimelineEvent[] = [];

    // Create event objects
    events.forEach(event => {
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

    // Build parent-child relationships
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

    // Group by era
    const erasWithEvents: Era[] = eras.map(era => ({
      id: era.id,
      name: era.name,
      start_date: era.start_date || '',
      end_date: era.end_date || '',
      description: era.description || '',
      background_color: era.background_color || '#6b58c4',
      events: rootEvents.filter(event => event.era === era.name)
    })).filter(era => era.events.length > 0);

    return { data: erasWithEvents };
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return { data: [] };
  }
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

// Event Component
const TimelineEventComponent: React.FC<{ 
  event: TimelineEvent; 
  depth: number;
}> = ({ event, depth }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const hasChildren = event.children && event.children.length > 0;
  const Icon = CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] || Sparkles;

  return (
    <div className="relative" style={{ paddingLeft: `${depth * 24}px` }}>
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0 mt-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md" />
          {depth === 0 && <div className="absolute top-4 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2" />}
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
            </div>
            <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
              {event.date}
            </Badge>
          </div>
          
          <p className="text-gray-700 mb-2">{event.description}</p>
          
          {event.details && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded p-3 border-l-2 border-blue-200">
              {event.details}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <Badge variant="secondary" className="text-xs">
              {event.category}
            </Badge>
            
            {hasChildren && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                {event.children!.length} related events
              </button>
            )}
          </div>
        </div>
      </div>

      {hasChildren && isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {event.children!.map((child) => (
              <TimelineEventComponent key={child.id} event={child} depth={depth + 1} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// Era Component
const EraSection: React.FC<{ era: Era; position: number }> = ({ era, position }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: position * 0.1 }}
        className="bg-white rounded-lg shadow-md border-l-4 overflow-hidden"
        style={{ borderLeftColor: era.background_color }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{era.name}</h2>
              <p className="text-gray-600 font-medium mb-2">
                {era.start_date} — {era.end_date}
              </p>
              <p className="text-gray-700">{era.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-gray-500">
                  {era.events.length} events
                </span>
                <span className="text-sm text-gray-500">
                  {era.events.reduce((sum, event) => sum + (event.children?.length || 0), 0)} related events
                </span>
              </div>
            </div>
            
            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-gray-50/50 p-6"
            >
              {era.events.length > 0 ? (
                <div className="space-y-6">
                  {era.events.map((event) => (
                    <TimelineEventComponent key={event.id} event={event} depth={0} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No events in this era</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// Main Timeline Component
export const TimelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: timelineData, isLoading, error, refetch } = useQuery({
    queryKey: ['public-timeline-events'],
    queryFn: fetchPublicTimelineEvents,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  const filteredEras = useMemo(() => {
    if (!timelineData?.data) return [];
    
    if (!searchTerm && selectedCategory === 'all') return timelineData.data;
    
    return timelineData.data.map(era => ({
      ...era,
      events: era.events.filter(event => {
        const matchesSearch = searchTerm === '' || 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
    })).filter(era => era.events.length > 0);
  }, [timelineData, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <LoadingSkeleton className="h-10 w-48 mx-auto mb-4" />
            <LoadingSkeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <LoadingSkeleton className="h-24 w-full mb-4" />
                <div className="ml-8 space-y-3">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <LoadingSkeleton key={j} className="h-16 w-3/4" />
                  ))}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Timeline Unavailable</h1>
          <p className="text-gray-600 mb-6">
            Unable to load timeline events. Please try again.
          </p>
          <Button onClick={() => refetch()} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Timeline</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the key events and eras that shaped our world.
            </p>
          </motion.div>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all" className="text-gray-900">All Categories</option>
            <option value="Political" className="text-gray-900">Political</option>
            <option value="Religious" className="text-gray-900">Religious</option>
            <option value="Military" className="text-gray-900">Military</option>
            <option value="Cultural" className="text-gray-900">Cultural</option>
            <option value="Magical" className="text-gray-900">Magical</option>
            <option value="Technological" className="text-gray-900">Technological</option>
            <option value="Natural" className="text-gray-900">Natural</option>
            <option value="Other" className="text-gray-900">Other</option>
          </select>
        </div>

        {/* Timeline Content */}
        <main>
          {filteredEras.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No events match your current search or filter criteria.' 
                  : 'No timeline events have been published yet.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredEras.map((era, idx) => (
                <EraSection key={era.id} era={era} position={idx} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};