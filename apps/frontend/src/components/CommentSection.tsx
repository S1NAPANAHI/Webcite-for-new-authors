import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { Input, Button, Spinner, Textarea, Avatar } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { Send, MessageSquare, User } from 'lucide-react';

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles?: Database['public']['Tables']['profiles']['Row'];
  children?: Comment[]; // Add children for nesting
};

type CommentSectionProps = {
  contentId: string; // ID of the post or guide
  contentType: 'post' | 'guide'; // Type of content (post or guide)
};

const buildCommentTree = (flatComments: Comment[]): Comment[] => {
  const commentMap: { [key: string]: Comment } = {};
  const rootComments: Comment[] = [];

  flatComments.forEach(comment => {
    commentMap[comment.id!] = { ...comment, children: [] };
  });

  flatComments.forEach(comment => {
    if (comment.parent_id && commentMap[comment.parent_id]) {
      commentMap[comment.parent_id].children!.push(commentMap[comment.id!]);
    } else {
      rootComments.push(commentMap[comment.id!]);
    }
  });

  return rootComments;
};

// New CommentItem component
const CommentItem: React.FC<{ comment: Comment; onReply: (parentId: string, replyContent: string) => Promise<void> }> = ({ comment, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty.');
      return;
    }
    setIsReplying(true);
    await onReply(comment.id!, replyContent);
    setReplyContent('');
    setShowReplyInput(false);
    setIsReplying(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col gap-2">
      <div className="flex gap-4 items-start">
        <Avatar
          src={comment.profiles?.avatar_url || undefined}
          fallback={<User className="text-gray-500" />}
          size="md"
        />
        <div className="flex-grow">
          <p className="font-semibold text-gray-900 dark:text-white">{comment.profiles?.username || comment.author_name || 'Anonymous'}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{new Date(comment.created_at).toLocaleString()}</p>
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-blue-500 text-sm mt-2 hover:underline"
          >
            {showReplyInput ? 'Cancel Reply' : 'Reply'}
          </button>
        </div>
      </div>

      {showReplyInput && (
        <div className="ml-12 mt-4">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            minRows={2}
            maxRows={4}
            className="mb-2"
          />
          <Button
            onClick={handleReplySubmit}
            isLoading={isReplying}
            color="primary"
            size="sm"
            endContent={<Send size={16} />}
          >
            Submit Reply
          </Button>
        </div>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          {comment.children.map(childComment => (
            <CommentItem key={childComment.id} comment={childComment} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentSection({ contentId, contentType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // Store current user data

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const commentMap: { [key: string]: Comment } = {};
    const rootComments: Comment[] = [];

    flatComments.forEach(comment => {
      commentMap[comment.id!] = { ...comment, children: [] };
    });

    flatComments.forEach(comment => {
      if (comment.parent_id && commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].children!.push(commentMap[comment.id!]);
      } else {
        rootComments.push(commentMap[comment.id!]);
      }
    });

    return rootComments;
  };

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    let query = supabase.from('comments').select(`*,
      profiles(username, avatar_url)
    `).order('created_at', { ascending: true });

    if (contentType === 'post') {
      query = query.eq('post_id', contentId);
    } else {
      query = query.eq('guide_id', contentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error fetching comments: ' + error.message);
    } else {
      const tree = buildCommentTree(data || []);
      setComments(tree);
    }
    setIsLoading(false);
  }, [contentId, contentType]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (parentId: string | null = null, replyContentOverride: string | null = null) => {
    const contentToSubmit = replyContentOverride || newComment.trim();

    if (!contentToSubmit) {
      toast.error('Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    const commentData: Partial<Database['public']['Tables']['comments']['Insert']> = {
      content: contentToSubmit,
      parent_id: parentId,
    };

    if (currentUser) {
      commentData.user_id = currentUser.id;
    }

    if (contentType === 'post') {
      commentData.post_id = contentId;
    } else {
      commentData.guide_id = contentId;
    }

    const { error } = await supabase.from('comments').insert(commentData);

    if (error) {
      console.error('Error submitting comment:', error);
      toast.error('Error submitting comment: ' + error.message);
    } else {
      if (!replyContentOverride) { // Only clear main input if it's not a reply
        setNewComment('');
      }
      toast.success('Comment submitted successfully!');
      fetchComments(); // Re-fetch comments to show the new one
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12 pt-6 border-t border-slate-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare size={24} /> Comments ({comments.length})
      </h3>

      {/* Main Comment Input Form */}
      <div className="form-container mb-8"> {/* Added mb-8 for spacing */}
        <form className="form" onSubmit={(e) => { e.preventDefault(); handleSubmitComment(); }}>
          <div className="form-group">
            <label htmlFor="commentContent">Your Comment</label>
            <Textarea // Changed to Textarea for better UX
              name="commentContent"
              id="commentContent"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
          </div>
          <Button
            type="submit"
            isLoading={isSubmitting}
            color="primary"
            endContent={<Send size={16} />}
          >
            Submit Comment
          </Button>
        </form>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spinner label="Loading comments..." />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={(parentId, replyContent) => handleSubmitComment(parentId, replyContent)} />
          ))}
        </div>
      )}
    </div>
  );
}