import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
import { useToast } from '@zoroaster/ui';

  const toastInstance = useToast();

// Define types for homepage content items
type HomepageContentItem = {
  id: number;
  section: string; // e.g., 'hero_title', 'hero_description', 'stat_words_written'
  title?: string; // Used for news/releases, or as a label for single items
  content: string; // The actual value or description
  created_at?: string;
  updated_at?: string;
};

type NewsItem = {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  date: string; // Stored as YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
};

type ReleaseItem = {
  id: string;
  title: string;
  type: 'issue' | 'arc' | 'volume';
  status: 'available' | 'coming-soon' | 'pre-order';
  description?: string;
  release_date: string; // Stored as YYYY-MM-DD
  purchase_link?: string;
  created_at?: string;
  updated_at?: string;
};

// --- Supabase Data Functions ---
const fetchHomepageContent = async (): Promise<HomepageContentItem[]> => {
  const { data, error } = await supabase.from('homepage_content').select('*');
  if (error) throw new Error(error.message);
  return data as HomepageContentItem[];
};

const updateHomepageContent = async (item: HomepageContentItem): Promise<HomepageContentItem> => {
  const { id, ...updates } = item; // Exclude id from the update payload
  const { data, error } = await supabase.from('homepage_content').update(updates).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0] as HomepageContentItem;
};

const createHomepageContent = async (item: Omit<HomepageContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageContentItem> => {
  const { data, error } = await supabase.from('homepage_content').insert(item).select();
  if (error) throw new Error(error.message);
  return data[0] as HomepageContentItem;
};

// --- News Items Supabase Functions ---
const fetchNewsItems = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase.from('news_items').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data as NewsItem[];
};

const createNewsItem = async (item: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>): Promise<NewsItem> => {
  const { data, error } = await supabase.from('news_items').insert(item).select();
  if (error) throw new Error(error.message);
  return data[0] as NewsItem;
};

const updateNewsItem = async (item: NewsItem): Promise<NewsItem> => {
  const { data, error } = await supabase.from('news_items').update(item).eq('id', item.id).select();
  if (error) throw new Error(error.message);
  return data[0] as NewsItem;
};

const deleteNewsItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from('news_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// --- Release Items Supabase Functions ---
const fetchReleaseItems = async (): Promise<ReleaseItem[]> => {
  const { data, error } = await supabase.from('release_items').select('*').order('release_date', { ascending: false });
  if (error) throw new Error(error.message);
  return data as ReleaseItem[];
};

const createReleaseItem = async (item: Omit<ReleaseItem, 'id' | 'created_at' | 'updated_at'>): Promise<ReleaseItem> => {
  const { data, error } = await supabase.from('release_items').insert(item).select();
  if (error) throw new Error(error.message);
  return data[0] as ReleaseItem;
};

const updateReleaseItem = async (item: ReleaseItem): Promise<ReleaseItem> => {
  const { data, error } = await supabase.from('release_items').update(item).eq('id', item.id).select();
  if (error) throw new Error(error.message);
  return data[0] as ReleaseItem;
};

const deleteReleaseItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from('release_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const HomepageContentManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: homepageItems, isLoading, isError, error } = useQuery<HomepageContentItem[]>({ queryKey: ['homepageContent'], queryFn: fetchHomepageContent });
  const { data: newsItems, isLoading: isLoadingNews, isError: isErrorNews, error: errorNews } = useQuery<NewsItem[]>({ queryKey: ['newsItems'], queryFn: fetchNewsItems });
  const { data: releaseItems, isLoading: isLoadingReleases, isError: isErrorReleases, error: errorReleases } = useQuery<ReleaseItem[]>({ queryKey: ['releaseItems'], queryFn: fetchReleaseItems });

  const updateHomepageMutation = useMutation({
    mutationFn: updateHomepageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
      toastInstance.toast({ title: 'Content updated successfully!', variant: 'default' });
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error updating content: ${err.message}`, variant: 'destructive' });
    }
  });

  const createHomepageMutation = useMutation({
    mutationFn: createHomepageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageContent'] });
      toastInstance.toast({ title: 'Content created successfully!', variant: 'default' });
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error creating content: ${err.message}`, variant: 'destructive' });
    }
  });

  const createNewsMutation = useMutation({
    mutationFn: createNewsItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsItems'] });
      toastInstance.toast({ title: 'News item added successfully!', variant: 'default' });
      closeNewsModal();
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error adding news item: ${err.message}`, variant: 'destructive' });
    }
  });

  const updateNewsMutation = useMutation({
    mutationFn: updateNewsItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsItems'] });
      toastInstance.toast({ title: 'News item updated successfully!', variant: 'default' });
      closeNewsModal();
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error updating news item: ${err.message}`, variant: 'destructive' });
    }
  });

  const deleteNewsMutation = useMutation({
    mutationFn: deleteNewsItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsItems'] });
      toastInstance.toast({ title: 'News item deleted successfully!', variant: 'default' });
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error deleting news item: ${err.message}`, variant: 'destructive' });
    }
  });

  const createReleaseMutation = useMutation({
    mutationFn: createReleaseItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
      toastInstance.toast({ title: 'Release item added successfully!', variant: 'default' });
      closeReleaseModal();
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error adding release item: ${err.message}`, variant: 'destructive' });
    }
  });

  const updateReleaseMutation = useMutation({
    mutationFn: updateReleaseItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
      toastInstance.toast({ title: 'Release item updated successfully!', variant: 'default' });
      closeReleaseModal();
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error updating release item: ${err.message}`, variant: 'destructive' });
    }
  });

  const deleteReleaseMutation = useMutation({
    mutationFn: deleteReleaseItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
      toastInstance.toast({ title: 'Release item deleted successfully!', variant: 'default' });
    },
    onError: (err) => {
      toastInstance.toast({ title: `Error deleting release item: ${err.message}`, variant: 'destructive' });
    }
  });

  // State for modals
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [editingReleaseItem, setEditingReleaseItem] = useState<ReleaseItem | null>(null);

  // Helper to get a specific item by section name
  const getItemBySection = (sectionName: string) => {
    return homepageItems?.find(item => item.section === sectionName);
  };

  // --- Hero Section Handlers ---
  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const heroTitle = form.heroTitle.value;
    const heroDescription = form.heroDescription.value;
    const heroButtonText = form.heroButtonText.value;
    const heroButtonLink = form.heroButtonLink.value;

    const itemsToUpdate = [
      { section: 'hero_title', content: heroTitle },
      { section: 'hero_description', content: heroDescription },
      { section: 'hero_button_text', content: heroButtonText },
      { section: 'hero_button_link', content: heroButtonLink },
    ];

    for (const item of itemsToUpdate) {
      const existingItem = getItemBySection(item.section);
      if (existingItem) {
        updateHomepageMutation.mutate({ ...existingItem, content: item.content });
      } else {
        createHomepageMutation.mutate(item);
      }
    }
  };

  // --- Statistics Section Handlers ---
  const handleStatsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const wordsWritten = form.wordsWritten.value;
    const betaReaders = form.betaReaders.value;
    const averageRating = form.averageRating.value;
    const booksPublished = form.booksPublished.value;

    const itemsToUpdate = [
      { section: 'stat_words_written', content: wordsWritten },
      { section: 'stat_beta_readers', content: betaReaders },
      { section: 'stat_average_rating', content: averageRating },
      { section: 'stat_books_published', content: booksPublished },
    ];

    for (const item of itemsToUpdate) {
      const existingItem = getItemBySection(item.section);
      if (existingItem) {
        updateHomepageMutation.mutate({ ...existingItem, content: item.content });
      } else {
        createHomepageMutation.mutate(item);
      }
    }
  };

  // --- News Modal Handlers ---
  const openNewsModal = (item: NewsItem | null = null) => {
    setEditingNewsItem(item);
    setShowNewsModal(true);
  };

  const closeNewsModal = () => {
    setEditingNewsItem(null);
    setShowNewsModal(false);
  };

  const handleNewsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = form.newsTitle.value;
    const content = form.newsContent.value;
    const status = form.newsStatus.value;
    const date = form.newsDate.value;

    const newsData = { title, content, status, date };

    if (editingNewsItem) {
      updateNewsMutation.mutate({ ...editingNewsItem, ...newsData });
    } else {
      createNewsMutation.mutate(newsData);
    }
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      deleteNewsMutation.mutate(id);
    }
  };

  // --- Release Modal Handlers ---
  const openReleaseModal = (item: ReleaseItem | null = null) => {
    setEditingReleaseItem(item);
    setShowReleaseModal(true);
  };

  const closeReleaseModal = () => {
    setEditingReleaseItem(null);
    setShowReleaseModal(false);
  };

  const handleReleaseSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = form.releaseTitle.value;
    const type = form.releaseType.value;
    const status = form.releaseStatus.value;
    const description = form.releaseDescription.value;
    const release_date = form.releaseDate.value;
    const purchase_link = form.purchaseLink.value;

    const releaseData = { title, type, status, description, release_date, purchase_link };

    if (editingReleaseItem) {
      updateReleaseMutation.mutate({ ...editingReleaseItem, ...releaseData });
    } else {
      createReleaseMutation.mutate(releaseData);
    }
  };

  const handleDeleteRelease = (id: string) => {
    if (window.confirm('Are you sure you want to delete this release item?')) {
      deleteReleaseMutation.mutate(id);
    }
  };

  

  if (isLoading || isLoadingNews || isLoadingReleases) return <div className="text-center py-8">Loading homepage content manager...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Error: {error?.message}</div>;
  if (isErrorNews) return <div className="text-center py-8 text-red-500">Error loading news: {errorNews?.message}</div>;
  if (isErrorReleases) return <div className="text-center py-8 text-red-500">Error loading releases: {errorReleases?.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
        <strong>Note:</strong> Changes made here will be reflected on your homepage immediately after saving.
      </div>
      
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="bg-blue-600 text-white p-4 font-semibold">Hero Section</div>
        <div className="p-6">
          <form onSubmit={handleHeroSave}>
            <div className="mb-4">
              <label htmlFor="heroTitle" className="block text-gray-700 text-sm font-bold mb-2">Main Title</label>
              <input type="text" id="heroTitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('hero_title')?.content || ''} />
            </div>
            <div className="mb-4">
              <label htmlFor="heroDescription" className="block text-gray-700 text-sm font-bold mb-2">Subtitle/Description</label>
              <textarea id="heroDescription" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-y" defaultValue={getItemBySection('hero_description')?.content || ''}></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="heroButtonText" className="block text-gray-700 text-sm font-bold mb-2">Button Text</label>
              <input type="text" id="heroButtonText" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('hero_button_text')?.content || ''} />
            </div>
            <div className="mb-6">
              <label htmlFor="heroButtonLink" className="block text-gray-700 text-sm font-bold mb-2">Button Link</label>
              <input type="url" id="heroButtonLink" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('hero_button_link')?.content || ''} />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Hero Section</button>
          </form>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="bg-blue-600 text-white p-4 font-semibold">Statistics</div>
        <div className="p-6">
          <form onSubmit={handleStatsSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="stat-item p-4 border border-gray-200 rounded-md">
                <label htmlFor="wordsWritten" className="block text-gray-700 text-sm font-bold mb-2">Words Written</label>
                <input type="text" id="wordsWritten" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('stat_words_written')?.content || ''} />
              </div>
              <div className="stat-item p-4 border border-gray-200 rounded-md">
                <label htmlFor="betaReaders" className="block text-gray-700 text-sm font-bold mb-2">Beta Readers</label>
                <input type="text" id="betaReaders" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('stat_beta_readers')?.content || ''} />
              </div>
              <div className="stat-item p-4 border border-gray-200 rounded-md">
                <label htmlFor="averageRating" className="block text-gray-700 text-sm font-bold mb-2">Average Rating</label>
                <input type="text" id="averageRating" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('stat_average_rating')?.content || ''} />
              </div>
              <div className="stat-item p-4 border border-gray-200 rounded-md">
                <label htmlFor="booksPublished" className="block text-gray-700 text-sm font-bold mb-2">Books Published</label>
                <input type="text" id="booksPublished" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={getItemBySection('stat_books_published')?.content || ''} />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Statistics</button>
          </form>
        </div>
      </div>

      {/* Latest News & Updates */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="bg-blue-600 text-white p-4 font-semibold">Latest News & Updates</div>
        <div className="p-6">
          <button onClick={() => openNewsModal()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">+ Add New Update</button>
          
          {newsItems?.map(news => (
            <div key={news.id} className="bg-gray-100 p-4 rounded-md mb-2 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => openNewsModal(news)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                <button onClick={() => handleDeleteNews(news.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
              </div>
              <h3 className="font-bold text-lg mb-1">{news.title}</h3>
              <p className="text-gray-700 text-sm">{news.content}</p>
              <small className="text-gray-500">Status: {news.status} | Date: {news.date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Releases */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div className="bg-blue-600 text-white p-4 font-semibold">Latest Releases</div>
        <div className="p-6">
          <button onClick={() => openReleaseModal()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">+ Add New Release</button>
          
          {releaseItems?.map(release => (
            <div key={release.id} className="bg-gray-100 p-4 rounded-md mb-2 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => openReleaseModal(release)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                <button onClick={() => handleDeleteRelease(release.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
              </div>
              <h3 className="font-bold text-lg mb-1">{release.title}</h3>
              <p className="text-gray-700 text-sm"><strong>Type:</strong> {release.type} | <strong>Status:</strong> {release.status}</p>
              <small className="text-gray-500">Released: {release.release_date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* News Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold">{editingNewsItem ? 'Edit Update' : 'Add New Update'}</h2>
              <button onClick={closeNewsModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleNewsSave}>
              <div className="mb-4">
                <label htmlFor="newsTitle" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input type="text" id="newsTitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingNewsItem?.title || ''} required />
              </div>
              <div className="mb-4">
                <label htmlFor="newsContent" className="block text-gray-700 text-sm font-bold mb-2">Content</label>
                <textarea id="newsContent" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-y" defaultValue={editingNewsItem?.content || ''} required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="newsStatus" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select id="newsStatus" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingNewsItem?.status || 'draft'}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="newsDate" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                  <input type="date" id="newsDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingNewsItem?.date || new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={closeNewsModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Release Modal */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold">{editingReleaseItem ? 'Edit Release' : 'Add New Release'}</h2>
              <button onClick={closeReleaseModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleReleaseSave}>
              <div className="mb-4">
                <label htmlFor="releaseTitle" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input type="text" id="releaseTitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingReleaseItem?.title || ''} required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="releaseType" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                  <select id="releaseType" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingReleaseItem?.type || 'issue'}>
                    <option value="issue">Issue</option>
                    <option value="arc">Arc</option>
                    <option value="volume">Volume</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="releaseStatus" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select id="releaseStatus" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingReleaseItem?.status || 'available'}>
                    <option value="available">Available</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="pre-order">Pre-order</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="releaseDescription" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea id="releaseDescription" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24 resize-y" defaultValue={editingReleaseItem?.description || ''}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="releaseDate" className="block text-gray-700 text-sm font-bold mb-2">Release Date</label>
                  <input type="date" id="releaseDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingReleaseItem?.release_date || new Date().toISOString().split('T')[0]} required />
                </div>
                <div>
                  <label htmlFor="purchaseLink" className="block text-gray-700 text-sm font-bold mb-2">Purchase Link</label>
                  <input type="url" id="purchaseLink" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={editingReleaseItem?.purchase_link || ''} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={closeReleaseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Release</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

