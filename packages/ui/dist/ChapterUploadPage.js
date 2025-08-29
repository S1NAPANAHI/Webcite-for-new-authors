import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, UploadCloud, Book } from 'lucide-react'; // Added Book icon
const fetchBooks = async () => {
    const { data, error } = await supabase.from('works').select('id, title');
    if (error)
        throw new Error(error.message);
    return data;
};
// Mutation to create a new book
const createBook = async (newBookTitle) => {
    const { data, error } = await supabase.from('works').insert({ title: newBookTitle, type: 'book' }).select();
    if (error)
        throw new Error(error.message);
    return data[0];
};
export const ChapterUploadPage = () => {
    const queryClient = useQueryClient(); // Initialize queryClient
    const [selectedFile, setSelectedFile] = useState(null);
    const [chapterTitle, setChapterTitle] = useState(''); // Renamed to avoid conflict
    const [chapterNumber, setChapterNumber] = useState(1);
    const [bookId, setBookId] = useState('');
    const [newBookTitle, setNewBookTitle] = useState(''); // State for new book title
    const [isPublished, setIsPublished] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { data: books, isLoading: isLoadingBooks, isError: isErrorBooks, error: booksError } = useQuery({ queryKey: ['books'], queryFn: fetchBooks });
    const createBookMutation = useMutation({
        mutationFn: createBook,
        onSuccess: (newBook) => {
            queryClient.invalidateQueries({ queryKey: ['books'] }); // Refetch books after creation
            setBookId(newBook.id); // Select the newly created book
            setNewBookTitle(''); // Clear new book title input
            toast.success(`Book "${newBook.title}" created successfully!`);
        },
        onError: (err) => {
            toast.error(`Error creating book: ${err.message}`);
        },
    });
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    const handleSubmit = async (event) => {
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
            }
            catch (err) {
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
        }
        catch (err) {
            console.error('Upload error:', err);
            toast.error(err.message || 'An error occurred during upload.');
        }
        finally {
            setUploading(false);
        }
    };
    if (isLoadingBooks)
        return _jsx("div", { className: "text-center py-8", children: "Loading books..." });
    if (isErrorBooks)
        return _jsxs("div", { className: "text-center py-8 text-red-500", children: ["Error loading books: ", booksError?.message] });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx(Toaster, {}), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Upload New Chapter" }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "file", className: "block text-sm font-medium text-gray-700 mb-2", children: "Chapter File (PDF, DOCX, TXT, HTML)" }), _jsx("input", { type: "file", id: "file", onChange: handleFileChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", accept: ".pdf,.docx,.txt,.html", required: true }), selectedFile && _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Selected file: ", selectedFile.name] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "chapterTitle", className: "block text-sm font-medium text-gray-700 mb-2", children: "Chapter Title" }), _jsx("input", { type: "text", id: "chapterTitle", value: chapterTitle, onChange: (e) => setChapterTitle(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "chapterNumber", className: "block text-sm font-medium text-gray-700 mb-2", children: "Chapter Number" }), _jsx("input", { type: "number", id: "chapterNumber", value: chapterNumber, onChange: (e) => setChapterNumber(parseInt(e.target.value) || ''), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, min: "1" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "bookId", className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Existing Book" }), _jsxs("select", { id: "bookId", value: bookId, onChange: (e) => setBookId(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "-- Select a Book --" }), books?.map((book) => (_jsx("option", { value: book.id, children: book.title }, book.id)))] })] }), _jsxs("div", { className: "mb-4 flex items-center", children: [_jsx("span", { className: "text-gray-500 mr-2", children: "OR" }), _jsx("div", { className: "flex-grow border-t border-gray-300" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "newBookTitle", className: "block text-sm font-medium text-gray-700 mb-2", children: "Create New Book" }), _jsx("input", { type: "text", id: "newBookTitle", value: newBookTitle, onChange: (e) => setNewBookTitle(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter new book title" })] }), _jsxs("div", { className: "mb-4 flex items-center", children: [_jsx("input", { type: "checkbox", id: "isPublished", checked: isPublished, onChange: (e) => setIsPublished(e.target.checked), className: "mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "isPublished", className: "text-sm font-medium text-gray-700", children: "Publish Immediately" })] }), _jsx("button", { type: "submit", className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", disabled: uploading || createBookMutation.isPending, children: uploading ? (_jsxs(_Fragment, { children: [_jsx(UploadCloud, { className: "w-4 h-4 animate-pulse" }), "Uploading Chapter..."] })) : createBookMutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Book, { className: "w-4 h-4 animate-pulse" }), "Creating Book..."] })) : (_jsxs(_Fragment, { children: [_jsx(Plus, { className: "w-4 h-4" }), "Upload Chapter"] })) })] }) })] }));
};
//# sourceMappingURL=ChapterUploadPage.js.map