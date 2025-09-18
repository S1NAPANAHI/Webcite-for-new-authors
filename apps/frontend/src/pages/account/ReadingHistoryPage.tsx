import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@zoroaster/shared/AuthContext'; // Assuming this path is correct
import { BookOpen } from 'lucide-react';

// Define types for reading history item
type ReadingHistoryItem = {
  id: string;
  contentId: string;
  contentType: string;
  progress: number;
  lastReadPosition: any; // Adjust type as needed
  isCompleted: boolean;
  lastReadAt: string;
  bookTitle: string;
  bookDescription?: string;
  coverImageUrl?: string;
  bookType?: string;
  author?: string;
};

const ReadingHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed'>('all');

  const { data: readingHistory, isLoading, isError, error } = useQuery<ReadingHistoryItem[]>({ // Changed from any to ReadingHistoryItem[]
    queryKey: ['userReadingHistory', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/user-reading-history?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reading history');
      }
      const data = await response.json();
      return data.readingHistory;
    },
    enabled: !!user?.id, // Only run query if user is logged in
  });

  const filteredBooks = readingHistory?.filter(book => {
    if (activeTab === 'all') return true;
    if (activeTab === 'reading') return book.progress < 1;
    return book.progress === 1;
  }) || [];

  if (isLoading) return <div className="text-center py-8 text-gray-400">Loading reading history...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Error loading reading history: {error?.message}</div>;

  return (
    <div className="text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Reading History</h1>
      <p className="text-lg mb-8">Track your reading progress and history.</p>

      <div className="flex space-x-2 mb-6 p-1 bg-gray-800/50 rounded-lg">
        {[
          { id: 'all', label: 'All Books' },
          { id: 'reading', label: 'Currently Reading' },
          { id: 'completed', label: 'Completed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} className="bg-gray-800/50 rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 flex-shrink-0">
                    <div className="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={book.coverImageUrl || 'https://via.placeholder.com/150x225?text=No+Cover'}
                        alt={book.bookTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{book.bookTitle}</h3>
                            <p className="text-gray-400">{book.author}</p>
                          </div>
                          <span className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                            {book.bookType}
                          </span>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Progress: {Math.round(book.progress * 100)}%</span>
                            {/* Page info is not directly available from user_reading_history, so we'll omit for now or derive from lastReadPosition */}
                            {/* <span>Page {book.currentPage} of {book.totalPages}</span> */}
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${book.progress * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Last read {new Date(book.lastReadAt).toLocaleDateString()}</span>
                        <div className="flex space-x-2">
                          <a
                            href={`/apps/frontend/src/reader/reader.html?book=${book.contentId}`}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                          >
                            {book.isCompleted ? 'Read Again' : 'Continue Reading'}
                          </a>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl">
            <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No books found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {activeTab === 'all'
                ? "You haven't added any books to your library yet."
                : activeTab === 'reading'
                ? "You don't have any books in progress."
                : "You haven't completed any books yet."}
            </p>
            <a href="/library" className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors">
              Browse Library
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistoryPage;