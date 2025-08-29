import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
declare let supabase: ReturnType<typeof createClient<Database>>;
export { supabase };
export default supabase;
