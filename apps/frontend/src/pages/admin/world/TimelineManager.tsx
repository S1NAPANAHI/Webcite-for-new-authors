import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Globe, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@zoroaster/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Badge } from '@zoroaster/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@zoroaster/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@zoroaster/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@zoroaster/ui';
import { Textarea } from '@zoroaster/ui';
import { Label } from '@zoroaster/ui';
import { Switch } from '@zoroaster/ui';
import { LoadingSkeleton } from '@zoroaster/ui';
import { useToast } from '@zoroaster/ui';
import { Alert, AlertDescription } from '@zoroaster/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@zoroaster/ui';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

// Import your timeline API functions and types
// import { fetchTimelineEvents, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent, toggleTimelineEventPublishStatus, reorderTimelineEvents } from '@zoroaster/shared/api/timeline';
// import type { TimelineEvent, CreateTimelineEventDto, UpdateTimelineEventDto } from '@zoroaster/shared/types/timeline';

// Temporary mock types and functions - replace with actual imports
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
  // Mock implementation
  return { id: Date.now().toString(), ...eventData, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), order: 0 };
};

const updateTimelineEvent = async (id: string, eventData: Partial<CreateTimelineEventDto>) => {
  console.log('Updating event:', id, eventData);
  // Mock implementation 
  return { id, ...eventData, updated_at: new Date().toISOString() };
};

const deleteTimelineEvent = async (id: string) => {
  console.log('Deleting event:', id);
  // Mock implementation
};

const toggleTimelineEventPublishStatus = async (id: string, isPublished: boolean) => {
  console.log('Toggling publish status:', id, isPublished);
  // Mock implementation
};

const reorderTimelineEvents = async (events: Array<{ id: string; order: number }>) => {
  console.log('Reordering events:', events);
  // Mock implementation
};

// Sortable row component for drag and drop
interface SortableRowProps {
  id: string;
  children: React.ReactNode;
}

const SortableRow: React.FC<SortableRowProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted/50' : ''}>
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // First cell contains the drag handle
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <div className="flex items-center gap-2">
                <div
                  {...attributes}
                  {...listeners}
                  className="cursor-move p-1 hover:bg-muted rounded"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                {(child as React.ReactElement).props.children}
              </div>
            )
          });
        }
        return child;
      })}
    </TableRow>
  );
};

// Event form component
interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TimelineEvent | null;
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ open, onOpenChange, event, onSuccess }) => {
  const { toast } = useToast();
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
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        details: event.details || '',
        date: event.date,
        background_image: event.background_image || '',
        is_published: event.is_published
      });
    } else {
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
      toast({ title: 'Success', description: 'Timeline event created successfully' });
      onSuccess();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create timeline event', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTimelineEventDto> }) => 
      updateTimelineEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      toast({ title: 'Success', description: 'Timeline event updated successfully' });
      onSuccess();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update timeline event', variant: 'destructive' });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event ? 'Edit Timeline Event' : 'Create New Timeline Event'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                placeholder="e.g., 1066 CE, 500 BCE"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the event"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Detailed Information</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="Detailed information about the event (supports HTML)"
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background_image">Background Image URL</Label>
            <Input
              id="background_image"
              value={formData.background_image}
              onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published">Publish immediately</Label>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="min-w-20"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Timeline Manager component
const TimelineManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['timelineEvents'],
    queryFn: () => fetchTimelineEvents({ includeUnpublished: true }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimelineEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      toast({ title: 'Success', description: 'Timeline event deleted successfully' });
      setEventToDelete(null);
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete timeline event', variant: 'destructive' });
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      toggleTimelineEventPublishStatus(id, !isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      toast({ title: 'Success', description: 'Event status updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update event status', variant: 'destructive' });
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTimelineEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
      toast({ title: 'Success', description: 'Timeline events reordered successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to reorder events', variant: 'destructive' });
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = filteredEvents.findIndex(item => item.id === active.id);
      const newIndex = filteredEvents.findIndex(item => item.id === over.id);
      
      const updatedEvents = filteredEvents.map((item, index) => ({
        id: item.id,
        order: index
      }));
      
      reorderMutation.mutate(updatedEvents);
    }
  };

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <LoadingSkeleton className="h-8 w-48" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <LoadingSkeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <LoadingSkeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load timeline events. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Globe className="h-8 w-8 text-primary" />
              Timeline Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage timeline events for the Zoroasterverse
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isReordering ? 'destructive' : 'outline'}
              onClick={() => setIsReordering(!isReordering)}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {isReordering ? 'Done Reordering' : 'Reorder Events'}
            </Button>
            
            <Button
              onClick={() => {
                setEditingEvent(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.is_published).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter(e => !e.is_published).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={(value: 'all' | 'published' | 'draft') => setStatusFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="published">Published Only</SelectItem>
                  <SelectItem value="draft">Drafts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Timeline Events ({filteredEvents.length})</span>
              {isReordering && (
                <Badge variant="secondary" className="animate-pulse">
                  Drag to reorder
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No events match your current filters.' 
                    : 'No timeline events have been created yet.'}
                </p>
                <Button
                  onClick={() => {
                    setEditingEvent(null);
                    setIsFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Event
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={isReordering ? 'w-12' : 'w-8'}></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={filteredEvents.map(event => event.id)}
                        strategy={verticalListSortingStrategy}
                        disabled={!isReordering}
                      >
                        {filteredEvents.map((event) => (
                          <SortableRow key={event.id} id={event.id}>
                            <TableCell></TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-md">
                                  {event.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                <Calendar className="h-3 w-3 mr-1" />
                                {event.date}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={event.is_published ? 'default' : 'secondary'}
                                className={event.is_published ? 'bg-green-100 text-green-800' : ''}
                              >
                                {event.is_published ? (
                                  <><CheckCircle2 className="h-3 w-3 mr-1" />Published</>
                                ) : (
                                  <><Clock className="h-3 w-3 mr-1" />Draft</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => togglePublishStatus(event.id, event.is_published)}
                                      disabled={togglePublishMutation.isPending}
                                    >
                                      {event.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {event.is_published ? 'Unpublish' : 'Publish'}
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEdit(event)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Edit Event
                                  </TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(event.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Delete Event
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </SortableRow>
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Form Dialog */}
        <EventForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          event={editingEvent}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingEvent(null);
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Delete Timeline Event
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to delete this timeline event? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEventToDelete(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    'Delete Event'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default TimelineManager;