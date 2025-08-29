import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '../../button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../table';
import { Badge } from '../../badge';
import { useToast } from '../../use-toast';
import { fetchTimelineEvents, deleteTimelineEvent, toggleTimelineEventPublishStatus, reorderTimelineEvents } from '../../api/timeline';
import TimelineEventForm from './TimelineEventForm';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 'auto',
    };
    return (_jsx("tr", { ref: setNodeRef, style: style, className: isDragging ? 'bg-gray-100 dark:bg-gray-800' : '', ...attributes, children: children({ attributes, listeners, isDragging }) }));
};
const TimelineManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    ;
    const [showUnpublished, setShowUnpublished] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [events, setEvents] = useState([]);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['timelineEvents', { showUnpublished }],
        queryFn: () => fetchTimelineEvents({ includeUnpublished: true }),
    });
    const deleteMutation = useMutation({
        mutationFn: deleteTimelineEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
            toast({
                title: 'Success',
                description: 'Timeline event deleted successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
    const togglePublishMutation = useMutation({
        mutationFn: ({ id, isPublished }) => toggleTimelineEventPublishStatus(id, !isPublished),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
            toast({
                title: 'Success',
                description: 'Timeline event status updated',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });
    const reorderMutation = useMutation({
        mutationFn: reorderTimelineEvents,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
            toast({
                title: 'Success',
                description: 'Timeline events reordered successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
            // Revert to the previous state on error
            refetch();
        },
    });
    useEffect(() => {
        // if (data?.data) {
        //   setEvents(data.data);
        // }
    }, []); // Removed data from dependency array
    const handleEdit = (event) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };
    const handleDelete = (id) => {
        setEventToDelete(id);
    };
    const confirmDelete = () => {
        if (eventToDelete) {
            // deleteMutation.mutate(eventToDelete);
            setEventToDelete(null);
        }
    };
    const togglePublishStatus = (id, isPublished) => {
        // togglePublishMutation.mutate({ id, isPublished });
    };
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setEvents((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = [...items];
                const [removed] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, removed);
                // Update the order property based on the new position
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    order: index,
                }));
                // Send the update to the server
                // reorderMutation.mutate(
                //   updatedItems.map((item) => ({
                //     id: item.id,
                //     order: item.order,
                //   }))
                // );
                return updatedItems;
            });
        }
    };
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    // if (isLoading) { // Commented out isLoading check
    //   return (
    //     <div className="space-y-4">
    //       <div className="flex justify-between items-center">
    //         <LoadingSkeleton className="h-10 w-32" />
    //         <LoadingSkeleton className="h-10 w-40" />
    //       </div>
    //       <LoadingSkeleton className="h-12 w-full" />
    //       {[...Array(5)].map((_, i) => (
    //         <LoadingSkeleton key={i} className="h-20 w-full" />
    //       ))}
    //     </div>
    //   );
    // }
    // if (error) { // Commented out error check
    //   return (
    //     <div className="rounded-md bg-red-50 p-4">
    //       <div className="flex">
    //         <div className="flex-shrink-0">
    //           <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
    //         </div>
    //         <div className="ml-3">
    //           <h3 className="text-sm font-medium text-red-800">
    //             Error loading timeline events
    //           </h3>
    //           <div className="mt-2 text-sm text-red-700">
    //             <p>{error.message}</p>
    //           </div>
    //           <div className="mt-4">
    //             <Button variant="outline" onClick={() => refetch()}>
    //               Retry
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Timeline Events" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Manage the timeline events displayed on the website" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto", children: [_jsx(Button, { variant: showUnpublished ? 'outline' : 'default', onClick: () => setShowUnpublished(!showUnpublished), className: "w-full sm:w-auto", children: showUnpublished ? 'Hide Unpublished' : 'Show Unpublished' }), _jsx(Button, { variant: isReordering ? 'destructive' : 'outline', onClick: () => setIsReordering(!isReordering), className: "w-full sm:w-auto", children: isReordering ? 'Done Reordering' : 'Reorder Events' }), _jsxs(Button, { onClick: () => {
                                    setEditingEvent(null);
                                    setIsFormOpen(true);
                                }, className: "w-full sm:w-auto", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Event"] })] })] }), _jsx("div", { className: "rounded-md border", children: _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, modifiers: [restrictToVerticalAxis], children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [isReordering && _jsx(TableHead, { className: "w-10" }), _jsx(TableHead, { children: "Date" }), _jsx(TableHead, { children: "Title" }), _jsx(TableHead, { children: "Description" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: _jsx(SortableContext, { items: events.map((event) => event.id), strategy: verticalListSortingStrategy, children: events.map((event) => (_jsx(SortableItem, { id: event.id, children: ({ listeners, isDragging }) => (_jsxs(_Fragment, { children: [isReordering && (_jsx(TableCell, { className: "w-10", children: _jsx("div", { className: "h-8 w-8 p-0 flex items-center justify-center cursor-move", ...listeners, children: _jsx(GripVertical, { className: "h-4 w-4" }) }) })), _jsx(TableCell, { children: _jsx("div", { className: "font-medium", children: event.date }) }), _jsx(TableCell, { children: _jsx("div", { className: "font-medium", children: event.title }) }), _jsx(TableCell, { className: "max-w-[300px] truncate", children: event.description }), _jsx(TableCell, { children: _jsx(Badge, { variant: event.is_published ? 'default' : 'outline', children: event.is_published ? 'Published' : 'Draft' }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleEdit(event), children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setEventToDelete(event.id), children: _jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })] }) })] })) }, event.id))) }) })] }) }) }), _jsx(TimelineEventForm, { open: isFormOpen, onOpenChange: setIsFormOpen, event: editingEvent, onSuccess: () => {
                    setIsFormOpen(false);
                    setEditingEvent(null);
                    refetch();
                } }), _jsx(ConfirmDialog, { open: !!eventToDelete, onOpenChange: (open) => !open && setEventToDelete(null), onConfirm: confirmDelete, title: "Delete Timeline Event", description: "Are you sure you want to delete this timeline event? This action cannot be undone.", confirmText: "Delete", cancelText: "Cancel" })] }));
};
export { TimelineManager };
