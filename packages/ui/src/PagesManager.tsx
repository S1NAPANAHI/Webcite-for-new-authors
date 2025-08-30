
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { ContentEditor } from './ContentEditor';
import { ContentTable } from './ContentTable';
import { Page, ContentStatus } from '@zoroaster/shared/types/content'; // Import Page and ContentStatus

// --- Supabase Data Functions ---
const fetchPages = async (): Promise<Page[]> => {
  const { data, error } = await supabase.from('pages').select('*');
  if (error) throw new Error(error.message);
  return data as Page[];
};

const createPage = async (newPage: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<Page> => {
  const { data, error } = await supabase.from('pages').insert(newPage).select();
  if (error) throw new Error(error.message);
  return data[0] as Page;
};

const updatePage = async (updatedPage: Page): Promise<Page> => {
  const { data, error } = await supabase.from('pages').update(updatedPage).eq('id', updatedPage.id).select();
  if (error) throw new Error(error.message);
  return data[0] as Page;
};

const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// --- Pages Manager Component ---
export const PagesManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  const { data: pages, isLoading, isError, error } = useQuery<Page[]>({ queryKey: ['pages'], queryFn: fetchPages });

  const createMutation = useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setIsEditing(false);
      setEditingPage(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      setIsEditing(false);
      setEditingPage(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });

  const handleSavePage = (pageData: Page) => {
    if (editingPage) {
      updateMutation.mutate(pageData);
    } else {
      createMutation.mutate(pageData);
    }
  };

  const handleDeletePage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { key: 'title', label: 'Page Title' },
    { key: 'slug', label: 'URL Slug' },
    {
      key: 'status',
      label: 'Status',
      render: (item: Page) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          item.status === 'published'
            ? 'bg-green-100 text-green-800'
            : item.status === 'draft'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800' // Handle 'archived' or other statuses
        }`}>
          {item.status}
        </span>
      )
    },
    { key: 'created_at', label: 'Created At', render: (item: Page) => new Date(item.created_at ?? '').toLocaleDateString() },
    { key: 'updated_at', label: 'Last Updated', render: (item: Page) => new Date(item.updated_at ?? '').toLocaleDateString() },
  ];

  if (isLoading) return <div>Loading pages...</div>;
  if (isError) return <div>Error loading pages: {error?.message}</div>;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <ContentEditor
          item={editingPage}
          contentType="pages"
          onSave={handleSavePage}
          onCancel={() => {
            setIsEditing(false);
            setEditingPage(null);
          }}
        />
      ) : (
        <ContentTable
          contentType="pages"
          items={pages || []}
          title="Website Pages"
          columns={columns}
          createActionLabel="New Page"
          onEdit={(item) => {
            setEditingPage(item ?? undefined);
            setIsEditing(true);
          }}
          onDelete={handleDeletePage}
          onCreateNew={() => {
            setEditingPage(null);
            setIsEditing(true);
          }}
        />
      )}
    </div>
  );
};


