const { createClient } = require('@supabase/supabase-js');

async function checkSubscriptionTable() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    // Check if table exists
    const { data: tableExists, error: tableError } = await supabase
      .rpc('table_exists', { table_name: 'subscriptions' });
    
    console.log('Table exists:', tableExists);
    
    if (!tableExists) {
      console.log('Error: subscriptions table does not exist');
      return;
    }

    // Check RLS status
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('table_has_rls', { table_name: 'subscriptions' });
    
    console.log('RLS enabled:', rlsStatus);

    // Check if we can query the table
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying subscriptions table:', error);
    } else {
      console.log('Successfully queried subscriptions table');
      console.log('Sample data:', data);
    }

  } catch (err) {
    console.error('Error checking subscription table:', err);
  }
}

checkSubscriptionTable();
