const { supabaseAdmin } = require('../../packages/shared/dist/supabaseAdminClient.js');

async function checkTable() {
  try {
    const { data, error } = await supabaseAdmin
      .from('content_works')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking content_works table:', error);
      return;
    }
    console.log('Successfully accessed content_works table. Data:', data);
  } catch (e) {
    console.error('An unexpected error occurred:', e);
  }
}

checkTable();