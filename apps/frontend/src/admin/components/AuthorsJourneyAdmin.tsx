import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Spinner, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Input, 
  useDisclosure,
  Switch
} from '@nextui-org/react';
import { supabase } from '@zoroaster/shared';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

type Post = Database['public']['Tables']['authors_journey_posts']['Row'];

type AuthorsJourneyAdminProps = {
  color: 'primary' | 'secondary' | 'success';
};

export default function AuthorsJourneyAdmin({ color }: AuthorsJourneyAdminProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [slug, setSlug] = useState('');

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('authors_journey_posts').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Error fetching posts: ' + error.message);
    } else {
      setPosts(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content || '');
    setStatus(post.status || 'draft');
    setSlug(post.slug || '');
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedPost(null);
    setTitle('');
    setContent('');
    setStatus('draft');
    setSlug('');
    setSlug('');
    setStatus('draft');
    onOpen();
  };

  const handleSave = async () => {
    setIsLoading(true);
    const postData = {
      title,
      content,
      author_id: (await supabase.auth.getUser()).data.user?.id,
      status,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    };

    let error;
    if (selectedPost) {
      ({ error } = await supabase.from('authors_journey_posts').update(postData).match({ id: selectedPost.id }));
    } else {
      ({ error } = await supabase.from('authors_journey_posts').insert(postData));
    }

    if (error) {
      toast.error('Error saving post: ' + error.message);
    } else {
      toast.success(`Post ${selectedPost ? 'updated' : 'created'} successfully!`);
      await fetchPosts();
      onClose();
    }
    setIsLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsLoading(true);
      const { error } = await supabase.from('authors_journey_posts').delete().match({ id: postId });
      if (error) {
        toast.error('Error deleting post: ' + error.message);
      } else {
        toast.success('Post deleted successfully!');
        await fetchPosts();
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} color={color} startContent={<PlusCircle size={18} />}>
          Add New Post
        </Button>
      </div>
      <Table aria-label="Authors Journey Posts Table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={posts}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading posts..." />}
          emptyContent={"No posts found."}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button isIconOnly size="sm" variant="light" onClick={() => handleEdit(item)}>
                  <Edit size={18} />
                </Button>
                <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={18} />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" backdrop="blur">
        <ModalContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedPost ? 'Edit Post' : 'Add New Post'}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  value={title}
                  onValueChange={setTitle}
                  fullWidth
                  className="mb-4"
                />
                <Input
                  label="Slug"
                  value={slug}
                  onValueChange={setSlug}
                  fullWidth
                  placeholder="auto-generated from title if empty"
                  className="mb-4"
                />
                <div className="bg-white dark:bg-gray-800 rounded-lg">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write the author's journey post here..."
                  />
                </div>
                <Switch 
                  isSelected={status === 'published'}
                  onValueChange={(val) => setStatus(val ? 'published' : 'draft')}
                  color={color}
                  className="mt-4"
                >
                  Publish Post
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={color} onPress={handleSave} isLoading={isLoading}>
                  {selectedPost ? 'Save Changes' : 'Create Post'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}