import { supabase } from '../lib/supabase.js';
import { 
  TimelineEvent, 
  TimelineNestedEvent, 
  CreateTimelineEventDto, 
  UpdateTimelineEventDto,
  ReorderTimelineEventDto,
  TimelineEventListResponse
} from '../types/timeline.js';

const TABLE_NAME = 'timeline_events';
const NESTED_TABLE_NAME = 'timeline_nested_events';

export const fetchTimelineEvents = async ({
  page = 1,
  limit = 10,
  includeUnpublished = false,
}: {
  page?: number;
  limit?: number;
  includeUnpublished?: boolean;
} = {}): Promise<TimelineEventListResponse> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .order('order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching timeline events:', error);
    throw error;
  }

  // Fetch nested events for each timeline event
  const eventsWithNested = await Promise.all(
    (data || []).map(async (event) => {
      const { data: nestedEvents } = await supabase
        .from(NESTED_TABLE_NAME)
        .select('*')
        .eq('timeline_event_id', event.id)
        .order('order', { ascending: true });

      return {
        ...event,
        nestedEvents: nestedEvents || [],
      };
    })
  );

  return {
    data: eventsWithNested as TimelineEvent[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
};

export const fetchTimelineEventById = async (id: string): Promise<TimelineEvent | null> => {
  const { data: event, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching timeline event ${id}:`, error);
    return null;
  }

  const { data: nestedEvents } = await supabase
    .from(NESTED_TABLE_NAME)
    .select('*')
    .eq('timeline_event_id', id)
    .order('order', { ascending: true });

  return {
    ...event,
    nestedEvents: nestedEvents || [],
  } as TimelineEvent;
};

export const createTimelineEvent = async (
  eventData: CreateTimelineEventDto
): Promise<TimelineEvent> => {
  const { nested_events, ...event } = eventData;
  const { data: newEvent, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...event,
      is_published: event.is_published ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating timeline event:', error);
    throw error;
  }

  if (nested_events && nested_events.length > 0) {
    const nestedEventsWithParent = nested_events.map((nested) => ({
      ...nested,
      timeline_event_id: newEvent.id,
    }));

    const { error: nestedError } = await supabase
      .from(NESTED_TABLE_NAME)
      .insert(nestedEventsWithParent);

    if (nestedError) {
      console.error('Error creating nested events:', nestedError);
      await supabase.from(TABLE_NAME).delete().eq('id', newEvent.id);
      throw nestedError;
    }
  }

  return fetchTimelineEventById(newEvent.id) as Promise<TimelineEvent>;
};

export const updateTimelineEvent = async (
  id: string,
  eventData: UpdateTimelineEventDto
): Promise<TimelineEvent> => {
  const { nested_events, ...event } = eventData;

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...event,
      is_published: event.is_published ?? false,
    })
    .eq('id', id);

  if (error) {
    console.error(`Error updating timeline event ${id}:`, error);
    throw error;
  }

  if (nested_events) {
    // First, delete all existing nested events for this timeline event
    const { error: deleteError } = await supabase
      .from(NESTED_TABLE_NAME)
      .delete()
      .eq('timeline_event_id', id);

    if (deleteError) {
      console.error(`Error deleting nested events for timeline event ${id}:`, deleteError);
      throw deleteError;
    }

    // Then insert the updated nested events
    if (nested_events.length > 0) {
      const nestedEventsWithParent = nested_events.map((nested) => ({
        ...nested,
        timeline_event_id: id,
      }));

      const { error: insertError } = await supabase
        .from(NESTED_TABLE_NAME)
        .insert(nestedEventsWithParent);

      if (insertError) {
        console.error('Error updating nested events:', insertError);
        throw insertError;
      }
    }
  }

  return fetchTimelineEventById(id) as Promise<TimelineEvent>;
};

export const deleteTimelineEvent = async (id: string): Promise<void> => {
  // Nested events will be deleted automatically due to ON DELETE CASCADE
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting timeline event ${id}:`, error);
    throw error;
  }
};

export const reorderTimelineEvents = async (
  reorderData: ReorderTimelineEventDto[]
): Promise<void> => {
  const updates = reorderData.map(({ id, order }) =>
    supabase
      .from(TABLE_NAME)
      .update({ order })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    console.error('Error reordering timeline events:', errors);
    throw new Error('Failed to reorder timeline events');
  }
};

export const toggleTimelineEventPublishStatus = async (
  id: string,
  isPublished: boolean
): Promise<TimelineEvent> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ is_published: isPublished })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error toggling publish status for timeline event ${id}:`, error);
    throw error;
  }

  return data as TimelineEvent;
};
