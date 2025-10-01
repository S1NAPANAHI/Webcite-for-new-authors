import React, { useState, useEffect } from 'react';
import { Book, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface Release {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  type: 'chapter' | 'announcement';
  workTitle?: string;
  chapterNumber?: number;
  url?: string;
}

interface LatestReleasesProps {
  limit?: number;
}

export const LatestReleases: React.FC<LatestReleasesProps> = ({ limit = 5 }) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      console.log('🚀 LatestReleases: Starting comprehensive releases fetch...');
      
      try {
        setLoading(true);
        setError(null);

        // Strategy 1: Try API endpoint first
        console.log('📡 Strategy 1: Trying API endpoint...');
        try {
          const apiResponse = await fetch('https://webcite-for-new-authors.onrender.com/api/releases/latest', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            if (apiData.success && apiData.data && apiData.data.length > 0) {
              console.log('✅ API Strategy Success:', apiData.data);
              setReleases(apiData.data);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.log('⚠️ API Strategy Failed:', apiError);
        }

        // Strategy 2: Direct Supabase chapters query with improved error handling
        console.log('📚 Strategy 2: Querying chapters directly...');
        const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select(`
            id,
            title,
            chapter_number,
            created_at,
            updated_at,
            content_item:content_item_id (
              title,
              slug
            )
          `)
          .not('content_item_id', 'is', null)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (chaptersError) {
          console.error('❌ Chapters query error:', chaptersError);
        } else if (chapters && chapters.length > 0) {
          console.log(`🎯 Found ${chapters.length} chapters, transforming to releases...`);
          console.log('📋 Chapter releases:', chapters.map(c => c.title));
          
          const transformedReleases = chapters.map(chapter => ({
            id: chapter.id,
            title: `${chapter.content_item?.title || 'Unknown Work'} - Chapter ${chapter.chapter_number || '?'}: ${chapter.title}`,
            description: `New chapter published in ${chapter.content_item?.title || 'your library'}`,
            releaseDate: chapter.created_at || chapter.updated_at,
            type: 'chapter' as const,
            workTitle: chapter.content_item?.title,
            chapterNumber: chapter.chapter_number,
            url: chapter.content_item?.slug ? `/read/${chapter.content_item.slug}/chapter/${chapter.id}` : undefined
          }));

          console.log('✅ Chapters Strategy Success: Transformed', transformedReleases.length, 'chapters to releases');
          setReleases(transformedReleases);
          setLoading(false);
          return;
        }

        // Strategy 3: Try content_items table for books/works
        console.log('📖 Strategy 3: Querying content_items table...');
        const { data: contentItems, error: contentError } = await supabase
          .from('content_items')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (contentError) {
          console.error('❌ Content items query error:', contentError);
        } else if (contentItems && contentItems.length > 0) {
          console.log('📚 Content Items Strategy: Found', contentItems.length, 'content items');
          setReleases(contentItems.map(item => ({
            id: item.id,
            title: item.title || 'Untitled Work',
            description: item.description || `New ${item.type || 'content'} published`,
            releaseDate: item.created_at,
            type: 'announcement' as const,
            url: item.slug ? `/read/${item.slug}` : undefined
          })));
          setLoading(false);
          return;
        }

        // Strategy 4: Try blog_posts table as fallback
        console.log('📝 Strategy 4: Querying blog_posts table...');
        const { data: blogPosts, error: blogError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (blogError) {
          console.error('❌ Blog posts query error:', blogError);
        } else if (blogPosts && blogPosts.length > 0) {
          console.log('📰 Blog Posts Strategy: Found', blogPosts.length, 'blog posts');
          setReleases(blogPosts.map(post => ({
            id: post.id,
            title: post.title,
            description: post.excerpt || 'New blog post published',
            releaseDate: post.published_at,
            type: 'announcement' as const,
            url: `/blog/${post.slug}`
          })));
          setLoading(false);
          return;
        }

        // Strategy 5: No content found
        console.log('📋 Strategy 5: No content found, showing empty state...');
        setReleases([]);
        setLoading(false);

      } catch (error) {
        console.error('❌ LatestReleases: Fatal error during fetch:', error);
        setError('Failed to load releases');
        setReleases([]);
        setLoading(false);
      }
    };

    fetchReleases();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">LATEST RELEASES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">LATEST RELEASES</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!releases || releases.length === 0) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">LATEST RELEASES</h2>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <Book className="w-16 h-16 text-orange-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Releases Yet</h3>
            <p className="text-gray-400 mb-6">
              New chapter releases will appear here automatically when you publish content in your library.
            </p>
            <Link 
              to="/library" 
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
            >
              Browse Library
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">LATEST RELEASES</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stay up to date with the newest chapters and announcements from the Zoroastervers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {releases.map((release) => (
            <div key={release.id} className="group bg-gray-800/50 border border-gray-700 hover:border-orange-500/50 rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center text-orange-500">
                  {release.type === 'chapter' ? (
                    <Book className="w-5 h-5 mr-2" />
                  ) : (
                    <ExternalLink className="w-5 h-5 mr-2" />
                  )}
                  <span className="text-sm font-medium uppercase">
                    {release.type === 'chapter' ? 'New Chapter' : 'Announcement'}
                  </span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(release.releaseDate).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                {release.title}
              </h3>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {release.description}
              </p>

              {release.url && (
                <Link 
                  to={release.url}
                  className="inline-flex items-center text-orange-500 hover:text-orange-400 font-medium text-sm transition-colors"
                >
                  Read Now
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {releases.length >= limit && (
          <div className="text-center mt-8">
            <Link 
              to="/releases" 
              className="inline-flex items-center px-6 py-3 bg-transparent border border-orange-500 hover:bg-orange-500 text-orange-500 hover:text-white font-medium rounded-lg transition-all"
            >
              View All Releases
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestReleases;