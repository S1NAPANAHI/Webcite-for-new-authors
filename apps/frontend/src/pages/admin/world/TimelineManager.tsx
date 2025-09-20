import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  ChevronDown,
  Calendar, 
  Clock, 
  Flame,
  Scroll,
  Crown,
  Sword,
  BookOpen,
  Sparkles,
  Star,
  Globe2,
  AlertCircle,
  CheckCircle2,
  X,
  Save
} from 'lucide-react';

// Import supabase using proper ES6 import
import { supabase } from '@zoroaster/shared/lib/supabase';

// Enhanced Types with Nested Structure
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

interface CreateTimelineEventDto {
  title: string;
  date: string;
  description: string;
  details?: string;
  era: string;
  category: string;
  background_image?: string;
  is_published: boolean;
  parent_event_id?: string;
  depth?: number;
}

// Real Supabase API Functions
const fetchTimelineEvents = async (): Promise<{ data: Era[] }> => {
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .order('era', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return { data: getFallbackAdminData() };
    }

    if (!data || data.length === 0) {
      return { data: getFallbackAdminData() };
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

    // Convert to Era format
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
    return { data: getFallbackAdminData() };
  }
};

const getFallbackAdminData = (): Era[] => [
  {
    id: "age-of-flame",
    title: "Age of Flame",
    start: "Dawn of Time",
    end: "Year 1247",
    description: "When Ahura Mazda first kindled the Sacred Fires and light pierced the primordial darkness.",
    events: [
      {
        id: "sample-event-1",
        title: "The First Sacred Fire",
        date: "Dawn of Time",
        description: "Ahura Mazda kindles the eternal flame that shall never be extinguished. This is sample data - connect to your database to see real events.",
        era: "Age of Flame",
        category: "Magical",
        is_published: true,
        order_index: 0,
        depth: 0,
        children: [],
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

const createTimelineEvent = async (eventData: CreateTimelineEventDto): Promise<TimelineEvent> => {
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .insert([
        {
          title: eventData.title,
          date: eventData.date,
          description: eventData.description,
          details: eventData.details,
          era: eventData.era,
          category: eventData.category,
          background_image: eventData.background_image,
          is_published: eventData.is_published,
          parent_event_id: eventData.parent_event_id,
          depth: eventData.depth || 0,
          order_index: Date.now() // Simple ordering for now
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      date: data.date,
      description: data.description || '',
      details: data.details,
      era: data.era,
      category: data.category || 'Other',
      background_image: data.background_image,
      is_published: data.is_published,
      order_index: data.order_index,
      parent_event_id: data.parent_event_id,
      depth: data.depth || 0,
      children: [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error creating timeline event:', error);
    throw error;
  }
};

const updateTimelineEvent = async (id: string, eventData: Partial<CreateTimelineEventDto>): Promise<TimelineEvent> => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Only update fields that are provided
    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.date !== undefined) updateData.date = eventData.date;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.details !== undefined) updateData.details = eventData.details;
    if (eventData.era !== undefined) updateData.era = eventData.era;
    if (eventData.category !== undefined) updateData.category = eventData.category;
    if (eventData.background_image !== undefined) updateData.background_image = eventData.background_image;
    if (eventData.is_published !== undefined) updateData.is_published = eventData.is_published;

    const { data, error } = await supabase
      .from('timeline_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      date: data.date,
      description: data.description || '',
      details: data.details,
      era: data.era,
      category: data.category || 'Other',
      background_image: data.background_image,
      is_published: data.is_published,
      order_index: data.order_index,
      parent_event_id: data.parent_event_id,
      depth: data.depth || 0,
      children: [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error updating timeline event:', error);
    throw error;
  }
};

const deleteTimelineEvent = async (id: string): Promise<void> => {
  try {
    // Cascade delete is handled by database constraints
    const { error } = await supabase
      .from('timeline_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    throw error;
  }
};

const toggleTimelineEventPublishStatus = async (id: string): Promise<void> => {
  try {
    // Get current status
    const { data: current, error: fetchError } = await supabase
      .from('timeline_events')
      .select('is_published')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Toggle status
    const { error } = await supabase
      .from('timeline_events')
      .update({ 
        is_published: !current.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error toggling publish status:', error);
    throw error;
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

const AVAILABLE_ERAS = [
  'The First Age',
  'Golden Age', 
  'The Dark Times',
  'Second Dawn',
  'Age of Flame',
  'The Shadow Wars',
  'Dawn of the Second Sun'
];

const AVAILABLE_CATEGORIES = [
  'Political',
  'Religious', 
  'Military',
  'Cultural',
  'Magical',
  'Technological',
  'Natural',
  'Other'
];

// Simple Loading Component
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
    </div>
  );
};

// Success/Error Toast Component
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-2xl backdrop-blur-lg border ${
        type === 'success' 
          ? 'bg-green-900/90 border-green-500/30 text-green-100' 
          : 'bg-red-900/90 border-red-500/30 text-red-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Scribe's Form (Event Editor)
const ScribeForm: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TimelineEvent | null;
  onSuccess: () => void;
}> = ({ open, onOpenChange, event, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTimelineEventDto>({
    title: '',
    date: '',
    description: '',
    details: '',
    era: 'Golden Age',
    category: 'Other',
    background_image: '',
    is_published: false
  });

  useEffect(() => {
    if (event && open) {
      setFormData({
        title: event.title,
        date: event.date,
        description: event.description,
        details: event.details || '',
        era: event.era,
        category: event.category,
        background_image: event.background_image || '',
        is_published: event.is_published
      });
    } else if (!event && open) {
      setFormData({
        title: '',
        date: '',
        description: '',
        details: '',
        era: 'Golden Age',
        category: 'Other',
        background_image: '',
        is_published: false
      });
    }
  }, [event, open]);

  const createMutation = useMutation({
    mutationFn: createTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Create failed:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimelineEventDto> }) => 
      updateTimelineEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (event) {
      updateMutation.mutate({ id: event.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20"
      >
        <div className="p-8 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Scroll className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {event ? 'Amend Chronicle' : 'Inscribe New Chronicle'}
                </h2>
                <p className="text-purple-300 text-sm">Record the deeds for posterity</p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-purple-300 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300">
                Chronicle Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Name this great deed..."
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300">
                When It Came to Pass *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                placeholder="Year 1456, Third Moon..."
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Chronicle Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this moment in history..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Detailed Account
            </label>
            <textarea
              value={formData.details || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Additional details and context..."
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300">
                Era
              </label>
              <select
                value={formData.era}
                onChange={(e) => setFormData(prev => ({ ...prev, era: e.target.value }))}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                {AVAILABLE_ERAS.map(era => (
                  <option key={era} value={era}>{era}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                {AVAILABLE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category === 'Magical' ? '🔥' : 
                     category === 'Religious' ? '📜' : 
                     category === 'Political' ? '👑' : 
                     category === 'Military' ? '⚔️' : 
                     category === 'Cultural' ? '📚' : '✨'} {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 pt-7">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-5 h-5 rounded border-purple-500/30 bg-black/30 text-yellow-500 focus:ring-yellow-400/50 focus:ring-2"
                />
                <span className="text-sm font-medium text-purple-300">Reveal to All Seekers</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Background Image URL
            </label>
            <input
              type="url"
              value={formData.background_image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-purple-500/20">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 text-purple-300 hover:text-white transition-colors"
            >
              Abandon Quill
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Inscribing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {event ? 'Amend Chronicle' : 'Inscribe Chronicle'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Timeline Manager (Scribe's Workshop)
const TimelineManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set(['age-of-flame']));
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['timelineEvents'],
    queryFn: fetchTimelineEvents,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
    retryDelay: 1000
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      queryClient.invalidateQueries({ queryKey: ['publicTimelineEvents'] }); // Also refresh public
      setToast({ message: 'Chronicle has been erased from the scrolls', type: 'success' });
      setEventToDelete(null);
    },
    onError: (error) => {
      console.error('Delete failed:', error);
      setToast({ message: 'The chronicle resists erasure. Try again.', type: 'error' });
      setEventToDelete(null);
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: toggleTimelineEventPublishStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      queryClient.invalidateQueries({ queryKey: ['publicTimelineEvents'] }); // Also refresh public
      setToast({ message: 'Chronicle visibility has been changed', type: 'success' });
    },
    onError: (error) => {
      console.error('Toggle publish failed:', error);
      setToast({ message: 'The seals of secrecy could not be altered', type: 'error' });
    }
  });

  const eras = data?.data || [];
  
  const filteredEras = useMemo(() => {
    if (!searchTerm && statusFilter === 'all') return eras;
    
    return eras.map(era => ({
      ...era,
      events: era.events.filter(event => {
        const matchesSearch = searchTerm === '' || 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'published' && event.is_published) ||
          (statusFilter === 'draft' && !event.is_published);
        
        return matchesSearch && matchesStatus;
      })
    })).filter(era => era.events.length > 0);
  }, [eras, searchTerm, statusFilter]);

  const toggleEra = (eraId: string) => {
    const newExpanded = new Set(expandedEras);
    if (newExpanded.has(eraId)) {
      newExpanded.delete(eraId);
    } else {
      newExpanded.add(eraId);
    }
    setExpandedEras(newExpanded);
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    setToast({ 
      message: editingEvent ? 'Chronicle has been amended' : 'New chronicle has been inscribed', 
      type: 'success' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-white to-purple-400 bg-clip-text text-transparent">
              Consulting the Sacred Scrolls...
            </h1>
          </div>
          <p className="text-purple-300 mb-8">The ancient tomes are being prepared...</p>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalEvents = eras.reduce((sum, era) => sum + era.events.length, 0);
  const publishedEvents = eras.reduce((sum, era) => sum + era.events.filter(e => e.is_published).length, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Dark Fantasy Styles */}
      <style>{`
        .fantasy-bg {
          background: 
            radial-gradient(ellipse at top, rgba(26, 19, 37, 0.9) 0%, rgba(10, 6, 18, 0.95) 70%),
            linear-gradient(135deg, #1a1325 0%, #0a0612 100%);
        }
        
        .mystical-border {
          border: 1px solid rgba(139, 92, 246, 0.2);
          background: linear-gradient(135deg, 
            rgba(26, 19, 37, 0.9) 0%, 
            rgba(42, 32, 64, 0.8) 100%
          );
          backdrop-filter: blur(10px);
        }
        
        .era-marker {
          position: relative;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #d4af37,
            #8b5cf6,
            #3b82f6,
            #ef4444,
            #d4af37
          );
          animation: rotate 8s linear infinite;
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div className="fantasy-bg min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Statistics */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                  <Flame className="w-10 h-10 text-yellow-400" />
                </motion.div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-white to-purple-400 bg-clip-text text-transparent">
                  Scribe's Workshop
                </h1>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <Scroll className="w-10 h-10 text-yellow-400" />
                </motion.div>
              </div>
              <p className="text-xl text-purple-300 italic max-w-4xl mx-auto mb-8">
                Here the scribes tend to the great chronicles, that future generations may know the deeds of ages past.
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { icon: Scroll, label: 'Total', value: totalEvents, color: 'purple-400' },
                  { icon: Eye, label: 'Revealed', value: publishedEvents, color: 'green-400' },
                  { icon: EyeOff, label: 'Hidden', value: totalEvents - publishedEvents, color: 'yellow-400' },
                  { icon: Sparkles, label: 'Eras', value: eras.length, color: 'blue-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="text-center p-4 mystical-border rounded-lg"
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                placeholder="Search chronicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 mystical-border rounded-lg text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/50 focus:outline-none focus:ring-2"
              />
            </div>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-3 mystical-border rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 min-w-48"
            >
              <option value="all">All Chronicles</option>
              <option value="published">Revealed Chronicles</option>
              <option value="draft">Hidden Chronicles</option>
            </select>
            
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Inscribe New Chronicle
            </button>
          </div>

          {/* Timeline Content */}
          {filteredEras.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Chronicles Found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                The scribes have found no records matching thy criteria. Create thy first chronicle or adjust the search runes.
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 mystical-border rounded-lg text-white transition-all"
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Clear Search
                </button>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setIsFormOpen(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Create First Chronicle
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredEras.map((era, idx) => (
                <div key={era.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                    className="mystical-border rounded-2xl p-6 mb-4"
                  >
                    <button
                      onClick={() => toggleEra(era.id)}
                      className="w-full flex items-center justify-between gap-4 text-left group hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="era-marker" />
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">{era.title}</h2>
                          <p className="text-yellow-400 text-sm font-medium mb-2">{era.start} — {era.end}</p>
                          <p className="text-purple-300 text-sm italic mb-3">{era.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-black/20 border border-white/10 text-gray-300 px-2 py-1 rounded">
                              <Scroll className="w-3 h-3 mr-1 inline" />
                              {era.events.length} chronicles
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full mystical-border flex items-center justify-center group-hover:border-yellow-400/50 transition-colors">
                        <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${expandedEras.has(era.id) ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                  </motion.div>

                  <AnimatePresence>
                    {expandedEras.has(era.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="ml-12 space-y-4"
                      >
                        {era.events.map((event) => (
                          <div key={event.id} className="group relative">
                            <div className="mystical-border rounded-lg p-4 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] && 
                                      React.createElement(CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS], { className: "w-4 h-4 text-yellow-400" })
                                    }
                                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                                    <span className="text-sm bg-black/30 border border-yellow-500/30 text-yellow-300 px-2 py-1 rounded">
                                      {event.date}
                                    </span>
                                  </div>
                                  
                                  <p className="text-purple-200 mb-3 italic">{event.description}</p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                        event.is_published 
                                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                      }`}>
                                        {event.is_published ? (
                                          <><CheckCircle2 className="h-3 w-3" />Revealed</>
                                        ) : (
                                          <><Clock className="h-3 w-3" />Hidden</>
                                        )}
                                      </span>
                                      <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded">
                                        {event.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 hover:bg-yellow-500/20 rounded text-yellow-400 hover:text-yellow-300 transition-colors"
                                    title="Amend Chronicle"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => togglePublishMutation.mutate(event.id)}
                                    className="p-2 hover:bg-purple-500/20 rounded text-purple-400 hover:text-purple-300 transition-colors"
                                    title={event.is_published ? 'Hide Chronicle' : 'Reveal Chronicle'}
                                    disabled={togglePublishMutation.isPending}
                                  >
                                    {togglePublishMutation.isPending ? (
                                      <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setEventToDelete(event.id)}
                                    className="p-2 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                                    title="Erase Chronicle"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Scribe's Form */}
      <ScribeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        event={editingEvent}
        onSuccess={handleFormSuccess}
      />

      {/* Deletion Confirmation */}
      <AnimatePresence>
        {eventToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-red-900/95 to-red-800/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-red-500/20"
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Erase Chronicle Forever?</h3>
                <p className="text-red-200 mb-6">
                  This chronicle shall be struck from the records forever. 
                  The deed cannot be undone once the mystical ink has dried.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEventToDelete(null)}
                    className="flex-1 px-4 py-3 border border-red-400/30 rounded-lg hover:bg-red-500/10 text-red-200 hover:text-white transition-colors"
                  >
                    Preserve Chronicle
                  </button>
                  <button 
                    onClick={() => {
                      if (eventToDelete) {
                        deleteMutation.mutate(eventToDelete);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Erasing...
                      </>
                    ) : (
                      'Erase Forever'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelineManager;