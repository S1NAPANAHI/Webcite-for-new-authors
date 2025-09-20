import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

// Temporary types and mock functions - replace with actual implementations
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

interface CreateTimelineEventDto {
  title: string;
  description: string;
  details?: string;
  date: string;
  background_image?: string;
  is_published: boolean;
}

// Mock API functions - replace with actual implementations
const fetchTimelineEvents = async ({ includeUnpublished = true }) => {
  // Mock data for development
  return {
    data: [
      {
        id: '1',
        title: 'The Great Reformation',
        description: 'A pivotal moment in religious history that changed the world.',
        date: '1517 CE',
        is_published: true,
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2', 
        title: 'Discovery of the New World',
        description: 'Columbus arrives in the Americas, opening a new chapter in human history.',
        date: '1492 CE',
        is_published: false,
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ] as TimelineEvent[]
  };
};

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

// Event form component
interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TimelineEvent | null;
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ open, onOpenChange, event, onSuccess }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTimelineEventDto>({
    title: '',
    description: '',
    details: '',
    date: '',
    background_image: '',
    is_published: false
  });

  useEffect(() => {
    if (event && open) {
      setFormData({
        title: event.title,
        description: event.description,
        details: event.details || '',
        date: event.date,
        background_image: event.background_image || '',
        is_published: event.is_published
      });
    } else if (!event && open) {
      setFormData({
        title: '',
        description: '',
        details: '',
        date: '',
        background_image: '',
        is_published: false
      });
    }
  }, [event, open]);

  const createMutation = useMutation({
    mutationFn: createTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('Timeline event created successfully');
      onSuccess();
    },
    onError: () => {
      alert('Failed to create timeline event');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimelineEventDto> }) => 
      updateTimelineEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('Timeline event updated successfully');
      onSuccess();
    },
    onError: () => {
      alert('Failed to update timeline event');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {event ? 'Edit Timeline Event' : 'Create New Timeline Event'}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Date *
              </label>
              <input
                id="date"
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                placeholder="e.g., 1066 CE, 500 BCE"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the event"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="details" className="block text-sm font-medium">
              Detailed Information
            </label>
            <textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Detailed information about the event (supports HTML)"
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="background_image" className="block text-sm font-medium">
              Background Image URL
            </label>
            <input
              id="background_image"
              type="url"
              value={formData.background_image}
              onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="is_published"
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="is_published" className="text-sm font-medium">
              Publish immediately
            </label>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 min-w-20"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Timeline Manager component
const TimelineManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['timelineEvents'],
    queryFn: () => fetchTimelineEvents({ includeUnpublished: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('Timeline event deleted successfully');
      setEventToDelete(null);
    },
    onError: () => {
      alert('Failed to delete timeline event');
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      toggleTimelineEventPublishStatus(id, !isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      alert('Event status updated successfully');
    },
    onError: () => {
      alert('Failed to update event status');
    }
  });

  const events = data?.data || [];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && event.is_published) ||
      (statusFilter === 'draft' && !event.is_published);
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete);
    }
  };

  const togglePublishStatus = (id: string, isPublished: boolean) => {
    togglePublishMutation.mutate({ id, isPublished });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to load timeline events. Please try refreshing the page.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            Timeline Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage timeline events for the Zoroasterverse
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <Globe className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.is_published).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {events.filter(e => !e.is_published).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Filters & Search</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              />
            </div>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 w-48"
          >
            <option value="all">All Events</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Timeline Events ({filteredEvents.length})</h3>
        </div>
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No Events Found</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No events match your current filters.' 
                  : 'No timeline events have been created yet.'}
              </p>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create First Event
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {event.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span 
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            event.is_published 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}
                        >
                          {event.is_published ? (
                            <><CheckCircle2 className="h-3 w-3" />Published</>
                          ) : (
                            <><Clock className="h-3 w-3" />Draft</>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePublishStatus(event.id, event.is_published)}
                            disabled={togglePublishMutation.isPending}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title={event.is_published ? 'Unpublish' : 'Publish'}
                          >
                            {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleEdit(event)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Edit Event"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-red-600 hover:text-red-700"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      <EventForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        event={editingEvent}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Delete Timeline Event</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this timeline event? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setEventToDelete(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineManager;