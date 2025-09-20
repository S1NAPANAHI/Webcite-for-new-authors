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
  Settings,
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
  Save,
  Tabs
} from 'lucide-react';

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
  is_active: boolean;
  order_index: number;
  events?: TimelineEvent[];
}

interface CreateEventDto {
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

interface CreateEraDto {
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  background_color: string;
  is_active: boolean;
}

// API Functions
const fetchEras = async (): Promise<Era[]> => {
  const { data, error } = await supabase
    .from('timeline_eras')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
    
  if (error) throw error;
  return data || [];
};

const fetchTimelineEvents = async (): Promise<TimelineEvent[]> => {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('era')
    .order('order_index');
    
  if (error) throw error;
  return data || [];
};

const createEvent = async (eventData: CreateEventDto): Promise<TimelineEvent> => {
  const { data, error } = await supabase
    .from('timeline_events')
    .insert([{
      ...eventData,
      order_index: Math.floor(Date.now() / 1000), // Use seconds instead of milliseconds
      depth: eventData.depth || 0
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const updateEvent = async (id: string, eventData: Partial<CreateEventDto>): Promise<TimelineEvent> => {
  const { data, error } = await supabase
    .from('timeline_events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

const toggleEventPublish = async (id: string): Promise<void> => {
  const { data: current } = await supabase
    .from('timeline_events')
    .select('is_published')
    .eq('id', id)
    .single();
    
  const { error } = await supabase
    .from('timeline_events')
    .update({ is_published: !current?.is_published })
    .eq('id', id);
    
  if (error) throw error;
};

const createEra = async (eraData: CreateEraDto): Promise<Era> => {
  const { data, error } = await supabase
    .from('timeline_eras')
    .insert([{
      ...eraData,
      order_index: Math.floor(Date.now() / 1000)
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const updateEra = async (id: string, eraData: Partial<CreateEraDto>): Promise<Era> => {
  const { data, error } = await supabase
    .from('timeline_eras')
    .update(eraData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const deleteEra = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('timeline_eras')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

const CATEGORIES = [
  'Political',
  'Religious', 
  'Military',
  'Cultural',
  'Magical',
  'Technological',
  'Natural',
  'Other'
];

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

// Components
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-600 rounded ${className}`} />
);

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl max-w-sm ${
        type === 'success' 
          ? 'bg-green-900 border border-green-700 text-green-100' 
          : 'bg-red-900 border border-red-700 text-red-100'
      }`}
    >
      <div className="flex items-center gap-3">
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Event Form Component
const EventForm: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TimelineEvent | null;
  eras: Era[];
  onSuccess: () => void;
}> = ({ open, onOpenChange, event, eras, onSuccess }) => {
  const [formData, setFormData] = useState<CreateEventDto>({
    title: '',
    date: '',
    description: '',
    details: '',
    era: eras[0]?.name || '',
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
    }
  }, [event, open]);

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventDto> }) => updateEvent(id, data),
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {event ? 'Edit Event' : 'Create Event'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Year 1456 or March 15, 2024"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details (Optional)
            </label>
            <textarea
              value={formData.details || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional context and details..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Era
              </label>
              <select
                value={formData.era}
                onChange={(e) => setFormData(prev => ({ ...prev, era: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                {eras.map(era => (
                  <option key={era.id} value={era.name} className="text-gray-900">
                    {era.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category} className="text-gray-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.background_image || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {event ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Era Form Component
const EraForm: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  era?: Era | null;
  onSuccess: () => void;
}> = ({ open, onOpenChange, era, onSuccess }) => {
  const [formData, setFormData] = useState<CreateEraDto>({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    background_color: '#6b58c4',
    is_active: true
  });

  useEffect(() => {
    if (era && open) {
      setFormData({
        name: era.name,
        start_date: era.start_date,
        end_date: era.end_date,
        description: era.description,
        background_color: era.background_color,
        is_active: era.is_active
      });
    }
  }, [era, open]);

  const createMutation = useMutation({
    mutationFn: createEra,
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEraDto> }) => updateEra(id, data),
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (era) {
      updateMutation.mutate({ id: era.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {era ? 'Edit Era' : 'Create Era'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Era Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Beginning of Time"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Year 1000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {event ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Timeline Manager Component
const TimelineManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'events' | 'eras'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEraFormOpen, setIsEraFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [editingEra, setEditingEra] = useState<Era | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eraToDelete, setEraToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: eras = [], isLoading: erasLoading } = useQuery({
    queryKey: ['timeline-eras'],
    queryFn: fetchEras
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['timeline-events'],
    queryFn: fetchTimelineEvents
  });

  // Mutations
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      setToast({ message: 'Event deleted successfully', type: 'success' });
      setEventToDelete(null);
    },
    onError: () => {
      setToast({ message: 'Failed to delete event', type: 'error' });
      setEventToDelete(null);
    }
  });

  const deleteEraMutation = useMutation({
    mutationFn: deleteEra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-eras'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      setToast({ message: 'Era deleted successfully', type: 'success' });
      setEraToDelete(null);
    },
    onError: () => {
      setToast({ message: 'Failed to delete era', type: 'error' });
      setEraToDelete(null);
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: toggleEventPublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      setToast({ message: 'Event visibility updated', type: 'success' });
    },
    onError: () => {
      setToast({ message: 'Failed to update visibility', type: 'error' });
    }
  });

  // Group events by era
  const eventsByEra = useMemo(() => {
    const grouped = new Map<string, TimelineEvent[]>();
    events.forEach(event => {
      if (!grouped.has(event.era)) {
        grouped.set(event.era, []);
      }
      grouped.get(event.era)!.push(event);
    });
    return grouped;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'published' && event.is_published) ||
        (statusFilter === 'draft' && !event.is_published);
      
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const handleEventSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
    setToast({ message: editingEvent ? 'Event updated' : 'Event created', type: 'success' });
    setEditingEvent(null);
  };

  const handleEraSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['timeline-eras'] });
    queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
    setToast({ message: editingEra ? 'Era updated' : 'Era created', type: 'success' });
    setEditingEra(null);
  };

  if (erasLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton className="h-10 w-64 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline Manager</h1>
          <p className="text-gray-600">Manage timeline events and eras</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Events ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('eras')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'eras'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Eras ({eras.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="all" className="text-gray-900">All Events</option>
                <option value="published" className="text-gray-900">Published</option>
                <option value="draft" className="text-gray-900">Draft</option>
              </select>
              
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsEventFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Plus className="h-4 w-4" />
                Create Event
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {eras.map(era => {
                const eraEvents = filteredEvents.filter(event => event.era === era.name);
                if (eraEvents.length === 0) return null;
                
                return (
                  <div key={era.id} className="bg-white rounded-lg shadow border">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900">{era.name}</h3>
                      <p className="text-sm text-gray-600">{era.start_date} - {era.end_date}</p>
                    </div>
                    <div className="divide-y">
                      {eraEvents.map(event => (
                        <div key={event.id} className="p-4 hover:bg-gray-50 group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {React.createElement(CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] || Sparkles, { className: "w-4 h-4 text-gray-400" })}
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {event.date}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  event.is_published 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {event.is_published ? 'Published' : 'Draft'}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">{event.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingEvent(event);
                                  setIsEventFormOpen(true);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit Event"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => togglePublishMutation.mutate(event.id)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                title={event.is_published ? 'Unpublish' : 'Publish'}
                              >
                                {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => setEventToDelete(event.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete Event"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Eras Tab */}
        {activeTab === 'eras' && (
          <>
            {/* Era Controls */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setEditingEra(null);
                  setIsEraFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Plus className="h-4 w-4" />
                Create Era
              </button>
            </div>

            {/* Eras List */}
            <div className="bg-white rounded-lg shadow border">
              <div className="divide-y">
                {eras.map(era => (
                  <div key={era.id} className="p-4 hover:bg-gray-50 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: era.background_color }}
                          />
                          <h3 className="font-medium text-gray-900">{era.name}</h3>
                          <span className="text-sm text-gray-500">
                            {era.start_date} - {era.end_date}
                          </span>
                          <span className="text-xs text-gray-400">
                            {eventsByEra.get(era.name)?.length || 0} events
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{era.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingEra(era);
                            setIsEraFormOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Era"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEraToDelete(era.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Era"
                          disabled={eventsByEra.get(era.name)?.length > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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

      {/* Event Form */}
      <EventForm
        open={isEventFormOpen}
        onOpenChange={setIsEventFormOpen}
        event={editingEvent}
        eras={eras}
        onSuccess={handleEventSuccess}
      />

      {/* Era Form */}
      <EraForm
        open={isEraFormOpen}
        onOpenChange={setIsEraFormOpen}
        era={editingEra}
        onSuccess={handleEraSuccess}
      />

      {/* Event Delete Confirmation */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Event</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setEventToDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => eventToDelete && deleteEventMutation.mutate(eventToDelete)}
                  disabled={deleteEventMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                >
                  {deleteEventMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Era Delete Confirmation */}
      {eraToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Era</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this era? All events in this era will also be deleted.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setEraToDelete(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => eraToDelete && deleteEraMutation.mutate(eraToDelete)}
                  disabled={deleteEraMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                >
                  {deleteEraMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TimelineManager;