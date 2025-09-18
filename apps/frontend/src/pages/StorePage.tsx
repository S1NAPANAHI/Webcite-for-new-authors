import React, { useState, useEffect } from 'react';
import { ContentService } from '../../packages/shared/src/services/content';
import { LibraryCard } from '../components/LibraryCard';
import { useAuth } from '../../packages/shared/src/hooks/useAuth';
import { useLibrary } from '../../packages/shared/src/hooks/useLibrary';
import { Database } from '../../packages/shared/src/database.types';
import { Search } from 'lucide-react';

type Book = Database['public']['Tables']['books']['Row'];

export default function StorePage() {
  const { user } = useAuth();
  const { library, addToLibrary } = useLibrary(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const fetchedBooks = await ContentService.getPublishedBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleAddToLibrary = async (bookId: string) => {
    try {
      await addToLibrary('book', bookId);
      // Optionally show a success notification
    } catch (error) {
      console.error('Failed to add to library:', error);
      // Optionally show an error notification
    }
  };

  const isInLibrary = (bookId: string) => {
    return library.some(item => item.work_type === 'book' && item.work_id === bookId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-light to-background text-text-light">
        Loading books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-light to-background text-red-400">
        Error: Failed to edit, 0 occurrences found for old_string (import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { ContentService } from '../../packages/shared/src/services/content';
import { LibraryCard } from '../components/LibraryCard';
import { useAuth } from '../../packages/shared/src/hooks/useAuth';
import { useLibrary } from '../../packages/shared/src/hooks/useLibrary';
import { Database } from '../../packages/shared/src/database.types';
import { Search } from 'lucide-react';

type Book = Database['public']['Tables']['books']['Row'];

interface LibraryPageProps {
  books: Book[];
}

export default function StorePage({ books }: LibraryPageProps) {
  const { user } = useAuth();
  const { library, addToLibrary } = useLibrary(user?.id);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => {
    if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleAddToLibrary = async (bookId: string) => {
    try {
      await addToLibrary('book', bookId);
      // Optionally show a success notification
    } catch (error) {
      console.error('Failed to add to library:', error);
      // Optionally show an error notification
    }
  };

  const isInLibrary = (bookId: string) => {
    return library.some(item => item.work_type === 'book' && item.work_id === bookId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-light to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-heading text-text-light mb-6">
            <span className="text-secondary">Zoroasterverse</span> Library
          </h1>
          <p className="text-xl text-text-light/80 max-w-3xl mx-auto leading-relaxed">
            Discover epic tales of magic, technology, and cosmic adventure.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Search Bar */}
        <div className="bg-background-light/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-border/30">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
            <input
              type="text"
              placeholder="Search for books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredBooks.map(book => (
              <LibraryCard
                key={book.id}
                book={book}
                onAddToLibrary={user ? handleAddToLibrary : undefined}
                inLibrary={isInLibrary(book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-heading text-text-light mb-2">No books found</h3>
            <p className="text-text-dark mb-6">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const books = await ContentService.getPublishedBooks();
    return {
      props: {
        books,
      },
    };
  } catch (error) {
    console.error('Error fetching books for StorePage:', error);
    return {
      props: {
        books: [],
      },
    };
  }
};). Original old_string was (import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { ContentService } from '../../packages/shared/src/services/content';
import { LibraryCard } from '../components/LibraryCard';
import { useAuth } from '../../packages/shared/src/hooks/useAuth';
import { useLibrary } from '../../packages/shared/src/hooks/useLibrary';
import { Database } from '../../packages/shared/src/database.types';
import { Search } from 'lucide-react';

type Book = Database['public']['Tables']['books']['Row'];

interface LibraryPageProps {
  books: Book[];
}

export default function StorePage({ books }: LibraryPageProps) {
  const { user } = useAuth();
  const { library, addToLibrary } = useLibrary(user?.id);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => {
    if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleAddToLibrary = async (bookId: string) => {
    try {
      await addToLibrary('book', bookId);
      // Optionally show a success notification
    } catch (error) {
      console.error('Failed to add to library:', error);
      // Optionally show an error notification
    }
  };

  const isInLibrary = (bookId: string) => {
    return library.some(item => item.work_type === 'book' && item.work_id === bookId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-light to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-heading text-text-light mb-6">
            <span className="text-secondary">Zoroasterverse</span> Library
          </h1>
          <p className="text-xl text-text-light/80 max-w-3xl mx-auto leading-relaxed">
            Discover epic tales of magic, technology, and cosmic adventure.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Search Bar */}
        <div className="bg-background-light/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-border/30">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
            <input
              type="text"
              placeholder="Search for books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredBooks.map(book => (
              <LibraryCard
                key={book.id}
                book={book}
                onAddToLibrary={user ? handleAddToLibrary : undefined}
                inLibrary={isInLibrary(book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-heading text-text-light mb-2">No books found</h3>
            <p className="text-text-dark mb-6">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}