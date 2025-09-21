import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author?: string;
  category?: string;
  category_name?: string;
  category_color?: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  views: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  tag_names?: string[];
  tag_slugs?: string[];
  reading_time?: number;
  word_count?: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  likes_count: number;
  is_approved: boolean;
  is_pinned: boolean;
  created_at: string;
  user?: {
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  replies?: BlogComment[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  posts_count: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  posts_count: number;
}

// Hook for fetching blog posts with filters
export function useBlogPosts({
  limit = 10,
  offset = 0,
  category,
  tag,
  search,
  sortBy = 'published_at',
  sortOrder = 'desc'
}: {
  limit?: number;
  offset?: number;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [limit, offset, category, tag, search, sortBy, sortOrder]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('blog_posts_with_stats')
        .select('*', { count: 'exact' })
        .eq('status', 'published');

      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }

      if (tag) {
        query = query.contains('tag_names', [tag]);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setPosts(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  return { posts, totalCount, loading, error, refetch: fetchPosts };
}

// Hook for fetching a single blog post
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_posts_with_stats')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (fetchError) throw fetchError;

      setPost(data);

      // Track view if data exists
      if (data) {
        await trackView(data.id);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error, refetch: fetchPost };
}

// Hook for blog comments
export function useBlogComments(postId: string) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_comments')
        .select(`
          *,
          user:auth.users(email, user_metadata)
        `)
        .eq('blog_post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Organize comments into threads
      const commentMap = new Map();
      const rootComments: BlogComment[] = [];

      data?.forEach((comment: any) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      data?.forEach((comment: any) => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });

      setComments(rootComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, parentId?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to comment');

      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_post_id: postId,
          user_id: user.user?.id,
          parent_id: parentId,
          content,
          is_approved: true // Auto-approve for now
        });

      if (error) throw error;

      await fetchComments(); // Refresh
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    }
  };

  return { comments, loading, error, addComment, refetch: fetchComments };
}

// Hook for categories and tags
export function useBlogMetadata() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      setLoading(true);

      const [categoriesRes, tagsRes] = await Promise.all([
        supabase.from('blog_categories').select('*').order('posts_count', { ascending: false }),
        supabase.from('blog_tags').select('*').order('posts_count', { ascending: false })
      ]);

      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, tags, loading };
}

// Hook for checking if user liked a post
export function usePostLike(postId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      checkIfLiked();
    }
  }, [postId]);

  const checkIfLiked = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_post_id', postId)
        .eq('user_id', user.user.id)
        .single();

      setIsLiked(!!data);
    } catch (err) {
      // Not liked or not authenticated
      setIsLiked(false);
    }
  };

  const toggleLike = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return false;

      if (isLiked) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_post_id', postId)
          .eq('user_id', user.user.id);
        setIsLiked(false);
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert({
            blog_post_id: postId,
            user_id: user.user.id
          });
        setIsLiked(true);
      }
      return !isLiked;
    } catch (err) {
      console.error('Error toggling like:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isLiked, loading, toggleLike };
}

// Utility functions
export const trackView = async (postId: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    await supabase.from('blog_views').insert({
      blog_post_id: postId,
      user_id: user?.user?.id,
      viewed_at: new Date().toISOString()
    });

    // Update post view count
    await supabase.rpc('increment_post_views', { post_id: postId });
  } catch (err) {
    console.error('Error tracking view:', err);
  }
};

export const trackShare = async (postId: string, platform: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    await supabase.from('blog_shares').insert({
      blog_post_id: postId,
      user_id: user?.user?.id,
      platform
    });
  } catch (err) {
    console.error('Error tracking share:', err);
  }
};

export const getRelatedPosts = async (postId: string, limit = 3): Promise<BlogPost[]> => {
  try {
    // Get current post tags
    const { data: currentPost } = await supabase
      .from('blog_posts_with_stats')
      .select('tag_names, category')
      .eq('id', postId)
      .single();

    if (!currentPost) return [];

    // Find related posts by tags and category
    let query = supabase
      .from('blog_posts_with_stats')
      .select('id, title, slug, excerpt, featured_image, published_at, views, likes_count')
      .eq('status', 'published')
      .neq('id', postId);

    if (currentPost.tag_names && currentPost.tag_names.length > 0) {
      query = query.overlaps('tag_names', currentPost.tag_names);
    } else if (currentPost.category) {
      query = query.eq('category', currentPost.category);
    }

    const { data } = await query
      .order('published_at', { ascending: false })
      .limit(limit);

    return data || [];
  } catch (err) {
    console.error('Error fetching related posts:', err);
    return [];
  }
};

// Hook for related posts
export function useRelatedPosts(postId: string, limit = 3) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchRelatedPosts();
    }
  }, [postId, limit]);

  const fetchRelatedPosts = async () => {
    try {
      setLoading(true);
      const posts = await getRelatedPosts(postId, limit);
      setRelatedPosts(posts);
    } catch (err) {
      console.error('Error fetching related posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return { relatedPosts, loading };
}

// Hook for comment likes
export function useCommentLike(commentId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (commentId) {
      checkIfLiked();
    }
  }, [commentId]);

  const checkIfLiked = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.user.id)
        .single();

      setIsLiked(!!data);
    } catch (err) {
      setIsLiked(false);
    }
  };

  const toggleLike = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return false;

      if (isLiked) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.user.id);
        setIsLiked(false);
      } else {
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.user.id
          });
        setIsLiked(true);
      }
      return !isLiked;
    } catch (err) {
      console.error('Error toggling comment like:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isLiked, loading, toggleLike };
}