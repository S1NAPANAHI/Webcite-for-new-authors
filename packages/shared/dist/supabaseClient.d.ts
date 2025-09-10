import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
export type { Database };
declare let supabase: ReturnType<typeof createClient<Database>>;
export { supabase };
export default supabase;
//# sourceMappingURL=supabaseClient.d.ts.map