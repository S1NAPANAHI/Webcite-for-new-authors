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
  Save,
  GripVertical
} from 'lucide-react';

// Enhanced Types with Nested Structure
interface NestedEvent {
  id: string;
  title: string;
  date: string;
  blurb: string;
  children?: NestedEvent[];
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  blurb: string;
  details?: string;
  background_image?: string;
  is_published: boolean;
  order: number;
  category?: 'political' | 'religious' | 'military' | 'cultural' | 'mystical';
  importance?: 'minor' | 'major' | 'legendary';
  children?: NestedEvent[];
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
  blurb: string;
  details?: string;
  background_image?: string;
  is_published: boolean;
  category?: string;
  importance?: string;
  children?: NestedEvent[];
}

// Mock Fantasy Timeline Data for Admin
const mockTimelineData: Era[] = [
  {
    id: "era-1",
    title: "Age of Flame",
    start: "Dawn of Time",
    end: "Year 1247",
    description: "When Ahura Mazda first kindled the Sacred Fires and light pierced the primordial darkness.",
    events: [
      {
        id: "af-1",
        title: "The First Sacred Fire",
        date: "Dawn of Time",
        blurb: "Ahura Mazda kindles the eternal flame that shall never be extinguished.",
        category: "mystical",
        importance: "legendary",
        is_published: true,
        order: 0,
        children: [
          {
            id: "af-1-1",
            title: "Gathering of the Magi",
            date: "First Dawn + 7 Days",
            blurb: "Seven wise men witness the divine flame and become its first guardians."
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
];

// Mock API functions
const fetchTimelineEvents = async () => ({ data: mockTimelineData });
const createTimelineEvent = async (eventData: CreateTimelineEventDto) => {
  console.log('Creating event:', eventData);
  return { id: Date.now().toString(), ...eventData, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), order: 0 };
};
const updateTimelineEvent = async (id: string, eventData: Partial<CreateTimelineEventDto>) => {
  console.log('Updating event:', id, eventData);
  return { id, ...eventData, updated_at: new Date().toISOString() };
};
const deleteTimelineEvent = async (id: string) => {
  console.log('Deleting event:', id);
};
const toggleTimelineEventPublishStatus = async (id: string, isPublished: boolean) => {
  console.log('Toggling publish status:', id, isPublished);
};

const CATEGORY_ICONS = {
  political: Crown,
  religious: Scroll,
  military: Sword,
  cultural: BookOpen,
  mystical: Flame
};

// Simple Loading Component
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
    </div>
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
    blurb: '',
    details: '',
    background_image: '',
    is_published: false,
    category: 'mystical',
    importance: 'minor'
  });
  const [nestedEvents, setNestedEvents] = useState<NestedEvent[]>([]);

  useEffect(() => {
    if (event && open) {
      setFormData({
        title: event.title,
        date: event.date,
        blurb: event.blurb,
        details: event.details || '',
        background_image: event.background_image || '',
        is_published: event.is_published,
        category: event.category || 'mystical',
        importance: event.importance || 'minor'
      });
      setNestedEvents(event.children || []);
    } else if (!event && open) {
      setFormData({
        title: '',
        date: '',
        blurb: '',
        details: '',
        background_image: '',
        is_published: false,
        category: 'mystical',
        importance: 'minor'
      });
      setNestedEvents([]);
    }
  }, [event, open]);

  const createMutation = useMutation({
    mutationFn: createTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('Chronicle inscribed in the ancient tomes!');
      onSuccess();
    },
    onError: () => {
      alert('The quill has failed to write. Try again, scribe.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimelineEventDto> }) => 
      updateTimelineEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('The chronicle has been amended in the scrolls!');
      onSuccess();
    },
    onError: () => {
      alert('The amendment could not be inscribed. Try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventWithNested = { ...formData, children: nestedEvents };
    
    if (event) {
      updateMutation.mutate({ id: event.id, data: eventWithNested });
    } else {
      createMutation.mutate(eventWithNested);
    }
  };

  const addNestedEvent = () => {
    setNestedEvents(prev => [...prev, {
      id: `nested-${Date.now()}`,
      title: '',
      date: '',
      blurb: ''
    }]);
  };

  const removeNestedEvent = (id: string) => {
    setNestedEvents(prev => prev.filter(ne => ne.id !== id));
  };

  const updateNestedEvent = (id: string, field: keyof NestedEvent, value: string) => {
    setNestedEvents(prev => prev.map(ne => 
      ne.id === id ? { ...ne, [field]: value } : ne
    ));
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
          {/* Main Event Fields */}
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
              value={formData.blurb}
              onChange={(e) => setFormData(prev => ({ ...prev, blurb: e.target.value }))}
              placeholder="Describe this moment in history..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300">
                Chronicle Type
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                <option value="mystical">🔥 Mystical</option>
                <option value="religious">📜 Religious</option>
                <option value="political">👑 Political</option>
                <option value="military">⚔️ Military</option>
                <option value="cultural">📚 Cultural</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-300">
                Importance
              </label>
              <select
                value={formData.importance}
                onChange={(e) => setFormData(prev => ({ ...prev, importance: e.target.value }))}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                <option value="minor">Minor Tale</option>
                <option value="major">Major Chronicle</option>
                <option value="legendary">⭐ Legendary Deed</option>
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
          
          {/* Nested Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-purple-300">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Related Tales ({nestedEvents.length})
              </label>
              <button
                type="button"
                onClick={addNestedEvent}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Tale
              </button>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {nestedEvents.map((nestedEvent, index) => (
                <motion.div
                  key={nestedEvent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-black/20 rounded-lg p-4 border border-purple-500/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={nestedEvent.title}
                      onChange={(e) => updateNestedEvent(nestedEvent.id, 'title', e.target.value)}
                      placeholder="Tale title..."
                      className="px-3 py-2 bg-black/30 border border-purple-500/30 rounded text-white placeholder-purple-400 text-sm focus:border-yellow-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={nestedEvent.date}
                      onChange={(e) => updateNestedEvent(nestedEvent.id, 'date', e.target.value)}
                      placeholder="When..."
                      className="px-3 py-2 bg-black/30 border border-purple-500/30 rounded text-white placeholder-purple-400 text-sm focus:border-yellow-400 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nestedEvent.blurb}
                        onChange={(e) => updateNestedEvent(nestedEvent.id, 'blurb', e.target.value)}
                        placeholder="What happened..."
                        className="flex-1 px-3 py-2 bg-black/30 border border-purple-500/30 rounded text-white placeholder-purple-400 text-sm focus:border-yellow-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeNestedEvent(nestedEvent.id)}
                        className="p-2 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set(['era-1']));

  const { data, isLoading, error } = useQuery({
    queryKey: ['timelineEvents'],
    queryFn: fetchTimelineEvents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('The chronicle has been erased from the scrolls.');
      setEventToDelete(null);
    },
    onError: () => {
      alert('The chronicle resists erasure. Try again.');
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      toggleTimelineEventPublishStatus(id, !isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('The chronicle\'s visibility has been changed.');
    },
    onError: () => {
      alert('The seals of secrecy could not be altered.');
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
          event.blurb.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.children && event.children.some(child => 
            child.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.blurb.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <LoadingSkeleton className="h-12 w-64 mx-auto mb-4" />
            <LoadingSkeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/30">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">The Scribal Arts Are Lost</h1>
          <p className="text-gray-400 mb-6">
            The ancient tomes cannot be accessed. Perhaps the guardian spirits need appeasing...
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalEvents = eras.reduce((sum, era) => sum + era.events.length, 0);
  const publishedEvents = eras.reduce((sum, era) => sum + era.events.filter(e => e.is_published).length, 0);
  const totalTales = eras.reduce((sum, era) => sum + era.events.reduce((eSum, event) => eSum + (event.children?.length || 0), 0), 0);

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
        
        .legendary-glow {
          animation: legendary-pulse 3s ease-in-out infinite;
        }
        
        @keyframes legendary-pulse {
          0%, 100% {
            box-shadow: 
              0 0 20px rgba(212, 175, 55, 0.3),
              0 0 40px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow: 
              0 0 30px rgba(212, 175, 55, 0.5),
              0 0 60px rgba(212, 175, 55, 0.2);
          }
        }
      `}</style>
      
      <div className="fantasy-bg min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Mystical Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <Flame className="w-10 h-10 text-yellow-400" />
                </motion.div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-white to-purple-400 bg-clip-text text-transparent">
                  Scribe's Workshop
                </h1>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Scroll className="w-10 h-10 text-yellow-400" />
                </motion.div>
              </div>
              <p className="text-xl text-purple-300 italic max-w-4xl mx-auto">
                Here the scribes tend to the great chronicles, that future generations may know the deeds of ages past.
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
                {[
                  { icon: Scroll, label: 'Chronicles', value: totalEvents, color: 'purple-400' },
                  { icon: Eye, label: 'Revealed', value: publishedEvents, color: 'green-400' },
                  { icon: EyeOff, label: 'Hidden', value: totalEvents - publishedEvents, color: 'yellow-400' },
                  { icon: Sparkles, label: 'Tales', value: totalTales, color: 'blue-400' }
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
                placeholder="Search chronicles and tales..."
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
                The scribes have found no records matching thy criteria. 
                Perhaps the ink has faded, or the search runes need adjustment.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 mystical-border rounded-lg text-white transition-all"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Clear the Binding Runes
              </button>
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
                      className="w-full flex items-center justify-between gap-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="era-marker" />
                        
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">{era.title}</h2>
                          <p className="text-yellow-400 text-sm font-medium mb-2">
                            {era.start} — {era.end}
                          </p>
                          <p className="text-purple-300 text-sm italic mb-3">{era.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-black/20 border border-white/10 text-gray-300 px-2 py-1 rounded">
                              <Scroll className="w-3 h-3 mr-1 inline" />
                              {era.events.length} chronicles
                            </span>
                            <span className="text-xs bg-black/20 border border-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                              <Sparkles className="w-3 h-3 mr-1 inline" />
                              {era.events.reduce((sum, event) => sum + (event.children?.length || 0), 0)} tales
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full mystical-border flex items-center justify-center">
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
                            <div className="mystical-border rounded-lg p-4 hover:border-yellow-400/50 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {CATEGORY_ICONS[event.category || 'mystical'] && 
                                      React.createElement(CATEGORY_ICONS[event.category || 'mystical'], { className: "w-4 h-4 text-yellow-400" })
                                    }
                                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                                    <span className="text-sm bg-black/30 border border-yellow-500/30 text-yellow-300 px-2 py-1 rounded">
                                      {event.date}
                                    </span>
                                  </div>
                                  
                                  <p className="text-purple-200 mb-3 italic">{event.blurb}</p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {event.importance === 'legendary' && (
                                        <span className="text-xs bg-gradient-to-r from-yellow-600 to-orange-500 text-yellow-100 px-2 py-1 rounded">
                                          <Star className="w-3 h-3 mr-1 inline" />
                                          Legendary
                                        </span>
                                      )}
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
                                    </div>
                                    
                                    {event.children && event.children.length > 0 && (
                                      <span className="text-xs text-purple-300">
                                        <Sparkles className="w-3 h-3 mr-1 inline" />
                                        {event.children.length} tales
                                      </span>
                                    )}
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
                                    onClick={() => togglePublishMutation.mutate({ id: event.id, isPublished: event.is_published })}
                                    className="p-2 hover:bg-purple-500/20 rounded text-purple-400 hover:text-purple-300 transition-colors"
                                    title={event.is_published ? 'Hide Chronicle' : 'Reveal Chronicle'}
                                  >
                                    {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

      {/* Scribe's Form */}
      <ScribeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        event={editingEvent}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
      />

      {/* Erasure Confirmation */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-900/95 to-red-800/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-red-500/20"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Erase Chronicle?</h3>
              <p className="text-red-200 mb-6">
                This chronicle shall be struck from the records forever. 
                The deed cannot be undone once the ink is dried.
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Erasing...' : 'Erase Forever'}
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