import { supabase } from './supabase'; // Adjust this import to your supabase client location

// Type definitions for the new timeline system
export interface Age {
  id: number;
  age_number: number;
  name: string;
  title: string;
  glyph: string;
  color_code: string;
  description?: string;
  start_year?: number;
  end_year?: number;
  image_url?: string;
  image_alt?: string;
  created_at: string;
}

export interface Book {
  id: number;
  book_number: number;
  title: string;
  glyph: string;
  color_code: string;
  description?: string;
  span_ages?: number[]; // Array of age numbers this book spans
  created_at: string;
}

export interface BookAgeSpan {
  id: number;
  book_id: number;
  age_id: number;
}

// Extended TimelineEvent interface
export interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  details?: string;
  nested_events?: Array<{
    id?: string;
    date: string;
    title: string;
    description: string;
    image_url?: string;
    image_alt?: string;
    order_index?: number;
  }>;
  background_image?: string;
  image_alt?: string;
  age_id?: number;
  book_id?: number;
  glyph?: string;
  saga_arc?: string;
  issue_reference?: string;
  era?: string;
  order_index?: number;
}

// Timeline Era interface (for the new era-based system)
export interface TimelineEra {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  background_color?: string;
  text_color?: string;
  image_url?: string;
  image_alt?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// API Functions
export async function fetchAges(): Promise<Age[]> {
  try {
    // First try the new timeline_eras table
    const { data: erasData, error: erasError } = await supabase
      .from('timeline_eras')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (!erasError && erasData && erasData.length > 0) {
      // Convert eras to Age format for backward compatibility
      return erasData.map((era, index) => ({
        id: index + 1,
        age_number: era.order_index,
        name: era.name,
        title: era.name,
        glyph: 'default', // You may want to add glyph mapping
        color_code: era.background_color || '#6b58c4',
        description: era.description,
        start_year: era.start_date ? parseInt(era.start_date.replace(/\D/g, '')) || undefined : undefined,
        end_year: era.end_date ? parseInt(era.end_date.replace(/\D/g, '')) || undefined : undefined,
        image_url: era.image_url,
        image_alt: era.image_alt,
        created_at: era.created_at
      }));
    }

    // Fallback to old ages table
    const { data, error } = await supabase
      .from('ages')
      .select('*')
      .order('age_number');

    if (error) {
      console.error('Supabase error fetching ages:', error);
      throw new Error(`Failed to fetch ages: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchAges:', error);
    throw error;
  }
}

export async function fetchBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_age_spans(
          age_id,
          ages(age_number)
        )
      `)
      .order('book_number');

    if (error) {
      console.error('Supabase error fetching books:', error);
      throw new Error(`Failed to fetch books: ${error.message}`);
    }

    // Transform the data to include span_ages array
    const booksWithSpans = (data || []).map(book => ({
      ...book,
      span_ages: book.book_age_spans?.map((span: any) => span.ages?.age_number).filter(Boolean) || []
    }));

    return booksWithSpans;
  } catch (error) {
    console.error('Error in fetchBooks:', error);
    throw error;
  }
}

export async function fetchEventsByAge(ageId: number): Promise<TimelineEvent[]> {
  try {
    if (!ageId) return [];

    // First, get the era name for this age
    const { data: erasData } = await supabase
      .from('timeline_eras')
      .select('name')
      .eq('order_index', ageId)
      .single();

    if (!erasData) {
      // Fallback to old system
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('age_id', ageId)
        .order('date');

      if (error) {
        console.error('Supabase error fetching events:', error);
        throw new Error(`Failed to fetch events: ${error.message}`);
      }

      return data || [];
    }

    // New era-based system
    const { data, error } = await supabase
      .from('timeline_events')
      .select(`
        *,
        timeline_nested_events(
          id,
          title,
          description,
          date,
          image_url,
          image_alt,
          order_index
        )
      `)
      .eq('era', erasData.name)
      .eq('is_published', true)
      .order('order_index');

    if (error) {
      console.error('Supabase error fetching events:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    // Transform nested events
    const eventsWithNested = (data || []).map(event => ({
      ...event,
      nested_events: event.timeline_nested_events?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || []
    }));

    return eventsWithNested;
  } catch (error) {
    console.error('Error in fetchEventsByAge:', error);
    throw error;
  }
}

// New functions for era management
export async function fetchTimelineEras(): Promise<TimelineEra[]> {
  try {
    const { data, error } = await supabase
      .from('timeline_eras')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (error) {
      console.error('Supabase error fetching eras:', error);
      throw new Error(`Failed to fetch eras: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchTimelineEras:', error);
    throw error;
  }
}

export async function fetchEventsByEra(eraName: string): Promise<TimelineEvent[]> {
  try {
    const { data, error } = await supabase
      .from('timeline_events')
      .select(`
        *,
        timeline_nested_events(
          id,
          title,
          description,
          date,
          image_url,
          image_alt,
          order_index
        )
      `)
      .eq('era', eraName)
      .eq('is_published', true)
      .order('order_index');

    if (error) {
      console.error('Supabase error fetching events by era:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    // Transform nested events
    const eventsWithNested = (data || []).map(event => ({
      ...event,
      nested_events: event.timeline_nested_events?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || []
    }));

    return eventsWithNested;
  } catch (error) {
    console.error('Error in fetchEventsByEra:', error);
    throw error;
  }
}