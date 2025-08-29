import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../dialog';
import { Button } from '../../button';
import { Input } from '../../input';
import { Textarea } from '../../textarea';
import { Label } from '../../label';
import { Switch } from '../../switch';
import { useToast } from '../../use-toast';
import { createTimelineEvent, updateTimelineEvent } from '../../api/timeline';
const nestedEventSchema = z.object({
    id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    order: z.number().default(0).optional(),
    timeline_event_id: z.string().optional(),
});
const formSchema = z.object({
    id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    details: z.string().optional().nullable(),
    background_image: z.string().optional().nullable(),
    is_published: z.boolean().default(false),
    era: z.enum(['ancient', 'medieval', 'modern', 'future']).default('ancient'),
    nested_events: z.array(nestedEventSchema).default([]).optional(),
});
import { ImageUpload } from '../common/ImageUpload';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
const defaultValues = {
    date: '',
    title: '',
    description: '',
    details: '',
    background_image: null,
    is_published: false,
    era: 'ancient',
    nested_events: [],
};
const SortableNestedEvent = ({ id, index, control, remove, register, errors, }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 'auto',
    };
    return (_jsx("div", { ref: setNodeRef, style: style, className: `p-4 border rounded-lg mb-2 bg-card ${isDragging ? 'shadow-lg' : ''}`, children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("button", { type: "button", className: "h-10 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground", ...attributes, ...listeners, children: _jsx(GripVertical, { className: "h-4 w-4" }) }), _jsxs("div", { className: "flex-1 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: `nested_events.${index}.date`, children: "Date" }), _jsx(Input, { id: `nested_events.${index}.date`, ...register(`nested_events.${index}.date`), placeholder: "e.g., 2023" }), errors?.nested_events?.[index]?.date && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.nested_events[index].date.message }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: `nested_events.${index}.title`, children: "Title" }), _jsx(Input, { id: `nested_events.${index}.title`, ...register(`nested_events.${index}.title`), placeholder: "Event title" }), errors?.nested_events?.[index]?.title && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.nested_events[index].title.message }))] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: `nested_events.${index}.description`, children: "Description" }), _jsx(Textarea, { id: `nested_events.${index}.description`, ...register(`nested_events.${index}.description`), placeholder: "Brief description of the event", rows: 2 }), errors?.nested_events?.[index]?.description && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.nested_events[index].description.message }))] })] }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "text-destructive hover:text-destructive", onClick: () => remove(index), children: _jsx(X, { className: "h-4 w-4" }) })] }) }));
};
export default function TimelineEventForm({ open, onOpenChange, event, onSuccess, }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onChange',
    });
    const { control, handleSubmit, register, reset, setValue, watch, formState: { errors }, } = form;
    useEffect(() => {
        if (event) {
            reset({
                title: event.title,
                description: event.description,
                details: event.details || '',
                date: event.date,
                era: event.era || 'ancient',
                background_image: event.background_image || '',
                is_published: event.is_published,
                nested_events: event.nested_events?.map(ne => ({
                    date: ne.date,
                    title: ne.title,
                    description: ne.description,
                    order: ne.order || 0
                })) || [],
            });
        }
        else {
            reset(defaultValues);
        }
    }, [event, reset]);
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'nested_events',
        keyName: 'nestedId',
    });
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    const { mutate: createTimelineEventMutation } = useMutation({
        mutationFn: async (formData) => {
            const { nested_events, details, background_image, ...rest } = formData;
            // Prepare the data for the API call
            const apiData = {
                ...rest,
                details: details || undefined,
                // Only include background_image if it has a value
                ...(background_image ? { background_image } : {}),
                nested_events: (nested_events || []).map((item, index) => ({
                    date: item.date,
                    title: item.title,
                    description: item.description,
                    order: index
                }))
            };
            // Remove undefined values before sending to the API
            const cleanData = Object.fromEntries(Object.entries(apiData).filter(([_, v]) => v !== undefined));
            return createTimelineEvent(cleanData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
            toast({
                title: 'Success',
                description: 'Timeline event created successfully',
            });
            onSuccess();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSettled: () => {
            setIsUploading(false);
        },
    });
    const { mutate: updateTimelineEventMutation } = useMutation({
        mutationFn: async (formData) => {
            const { nested_events, details, background_image, id, ...rest } = formData;
            // Prepare the update data with the ID included
            const updateData = {
                id,
                ...rest,
                details: details || null, // Use null for empty details
                background_image: background_image || null, // Use null for empty background_image
                nested_events: (nested_events || []).map((item, index) => ({
                    ...item,
                    order: index,
                    timeline_event_id: id
                }))
            };
            // Pass the complete update data object to the API function
            return updateTimelineEvent(updateData.id, updateData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelineEvents'] });
            toast({
                title: 'Success',
                description: 'Timeline event updated successfully',
            });
            onSuccess();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
        onSettled: () => {
            setIsUploading(false);
        },
    });
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.nestedId === active.id);
            const newIndex = fields.findIndex((f) => f.nestedId === over.id);
            move(oldIndex, newIndex);
        }
    };
    const onSubmit = (data) => {
        setIsUploading(true);
        if (event) {
            updateTimelineEventMutation({
                ...data,
                id: event.id,
                nested_events: data.nested_events?.map((item, index) => ({
                    ...item,
                    order: index,
                    timeline_event_id: event.id
                })) || []
            });
        }
        else {
            createTimelineEventMutation({
                ...data,
                nested_events: data.nested_events?.map((item, index) => ({
                    ...item,
                    order: index
                })) || []
            });
        }
    };
    const handleImageUpload = (url) => {
        setValue('background_image', url);
        setIsUploading(false);
    };
    const handleImageUploadStart = () => {
        setIsUploading(true);
    };
    const handleImageUploadError = (error) => {
        toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
        });
        setIsUploading(false);
    };
    const backgroundImage = watch('background_image');
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[90vw] max-h-[90vh] flex flex-col p-0", onInteractOutside: (e) => e.preventDefault(), children: [_jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: event ? 'Edit Timeline Event' : 'Create New Timeline Event' }) }), _jsxs("form", { id: "timeline-event-form", onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "title", children: "Title *" }), _jsx(Input, { id: "title", placeholder: "Event title", ...register('title'), className: "w-full" }), errors.title && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.title.message }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "date", children: "Date *" }), _jsx(Input, { id: "date", type: "date", ...register('date'), className: "w-full" }), errors.date && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.date.message }))] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Description *" }), _jsx(Textarea, { id: "description", placeholder: "Brief description of the event", ...register('description'), rows: 3, className: "w-full" }), errors.description && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.description.message }))] }), _jsxs("div", { children: [_jsx(Label, { children: "Background Image (Optional)" }), _jsx("div", { className: "mt-1", children: backgroundImage ? (_jsxs("div", { className: "relative group", children: [_jsx("img", { src: backgroundImage, alt: "Event background", className: "h-40 w-full object-cover rounded-md" }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "absolute top-2 right-2 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity", onClick: () => setValue('background_image', ''), children: _jsx(X, { className: "h-4 w-4" }) })] })) : (_jsx(ImageUpload, { folder: "timeline", onUpload: handleImageUpload, onError: handleImageUploadError, onStart: handleImageUploadStart, children: _jsx("div", { className: "flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors", children: isUploading ? (_jsx("div", { className: "animate-pulse text-sm", children: "Uploading..." })) : (_jsxs(_Fragment, { children: [_jsx(ImageIcon, { className: "h-6 w-6 mb-1 text-muted-foreground" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Click to upload or drag and drop" }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "PNG, JPG, GIF up to 5MB" })] })) }) })) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "details", children: "Details (Optional)" }), _jsx(Textarea, { id: "details", placeholder: "Detailed information about the event", ...register('details'), rows: 7, className: "w-full" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Controller, { control: control, name: "is_published", render: ({ field: { value, onChange } }) => (_jsx(Switch, { id: "is_published", checked: value, onCheckedChange: onChange })) }), _jsx(Label, { htmlFor: "is_published", className: "!mt-0", children: watch('is_published') ? 'Published' : 'Draft' })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "era", children: "Era *" }), _jsxs("select", { id: "era", ...register('era'), className: "w-full p-2 border rounded-md focus:ring-accent focus:border-accent", children: [_jsx("option", { value: "ancient", children: "Ancient" }), _jsx("option", { value: "medieval", children: "Medieval" }), _jsx("option", { value: "modern", children: "Modern" }), _jsx("option", { value: "future", children: "Future" })] }), errors.era && (_jsx("p", { className: "text-sm text-destructive mt-1", children: errors.era.message }))] })] })] }), _jsxs("div", { className: "border-t pt-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx(Label, { className: "text-base", children: "Nested Events" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => append({
                                                        date: '',
                                                        title: '',
                                                        description: '',
                                                        order: 0,
                                                    }), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Nested Event"] })] }), fields.length > 0 ? (_jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, modifiers: [restrictToVerticalAxis], children: _jsx(SortableContext, { items: fields.map((field) => field.nestedId), strategy: verticalListSortingStrategy, children: _jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto pr-2 -mr-2", children: fields.map((field, index) => (_jsx(SortableNestedEvent, { id: field.nestedId, index: index, control: control, remove: remove, register: register, errors: errors }, field.nestedId))) }) }) })) : (_jsx("div", { className: "text-center p-4 border-2 border-dashed rounded-md", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "No nested events added yet. Add events that are related to this main event." }) }))] }), _jsxs(DialogFooter, { className: "pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }), _jsxs(Button, { type: "submit", children: [event ? 'Update' : 'Create', " Event"] })] })] })] }), _jsx("div", { className: "border-t p-4", children: _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }), _jsxs(Button, { type: "submit", form: "timeline-event-form", children: [event ? 'Update' : 'Create', " Event"] })] }) })] }) }));
}
;
