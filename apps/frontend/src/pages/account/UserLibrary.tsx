import React from 'react';
import { useAuth } from '@zoroaster/shared/hooks/useAuth';
import { useLibrary } from '@zoroaster/shared/hooks/useLibrary';
import { LibraryCard } from '../../components/LibraryCard';
import { BookOpen } from 'lucide-react';

export const UserLibrary: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { libraryBooks, loading: libraryLoading } = useLibrary(user?.id);

  if (authLoading || libraryLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading Your Library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">My Library</h1>
        <p className="text-gray-400 mt-1">All the books you have saved.</p>
      </div>

      {libraryBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryBooks.map(book => (
            <LibraryCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">Your library is empty</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Browse the library and add books to see them here.
          </p>
        </div>
      )}
    </div>
  );
};