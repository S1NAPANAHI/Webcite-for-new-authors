import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';


// Define the type for our pages (should match the one in PagesManager.tsx)
type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
};

const fetchPageBySlug = async (slug: string): Promise<Page | null> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Only fetch published pages
    .single(); // Expect a single result

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    throw new Error(error.message);
  }
  return data as Page | null;
};

const GenericPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, isError, error } = useQuery<Page | null>({
    queryKey: ['genericPage', slug],
    queryFn: () => (slug ? fetchPageBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug, // Only run query if slug is available
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading page...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading page: {error?.message}</div>;
  }

  if (!page) {
    return <div className="text-center py-8 text-gray-600">Page not found or not published.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
        <div 
          className="prose lg:prose-lg max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
};

export default GenericPage;
