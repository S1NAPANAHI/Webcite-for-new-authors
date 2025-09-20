import React from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
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
  type?: string;
  average_rating?: number;
  rating_count?: number;
  completion_percentage?: number;
}

interface LibraryCardProps {
  book?: Book;
  work?: Work;
  item?: any; // For compatibility with existing code
  onAddToLibrary?: (itemId: string) => void;
  inLibrary?: boolean;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  book,
  work,
  item,
  onAddToLibrary,
  inLibrary = false,
}) => {
  // Support multiple object types - prioritize the item prop for compatibility
  const finalItem = item || book || work;
  if (!finalItem) return null;
  
  // Get cover URL using the utility hook - try cover_file_id first, then fallback to cover_image_url
  const coverUrlFromFile = useFileUrl(finalItem.cover_file_id);
  const coverUrl = coverUrlFromFile || finalItem.cover_image_url || finalItem.cover_image || null;
  
  console.log('🎨 LIBRARY CARD COVER DEBUG:', {
    id: finalItem.id,
    title: finalItem.title,
    cover_file_id: finalItem.cover_file_id,
    cover_image_url: finalItem.cover_image_url,
    resolved_from_file: coverUrlFromFile,
    final_cover_url: coverUrl
  });
  
  const itemLink = book 
    ? `/library/books/${book.slug}` 
    : `/library/${finalItem.type}/${finalItem.slug}`;
    
  return (
    <Link to={itemLink} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-[1.02]">
        {/* Cover Image */}
        <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={finalItem.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              onLoad={() => console.log('✅ Library card cover loaded:', coverUrl)}
              onError={(e) => {
                console.error('❌ Library card cover failed to load:', coverUrl);
                // Show fallback icon instead of broken image
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                  fallbackDiv.innerHTML = `
                    <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                    </svg>
                  `;
                  container.appendChild(fallbackDiv);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <BookOpen className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Overlay for hover effect */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
            {finalItem.title}
          </h3>

          {(book?.subtitle || finalItem.subtitle) && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {book?.subtitle || finalItem.subtitle}
            </p>
          )}

          {(book?.description || work?.description || finalItem.description) && (
            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {book?.description || work?.description || finalItem.description}
            </p>
          )}
          
          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {finalItem.average_rating && finalItem.rating_count && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{finalItem.average_rating.toFixed(1)} ({finalItem.rating_count})</span>
              </div>
            )}
            
            {finalItem.completion_percentage !== undefined && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-200"
                    style={{ width: `${finalItem.completion_percentage}%` }}
                  />
                </div>
                <span>{finalItem.completion_percentage}%</span>
              </div>
            )}
            
            <span className="capitalize text-indigo-600 font-medium">
              {finalItem.type || 'content'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <div className="text-indigo-600 font-medium text-sm group-hover:text-indigo-700 transition-colors">
              View Details →
            </div>

            {onAddToLibrary && !inLibrary && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToLibrary(finalItem.id);
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
              >
                + Library
              </button>
            )}

            {inLibrary && (
              <span className="text-green-600 font-medium text-xs flex items-center">
                ✓ In Library
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LibraryCard;