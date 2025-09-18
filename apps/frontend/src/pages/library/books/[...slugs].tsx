import React, { useState, useEffect } from 'react';
import { ContentService } from '@zoroaster/shared/services/content';
import { EbookReader } from '../../../components/EbookReader';
import { Database } from '@zoroaster/shared/database.types';
import { useParams } from 'react-router-dom';

type Content = Database['public']['Tables']['books']['Row'] | Database['public']['Tables']['chapters']['Row'];

export default function BookPage() {
  const { slugs } = useParams<{ slugs: string[] }>();
  const [content, setContent] = useState<Content | null>(null);
  const [contentType, setContentType] = useState<'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slugs || slugs.length === 0) {
        setError('Content not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (slugs.length === 1) {
          // Book detail page: /library/books/[bookSlug]
          const book = await ContentService.getBookWithHierarchy(slugs[0]);
          if (book) {
            setContent(book);
            setContentType('book');
          } else {
            setError('Book not found.');
          }
        } else if (slugs.length === 6) {
          // Chapter page: /library/books/[book]/[volume]/[saga]/[arc]/[issue]/[chapter]
          const [bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug] = slugs;
          const userId = undefined; // For now, checking for public access

          const chapter = await ContentService.getChapterContent(
            bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug, userId
          );

          if (chapter) {
            setContent(chapter);
            setContentType('chapter');
          } else {
            setError('Chapter not found or access denied.');
          }
        } else {
          setError('Invalid content path.');
        }
      } catch (err) {
        console.error(`Error fetching content for slugs: ${slugs.join('/')}`, err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slugs]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-text-light">
        Loading content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-400">
        Error: Failed to edit, 0 occurrences found for old_string (import React from 'react';
import { GetServerSideProps } from 'next';
import { ContentService } from '@zoroaster/shared/services/content';
import { EbookReader } from '../../../components/EbookReader';
import { Database } from '@zoroaster/shared/database.types';

type Content = Database['public']['Tables']['books']['Row'] | Database['public']['Tables']['chapters']['Row'];

interface BookPageProps {
  content: Content;
  contentType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter';
  slugs: string[];
}

export default function BookPage({ content, contentType, slugs }: BookPageProps) {
  if (contentType === 'chapter') {
    return <EbookReader chapter={content as Database['public']['Tables']['chapters']['Row']} />;
  }

  const book = content as Database['public']['Tables']['books']['Row']>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

      {book.subtitle && (
        <h2 className="text-xl text-gray-600 mb-4">{book.subtitle}</h2>
      )}

      {book.description && (
        <p className="text-gray-700 mb-8">{book.description}</p>
      )}

      {/* TODO: Render the hierarchy of volumes, sagas, etc. */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const slugs = params?.slugs as string[];

  if (!slugs || slugs.length === 0) {
    return { notFound: true };
  }

  try {
    // This logic is simplified. A real implementation would need to handle
    // different lengths of slugs to fetch volumes, sagas, etc.
    if (slugs.length === 1) {
      // Book detail page: /library/books/[bookSlug]
      const book = await ContentService.getBookWithHierarchy(slugs[0]);
      return {
        props: {
          content: book,
          contentType: 'book',
          slugs,
        },
      };
    } else if (slugs.length === 6) {
      // Chapter page: /library/books/[book]/[volume]/[saga]/[arc]/[issue]/[chapter]
      const [bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug] = slugs;
      
      // In a real app, you'd get the user ID from the session.
      // const { user } = await supabase.auth.api.getUserByCookie(req);
      const userId = undefined; // For now, checking for public access

      const chapter = await ContentService.getChapterContent(
        bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug, userId
      );

      if (!chapter) {
        return { notFound: true };
      }

      return {
        props: {
          content: chapter,
          contentType: 'chapter',
          slugs,
        },
      };
    }

    return { notFound: true };
  } catch (error) {
    console.error(`Error fetching content for slugs: ${slugs.join('/')}`, error);
    return { notFound: true };
  }
};). Original old_string was (import React from 'react';
import { GetServerSideProps } from 'next';
import { ContentService } from '@zoroaster/shared/services/content';
import { EbookReader } from '../../../components/EbookReader';
import { Database } from '@zoroaster/shared/database.types';

type Content = Database['public']['Tables']['books']['Row'] | Database['public']['Tables']['chapters']['Row'];

interface BookPageProps {
  content: Content;
  contentType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter';
  slugs: string[];
}

export default function BookPage({ content, contentType, slugs }: BookPageProps) {
  if (contentType === 'chapter') {
    return <EbookReader chapter={content as Database['public']['Tables']['chapters']['Row']} />;
  }

  const book = content as Database['public']['Tables']['books']['Row']>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

      {book.subtitle && (
        <h2 className="text-xl text-gray-600 mb-4">{book.subtitle}</h2>
      )}

      {book.description && (
        <p className="text-gray-700 mb-8">{book.description}</p>
      )}

      {/* TODO: Render the hierarchy of volumes, sagas, etc. */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const slugs = params?.slugs as string[];

  if (!slugs || slugs.length === 0) {
    return { notFound: true };
  }

  try {
    // This logic is simplified. A real implementation would need to handle
    // different lengths of slugs to fetch volumes, sagas, etc.
    if (slugs.length === 1) {
      // Book detail page: /library/books/[bookSlug]
      const book = await ContentService.getBookWithHierarchy(slugs[0]);
      return {
        props: {
          content: book,
          contentType: 'book',
          slugs,
        },
      };
    } else if (slugs.length === 6) {
      // Chapter page: /library/books/[book]/[volume]/[saga]/[arc]/[issue]/[chapter]
      const [bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug] = slugs;
      
      // In a real app, you'd get the user ID from the session.
      // const { user } = await supabase.auth.api.getUserByCookie(req);
      const userId = undefined; // For now, checking for public access

      const chapter = await ContentService.getChapterContent(
        bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug, userId
      );

      if (!chapter) {
        return { notFound: true };
      }

      return {
        props: {
          content: chapter,
          contentType: 'chapter',
          slugs,
        },
      };
    }

    return { notFound: true };
  } catch (error) {
    console.error(`Error fetching content for slugs: ${slugs.join('/')}`, error);
    return { notFound: true };
  }
};) in E:/WORK/Webcite-for-new-authors-main/apps/frontend/src/pages/library/books/[...slugs].tsx. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify.
      </div>
    );
  }

  if (!content || !contentType) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-text-light">
        Content not found.
      </div>
    );
  }

  if (contentType === 'chapter') {
    return <EbookReader chapter={content as Database['public']['Tables']['chapters']['Row']} />;
  }

  const book = content as Database['public']['Tables']['books']['Row']>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

      {book.subtitle && (
        <h2 className="text-xl text-gray-600 mb-4">{book.subtitle}</h2>
      )}

      {book.description && (
        <p className="text-gray-700 mb-8">{book.description}</p>
      )}

      {/* TODO: Render the hierarchy of volumes, sagas, etc. */}
    </div>
  );
}
