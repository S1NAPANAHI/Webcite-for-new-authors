import { useState, useEffect } from 'react';
import { ContentService } from '../services/content';
import { Tables } from '../database.types';

export function useLibrary(userId?: string) {
  const [libraryBooks, setLibraryBooks] = useState<Tables<'content_items'>[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLibrary = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch the user's library using the RPC function
      const { data: libraryItems, error } = await supabase.rpc('get_user_library_with_progress', { user_id: userId });

      if (error) throw error;

      // 2. Filter for books and extract their content_item_ids
      const bookIds = libraryItems
        .filter(item => item.item_type === 'book')
        .map(item => item.content_item_id);

      // 3. Fetch the full book details for those IDs
      if (bookIds.length > 0) {
        const books = await ContentService.getBooksByIds(bookIds);
        setLibraryBooks(books);
      } else {
        setLibraryBooks([]);
      }

    } catch (error) {
      console.error('Error loading library books:', error);
      setLibraryBooks([]); // Clear library on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [userId]);

  const addToLibrary = async (
    contentItemId: string
  ) => {
    if (!userId) return;

    try {
      await ContentService.addToLibrary(userId, contentItemId);
      await loadLibrary(); // Refresh library after adding
    } catch (error) {
      console.error('Error adding to library:', error);
      throw error;
    }
  };

  // Helper to check if a book is in the library
  const isBookInLibrary = (bookId: string) => {
    return libraryBooks.some(book => book.id === bookId);
  };

  return {
    libraryBooks,
    loading,
    addToLibrary,
    isBookInLibrary,
    refetch: loadLibrary,
  };
}