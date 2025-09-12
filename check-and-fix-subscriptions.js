const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkAndFixSubscriptions() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if the column exists
    const { data: columnExists } = await supabase
      .rpc('column_exists', { 
        table_name: 'subscriptions', 
        column_name: 'current_period_end' 
      });

    if (!columnExists) {
      console.log('Adding current_period_end column to subscriptions table...');
      
      // Add the column
      const { data, error } = await supabase.rpc('add_current_period_end_column');
      
      if (error) {
        console.error('Error adding column:', error);
      } else {
        console.log('Successfully added current_period_end column');
      }
    } else {
      console.log('current_period_end column already exists');
    }
  } catch (error) {
    console.error('Error checking/adding column:', error);
  }
}

checkAndFixSubscriptions();
