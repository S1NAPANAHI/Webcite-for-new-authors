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
    date: string;
    title: string;
    description: string;
  }>;
  background_image?: string;
  age_id?: number;
  book_id?: number;
  glyph?: string;
  saga_arc?: string;
  issue_reference?: string;
}

// API Functions
export async function fetchAges(): Promise<Age[]> {
  try {
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
  } catch (error) {
    console.error('Error in fetchEventsByAge:', error);
    throw error;
  }
}
