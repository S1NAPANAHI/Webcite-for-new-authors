import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '@zoroaster/shared/database.types';
import { useFileUrl } from '../utils/fileUrls';

type Book = Database['public']['Tables']['books']['Row'];

interface Work {
  id: string;
  title: string;
  cover_file_id?: string | null;
  cover_image_url?: string | null;
  description?: string | null;
  slug: string;
}

interface LibraryCardProps {
  book?: Book;
  work?: Work;
  onAddToLibrary?: (itemId: string) => void;
  inLibrary?: boolean;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  book,
  work,
  onAddToLibrary,
  inLibrary = false,
}) => {
  // Support both book and work objects
  const item = book || work;
  if (!item) return null;
  
  // Get cover URL using the utility hook for works with cover_file_id
  const coverUrlFromFile = useFileUrl(work?.cover_file_id);
  const coverUrl = coverUrlFromFile || work?.cover_image_url || (book as any)?.cover_image || null;
  
  const itemLink = book 
    ? `/library/books/${book.slug}` 
    : `/library/works/${work?.slug}`;
    
  return (
    <div className="work-card">
      {/* Cover Image */}
      <div
        className="work-cover"
        style={{
          backgroundImage: coverUrl ? `url(${coverUrl})` : 'linear-gradient(135deg, #f1f5f9, #f8fafc)'
        }}
      />
      
      <div className="work-body">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>

        {book?.subtitle && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{book.subtitle}</p>
        )}

        {(book?.description || work?.description) && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {book?.description || work?.description}
          </p>
        )}

        <div className="flex justify-between items-center">
          <Link
            to={itemLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>

          {onAddToLibrary && !inLibrary && (
            <button
              onClick={() => onAddToLibrary(item.id)}
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