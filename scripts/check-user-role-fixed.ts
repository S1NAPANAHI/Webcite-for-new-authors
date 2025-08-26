import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Load environment variables from .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.log('Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserRole(email: string) {
  try {
    // 1. Get user by email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);

    if (userError || !users || users.length === 0) {
      console.error('Error finding user:', userError?.message || 'No user found');
      return;
    }

    const user = users[0];
    console.log('\n=== User Profile ===');
    console.log('ID:', user.id);
    console.log('Email:', email);
    console.log('Role:', user.role);
    console.log('Created At:', user.created_at);

    // 2. Check user_roles table for additional roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);

    console.log('\n=== User Roles ===');
    if (rolesError || !userRoles || userRoles.length === 0) {
      console.log('No additional roles found in user_roles table');
    } else {
      console.log('Roles from user_roles table:');
      userRoles.forEach(role => {
        console.log(`- ${role.role} (granted by: ${role.granted_by})`);
      });
    }

    // 3. Check if user is admin based on database values
    const isAdmin = user.role === 'admin' || user.role === 'super_admin' || 
                   userRoles.some(r => r.role === 'admin' || r.role === 'super_admin');

    console.log('\n=== Admin Status ===');
    console.log('Is Admin:', isAdmin);
    console.log('\n=== Debug Info ===');
    console.log('Profile role type:', typeof user.role);
    console.log('Profile role value:', JSON.stringify(user.role));

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Replace with your email
const userEmail = 'sina.panahi200@gmail.com';
console.log(`Checking role for user: ${userEmail}`);
checkUserRole(userEmail);
