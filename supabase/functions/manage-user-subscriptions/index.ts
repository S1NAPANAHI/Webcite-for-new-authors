import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  console.log('Edge Function started.'); // Added log

  if (req.method !== 'POST') {
    console.log('Method not POST.'); // Added log
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  const { userId, action, data, targetUserId, newRole } = await req.json()
  console.log('Request body parsed:', { userId, action, data, targetUserId, newRole }); // Added log

  // Create a Supabase client with the service role key
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  console.log('Supabase admin client created.'); // Added log

  try {
    let result;
    if (action === 'updateSubscription') {
      console.log('Action: updateSubscription'); // Added log
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update(data)
        .eq('user_id', userId);

      if (error) {
        console.error('updateSubscription error:', error.message); // Added log
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      result = { success: true, message: 'Subscription updated successfully' };
    } else if (action === 'changeRole') {
      console.log('Action: changeRole'); // Added log
      // Update profiles for role and display_name
      const updateData: { role: string; display_name?: string } = { role: newRole };
      if (data && data.display_name !== undefined) {
        updateData.display_name = data.display_name;
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', targetUserId);

      if (error) {
        console.error('changeRole error:', error.message); // Added log
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      result = { success: true, message: 'User role and/or display name updated successfully' };
    } else if (action === 'deleteUser') {
      console.log('Action: deleteUser'); // Added log
      console.log('Attempting to delete subscriptions for user:', targetUserId); // Added log
      // Delete from user_subscriptions first
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .delete()
        .eq('user_id', targetUserId);
      if (subError) {
        console.error('deleteUser - subError:', subError.message); // Added log
        return new Response(JSON.stringify({ error: subError.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      console.log('Subscriptions deleted successfully.'); // Added log

      console.log('Attempting to delete user profile for user:', targetUserId); // Added log
      // Then delete from profiles
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', targetUserId);
      if (profileError) {
        console.error('deleteUser - profileError:', profileError.message); // Added log
        return new Response(JSON.stringify({ error: profileError.message }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      console.log('User profile deleted successfully.'); // Added log

      result = { success: true, message: 'User and associated data deleted successfully' };
    } else if (action === 'addProfile') {
        console.log('Action: addProfile'); // Added log
        const newUserId = crypto.randomUUID(); // Generate a new UUID
        console.log('Generated new user ID:', newUserId); // Added log

        // Insert into profiles
        const { error: userProfileInsertError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: newUserId,
                username: data.username,
                role: data.role
            });
        if (userProfileInsertError) {
            console.error('addProfile - userProfileInsertError:', userProfileInsertError.message); // Added log
            return new Response(JSON.stringify({ error: userProfileInsertError.message }), {
              headers: { 'Content-Type': 'application/json' },
              status: 500,
            });
        }
        console.log('User profile inserted.'); // Added log

        result = { success: true, message: 'User profile added successfully' };
    }
    else {
      console.log('Invalid action:', action); // Added log
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log('Returning successful response:', result); // Added log
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Edge Function caught unhandled error:', error); // Log the full error object
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})