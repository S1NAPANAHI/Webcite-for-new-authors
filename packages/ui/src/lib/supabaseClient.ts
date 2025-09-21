// create once, re-use everywhere
import { createClient } from '@supabase/supabase-js';

declare global {
  /* eslint-disable no-var */
  var __sbClient__: ReturnType<typeof createClient> | undefined;
}

if (!globalThis.__sbClient__) {
  globalThis.__sbClient__ = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );
}

export const supabase = globalThis.__sbClient__;