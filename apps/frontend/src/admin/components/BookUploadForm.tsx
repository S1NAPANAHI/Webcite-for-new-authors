import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BookUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState('digital_book');
  const [isPremium, setIsPremium] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [pageCount, setPageCount] = useState<number | string>('');
  const [wordCount, setWordCount] = useState<number | string>('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an EPUB file to upload.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    formData.append('product_type', productType);
    formData.append('is_premium', isPremium.toString());
    formData.append('isbn', isbn);
    formData.append('page_count', pageCount.toString());
    formData.append('word_count', wordCount.toString());
    formData.append('cover_image_url', coverImageUrl);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload book.');
      }

      const result = await response.json();
      toast.success('Book uploaded and product created successfully!');
      console.log('Upload successful:', result);

      // Reset form
      setFile(null);
      setTitle('');
      setAuthor('');
      setDescription('');
      setProductType('digital_book');
      setIsPremium(false);
      setIsbn('');
      setPageCount('');
      setWordCount('');
      setCoverImageUrl('');

    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Upload New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">EPUB File</label>
          <input
            type="file"
            id="file"
            accept=".epub"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary/20 file:text-primary
              hover:file:bg-primary/30"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Book Title"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Author Name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="A brief description of the book..."
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-300 mb-2">ISBN (Optional)</label>
            <input
              type="text"
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 978-3-16-148410-0"
            />
          </div>
          <div>
            <label htmlFor="pageCount" className="block text-sm font-medium text-gray-300 mb-2">Page Count (Optional)</label>
            <input
              type="number"
              id="pageCount"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 320"
            />
          </div>
          <div>
            <label htmlFor="wordCount" className="block text-sm font-medium text-gray-300 mb-2">Word Count (Optional)</label>
            <input
              type="number"
              id="wordCount"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 75000"
            />
          </div>
          <div>
            <label htmlFor="coverImageUrl" className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL (Optional)</label>
            <input
              type="url"
              id="coverImageUrl"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/cover.jpg"
            />
          </div>
        </div>

        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-gray-300 mb-2">Product Type</label>
          <select
            id="productType"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="digital_book">Digital Book</option>
            <option value="audio_book">Audio Book</option>
            <option value="physical_book">Physical Book</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPremium"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 text-primary rounded border-gray-600 focus:ring-primary"
          />
          <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-300">Is Premium Content</label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </div>
  );
};

export default BookUploadForm;
