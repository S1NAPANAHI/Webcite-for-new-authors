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
import { TimelineEvent } from '@zoroaster/shared';
import {
  createTimelineEvent,
  updateTimelineEvent
} from '../../api/timeline';
import {
  CreateTimelineEventDto,
  UpdateTimelineEventDto
} from '../../types/timeline';
import { ImageUpload } from '../common/ImageUpload';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const nestedEventSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number().default(0),
});

const formSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  details: z.string().optional(),
  background_image: z.string().optional(),
  is_published: z.boolean().default(false),
  nested_events: z.array(nestedEventSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  
  const isEdit = !!event;
  const defaultValues: Partial<FormValues> = {
    title: '',
    description: '',
    details: '',
    background_image: '',
    is_published: false,
    nested_events: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
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

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        details: event.details || '',
        date: event.date,
        background_image: event.background_image || '',
        is_published: event.is_published,
        nested_events: event.nested_events || [],
      });
    } else {
      reset(defaultValues);
    }
  }, [event, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CreateTimelineEventDto) => createTimelineEvent(data),
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
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimelineEventDto }) =>
      updateTimelineEvent(id, data),
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
      setIsSubmitting(false);
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Prepare the data for submission
      const submissionData: CreateTimelineEventDto = {
        title: data.title,
        description: data.description,
        details: data.details,
        date: data.date,
        background_image: data.background_image,
        is_published: data.is_published,
        nested_events: data.nested_events?.map((event, index) => ({
          ...event,
          order: index,
        })),
      };

      if (event) {
        await updateTimelineEvent(event.id, {
          ...submissionData,
          id: event.id,
        });
      } else {
        await createTimelineEvent(submissionData);
      }

      toast({
        title: 'Success',
        description: `Timeline event ${event ? 'updated' : 'created'} successfully.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving timeline event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save timeline event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setValue('background_image', url);
    setIsImageUploading(false);
  };

  const handleImageUploadStart = () => {
    setIsImageUploading(true);
  };

  const handleImageUploadError = (error: string) => {
    toast({
      title: 'Error',
      description: error,
      variant: 'destructive',
    });
    setIsImageUploading(false);
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
              {isEdit ? 'Edit Timeline Event' : 'Create New Timeline Event'}
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
                        {isImageUploading ? (
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
                    order: 0, // Add missing order property
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}

                </>
              ) : isEdit ? (
                'Update Event'
              ) : (
                'Create Event'
              )}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form="timeline-event-form" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
