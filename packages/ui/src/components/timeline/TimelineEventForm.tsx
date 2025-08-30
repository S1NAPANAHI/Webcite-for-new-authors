import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray, SubmitHandler } from 'react-hook-form';
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
import { TimelineEvent, NestedEvent } from '@zoroaster/shared/types/timeline';
import {
  createTimelineEvent,
  updateTimelineEvent
} from '../../api/timeline';

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

type FormValues = z.infer<typeof formSchema>;

// Extend the TimelineEvent type to include our form fields
type TimelineEventFormData = Omit<TimelineEvent, 'id' | 'status' | 'created_at' | 'updated_at' | 'background_image'> & {
  details?: string;
  background_image?: string; // API expects string or undefined, not null
  nested_events?: Array<Omit<NestedEvent, 'id' | 'timeline_event_id'>>;
};

type UpdateTimelineEventDto = Partial<Omit<TimelineEvent, 'id' | 'status' | 'created_at' | 'updated_at'>> & { 
  id: string;
  details?: string | null;
  background_image?: string | null;
  nested_events?: NestedEvent[];
};

import { ImageUpload } from '../common/ImageUpload';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const defaultValues: FormValues = {
  date: '',
  title: '',
  description: '',
  details: '',
  background_image: null,
  is_published: false,
  era: 'ancient',
  nested_events: [],
};

interface SortableNestedEventProps {
  id: string;
  index: number;
  control: any;
  remove: (index: number) => void;
  register: any;
  errors: any;
}

const SortableNestedEvent: React.FC<SortableNestedEventProps> = ({
  id,
  index,
  control,
  remove,
  register,
  errors,
}) => {
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
    zIndex: isDragging ? 1 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`p-4 border rounded-lg mb-2 bg-card ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="h-10 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`nested_events.${index}.date`}>Date</Label>
              <Input
                id={`nested_events.${index}.date`}
                {...register(`nested_events.${index}.date`)}
                placeholder="e.g., 2023"
              />
              {errors?.nested_events?.[index]?.date && (
                <p className="text-sm text-destructive mt-1">
                  {errors.nested_events[index].date.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor={`nested_events.${index}.title`}>Title</Label>
              <Input
                id={`nested_events.${index}.title`}
                {...register(`nested_events.${index}.title`)}
                placeholder="Event title"
              />
              {errors?.nested_events?.[index]?.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.nested_events[index].title.message}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor={`nested_events.${index}.description`}>Description</Label>
            <Textarea
              id={`nested_events.${index}.description`}
              {...register(`nested_events.${index}.description`)}
              placeholder="Brief description of the event"
              rows={2}
            />
            {errors?.nested_events?.[index]?.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.nested_events[index].description.message}
              </p>
            )}
          </div>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => remove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface TimelineEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: TimelineEvent | null;
  onSuccess: () => void;
}

export default function TimelineEventForm({
  open,
  onOpenChange,
  event,
  onSuccess,
}: TimelineEventFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;
  
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
    } else {
      reset(defaultValues);
    }
  }, [event, reset]);


  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'nested_events',
    keyName: 'nestedId',
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


  const { mutate: createTimelineEventMutation } = useMutation({
    mutationFn: async (formData: Omit<FormValues, 'id'>) => {
      const { nested_events, details, background_image, ...rest } = formData;
      
      // Prepare the data for the API call
      const apiData: TimelineEventFormData = {
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
      const cleanData = Object.fromEntries(
        Object.entries(apiData).filter(([_, v]) => v !== undefined)
      ) as TimelineEventFormData;
      
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
    onError: (error: Error) => {
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
    mutationFn: async (formData: FormValues & { id: string }) => {
      const { nested_events, details, background_image, id, ...rest } = formData;
      
      // Prepare the update data with the ID included
      const updateData: UpdateTimelineEventDto = {
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
    onError: (error: Error) => {
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.nestedId === active.id);
      const newIndex = fields.findIndex((f) => f.nestedId === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
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
    } else {
      createTimelineEventMutation({
        ...data,
        nested_events: data.nested_events?.map((item, index) => ({
          ...item,
          order: index
        })) || []
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setValue('background_image', url);
    setIsUploading(false);
  };

  const handleImageUploadStart = () => {
    setIsUploading(true);
  };

  const handleImageUploadError = (error: string) => {
    toast({
      title: 'Error',
      description: error,
      variant: 'destructive',
    });
    setIsUploading(false);
  };

  const backgroundImage = watch('background_image');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[90vw] max-h-[90vh] flex flex-col p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex-1 overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>
              {event ? 'Edit Timeline Event' : 'Create New Timeline Event'}
            </DialogTitle>
          </DialogHeader>

          <form id="timeline-event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Event title"
                  {...register('title')}
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full"
                />
                {errors.date && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the event"
                  {...register('description')}
                  rows={3}
                  className="w-full"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Background Image (Optional)</Label>
                <div className="mt-1">
                  {backgroundImage ? (
                    <div className="relative group">
                      <img
                        src={backgroundImage}
                        alt="Event background"
                        className="h-40 w-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setValue('background_image', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <ImageUpload
                      folder="timeline"
                      onUpload={handleImageUpload}
                      onError={handleImageUploadError}
                      onStart={handleImageUploadStart}
                    >
                      <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                        {isUploading ? (
                          <div className="animate-pulse text-sm">Uploading...</div>
                        ) : (
                          <>
                            <ImageIcon className="h-6 w-6 mb-1 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </ImageUpload>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="details">Details (Optional)</Label>
                <Textarea
                  id="details"
                  placeholder="Detailed information about the event"
                  {...register('details')}
                  rows={7}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="is_published"
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      id="is_published"
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  )}
                />
                <Label htmlFor="is_published" className="!mt-0">
                  {watch('is_published') ? 'Published' : 'Draft'}
                </Label>
              </div>

              <div>
                <Label htmlFor="era">Era *</Label>
                <select
                  id="era"
                  {...register('era')}
                  className="w-full p-2 border rounded-md focus:ring-accent focus:border-accent"
                >
                  <option value="ancient">Ancient</option>
                  <option value="medieval">Medieval</option>
                  <option value="modern">Modern</option>
                  <option value="future">Future</option>
                </select>
                {errors.era && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.era.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base">Nested Events</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    date: '',
                    title: '',
                    description: '',
                    order: 0,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Nested Event
              </Button>
            </div>

            {fields.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext 
                  items={fields.map((field) => field.nestedId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2 -mr-2">
                    {fields.map((field, index) => (
                      <SortableNestedEvent
                        key={field.nestedId}
                        id={field.nestedId}
                        index={index}
                        control={control}
                        remove={remove}
                        register={register}
                        errors={errors}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center p-4 border-2 border-dashed rounded-md">
                <p className="text-sm text-muted-foreground">
                  No nested events added yet. Add events that are related to this main event.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update' : 'Create'} Event
            </Button>
          </DialogFooter>
          </form>
        </div>
        
        <div className="border-t p-4">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="timeline-event-form">
              {event ? 'Update' : 'Create'} Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
