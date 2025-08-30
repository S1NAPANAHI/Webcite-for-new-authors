import { createClient } from '@supabase/supabase-js';
// Use the same environment variable names as in supabaseClient.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const fetchTimelineEvents = async () => {
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
//# sourceMappingURL=api.js.map