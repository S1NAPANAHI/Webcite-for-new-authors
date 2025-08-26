import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://opukvvmumyegtkukqint.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWt2dm11bXllZ3RrdWtxaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDM3ODQsImV4cCI6MjA3MDg3OTc4NH0.rqMHc03LOI4z5j1V0b0LHeW6J1fCQOiBm-I10tF82_s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateTypes() {
  try {
    // This is a simple test to see if we can connect
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Sample data:', data);
    
    // Generate a basic types file
    const typesPath = join(__dirname, '..', 'packages', 'shared', 'src', 'database.types.ts');
    const typeDefinition = `// Auto-generated types
    
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
      // Add other tables as needed
    };
  };
};
    `;
    
    writeFileSync(typesPath, typeDefinition);
    console.log(`Types written to ${typesPath}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generateTypes();
