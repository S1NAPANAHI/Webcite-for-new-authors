import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, UploadCloud, Book } from 'lucide-react'; // Added Book icon

// Define types
type Book = {
  id: string;
  title: string;
};

const fetchBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase.from('books').select('id, title');
  if (error) throw new Error(error.message);
  return data as Book[];
};

// Mutation to create a new book
const createBook = async (newBookTitle: string): Promise<Book> => {
  const { data, error } = await supabase.from('books').insert({ title: newBookTitle }).select();
  if (error) throw new Error(error.message);
  return data[0] as Book;
};

export const ChapterUploadPage: React.FC = () => {
  const queryClient = useQueryClient(); // Initialize queryClient
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chapterTitle, setChapterTitle] = useState(''); // Renamed to avoid conflict
  const [chapterNumber, setChapterNumber] = useState<number | ''>(1);
  const [bookId, setBookId] = useState('');
  const [newBookTitle, setNewBookTitle] = useState(''); // State for new book title
  const [isPublished, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: books, isLoading: isLoadingBooks, isError: isErrorBooks, error: booksError } = useQuery<Book[]>({ queryKey: ['books'], queryFn: fetchBooks });

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: (newBook) => {
      queryClient.invalidateQueries({ queryKey: ['books'] }); // Refetch books after creation
      setBookId(newBook.id); // Select the newly created book
      setNewBookTitle(''); // Clear new book title input
      toast.success(`Book "${newBook.title}" created successfully!`);
    },
    onError: (err: Error) => {
      toast.error(`Error creating book: ${err.message}`);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !chapterTitle || !chapterNumber) {
      toast.error('Please fill in all required chapter fields and select a file.');
      return;
    }

    let currentBookId = bookId;

    // If a new book title is provided, create the book first
    if (newBookTitle) {
      if (createBookMutation.isPending) {
        toast.error('Book creation is already in progress. Please wait.');
        return;
      }
      try {
        const newBook = await createBookMutation.mutateAsync(newBookTitle);
        currentBookId = newBook.id;
      } catch (err) {
        // Error handled by mutation's onError
        return;
      }
    }

    if (!currentBookId) {
      toast.error('Please select an existing book or create a new one.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', chapterTitle); // Use chapterTitle
    formData.append('chapter_number', chapterNumber.toString());
    formData.append('book_id', currentBookId); // Use currentBookId
    formData.append('is_published', isPublished.toString());

    try {
      // Get the user's session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.error('User session not found. Please log in.');
        setUploading(false);
        return;
      }

      const response = await fetch('/api/chapters/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.access_token}`, // Include the JWT token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to upload chapter.');
      }

      await response.json();
      toast.success('Chapter uploaded successfully!');
      // Reset form
      setSelectedFile(null);
      setChapterTitle('');
      setChapterNumber(1);
      setBookId('');
      setNewBookTitle('');
      setIsPublished(false);
      if (event.target instanceof HTMLFormElement) {
        event.target.reset(); // Reset file input
      }
    } catch (err: Error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoadingBooks) return <div className="text-center py-8">Loading books...</div>;
  if (isErrorBooks) return <div className="text-center py-8 text-red-500">Error loading books: {booksError?.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload New Chapter</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Chapter File (PDF, DOCX, TXT, HTML)</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.docx,.txt,.html"
              required
            />
            {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="chapterTitle" className="block text-sm font-medium text-gray-700 mb-2">Chapter Title</label>
            <input
              type="text"
              id="chapterTitle"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="chapterNumber" className="block text-sm font-medium text-gray-700 mb-2">Chapter Number</label>
            <input
              type="number"
              id="chapterNumber"
              value={chapterNumber}
              onChange={(e) => setChapterNumber(parseInt(e.target.value) || '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-2">Select Existing Book</label>
            <select
              id="bookId"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Book --</option>
              {books?.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex items-center">
            <span className="text-gray-500 mr-2">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="mb-4">
            <label htmlFor="newBookTitle" className="block text-sm font-medium text-gray-700 mb-2">Create New Book</label>
            <input
              type="text"
              id="newBookTitle"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new book title"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Publish Immediately</label>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading || createBookMutation.isPending}
          >
            {uploading ? (
              <>
                <UploadCloud className="w-4 h-4 animate-pulse" />
                Uploading Chapter...
              </>
            ) : createBookMutation.isPending ? (
              <>
                <Book className="w-4 h-4 animate-pulse" />
                Creating Book...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Upload Chapter
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};


