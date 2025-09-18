import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '@zoroaster/shared/database.types';

type Book = Database['public']['Tables']['books']['Row'];

interface LibraryCardProps {
  book: Book;
  onAddToLibrary?: (bookId: string) => void;
  inLibrary?: boolean;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  book,
  onAddToLibrary,
  inLibrary = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {book.cover_image && (
        <div className="aspect-[3/4] relative">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>

        {book.subtitle && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{book.subtitle}</p>
        )}

        {book.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{book.description}</p>
        )}

        <div className="flex justify-between items-center">
          <Link
            to={`/library/books/${book.slug}`}            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>

          {onAddToLibrary && !inLibrary && (
            <button
              onClick={() => onAddToLibrary(book.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Add to Library
            </button>
          )}

          {inLibrary && (
            <span className="text-green-600 font-medium">✓ In Library</span>
          )}
        </div>
      </div>
    </div>
  );
};
