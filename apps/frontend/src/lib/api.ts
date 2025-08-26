import { createClient } from '@supabase/supabase-js';
import type { PostgrestSingleResponse } from '@supabase/postgrest-js';

// Use the same environment variable names as in supabaseClient.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ITimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  details?: string;
  background_image?: string;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  nested_events?: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    order: number;
  }>;
}

export type TimelineEvent = ITimelineEvent;

export const fetchTimelineEvents = async (): Promise<TimelineEvent[]> => {
  const { data: events, error } = await supabase
    .from('timeline_events')
    .select(`
      *,
      timeline_nested_events (
        id,
        date,
        title,
        description,
        "order"
      )
    `)
    .eq('is_published', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching timeline events:', error);
    return [];
  }

  return events;
};
