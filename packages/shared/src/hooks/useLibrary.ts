import { useState, useEffect } from 'react';
import { ContentService } from '../services/content';
import { Database } from '../database.types';

type Book = Database['public']['Tables']['books']['Row'];

export function useLibrary(userId?: string) {
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLibrary = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch the user's library (which contains IDs)
      const libraryItems = await ContentService.getUserLibrary(userId);

      // 2. Filter for books and extract their IDs
      const bookIds = libraryItems
        .filter(item => item.work_type === 'book')
        .map(item => item.work_id);

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
    workType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter',
    workId: string
  ) => {
    if (!userId) return;

    try {
      await ContentService.addToLibrary(userId, workType, workId);
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