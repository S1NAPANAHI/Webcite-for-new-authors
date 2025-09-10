const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkSubscriptionsTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .rpc('table_exists', { table_name: 'subscriptions' });

    if (tableError) {
      console.error('Error checking if table exists:', tableError);
      return;
    }

    if (!tableExists) {
      console.log('Subscriptions table does not exist');
      return;
    }

    console.log('Subscriptions table exists');

    // Check the table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'subscriptions' });

    if (columnsError) {
      console.error('Error getting table columns:', columnsError);
      return;
    }

    console.log('Table columns:', columns);

    // Check if current_period_end column exists
    const hasPeriodEnd = columns.some(col => col.column_name === 'current_period_end');
    console.log('Has current_period_end column:', hasPeriodEnd);

  } catch (error) {
    console.error('Error checking subscriptions table:', error);
  }
}

// Create the required PostgreSQL functions if they don't exist
async function createRequiredFunctions() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create table_exists function if it doesn't exist
    await supabase.rpc('create_or_replace_function', {
      function_name: 'table_exists',
      function_definition: `
      CREATE OR REPLACE FUNCTION table_exists(table_name text)
      RETURNS boolean AS $$
      BEGIN
        RETURN (
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = $1
          )
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    // Create get_table_columns function if it doesn't exist
    await supabase.rpc('create_or_replace_function', {
      function_name: 'get_table_columns',
      function_definition: `
      CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
      RETURNS TABLE (
        column_name text,
        data_type text,
        is_nullable text,
        column_default text
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          c.column_name::text,
          c.data_type::text,
          c.is_nullable::text,
          c.column_default::text
        FROM 
          information_schema.columns c
        WHERE 
          c.table_schema = 'public'
          AND c.table_name = $1
        ORDER BY 
          c.ordinal_position;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    console.log('Required database functions created/updated');
  } catch (error) {
    console.error('Error creating database functions:', error);
  }
}

// Run the checks
async function main() {
  await createRequiredFunctions();
  await checkSubscriptionsTable();
}

main();
