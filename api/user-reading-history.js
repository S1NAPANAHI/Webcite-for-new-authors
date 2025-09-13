const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../apps/backend/.env') });
} catch (e) {
  require('dotenv').config();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id parameter.' });
  }

  // --- Authentication and Authorization ---
  // In a real application, you would verify the user's token here
  // to ensure they are authorized to view this user_id's history.
  // For now, we'll proceed assuming the user_id is valid.

  try {
    const { data, error } = await supabase
      .from('user_reading_history')
      .select(`
        id,
        content_id,
        content_type,
        progress,
        last_read_position,
        is_completed,
        last_read_at,
        products (
          name,
          description,
          cover_image_url,
          product_type
        ),
        works (
          title,
          author_id
        )
      `)
      .eq('user_id', user_id)
      .order('last_read_at', { ascending: false });

    if (error) {
      console.error('Error fetching user reading history:', error);
      throw error;
    }

    // Map data to a more usable format
    const readingHistory = data.map(item => ({
      id: item.id,
      contentId: item.content_id,
      contentType: item.content_type,
      progress: item.progress,
      lastReadPosition: item.last_read_position,
      isCompleted: item.is_completed,
      lastReadAt: item.last_read_at,
      bookTitle: item.products?.name || item.works?.title || 'Unknown Title',
      bookDescription: item.products?.description || '',
      coverImageUrl: item.products?.cover_image_url || '',
      bookType: item.products?.product_type || item.works?.type || 'Unknown Type',
      // You might need to fetch author name separately if author_id is not directly a name
      author: item.works?.author_id || 'Unknown Author', // Placeholder
    }));

    res.status(200).json({ readingHistory });

  } catch (error) {
    console.error('Error in user-reading-history API:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
