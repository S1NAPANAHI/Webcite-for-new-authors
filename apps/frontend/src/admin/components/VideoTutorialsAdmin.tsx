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
  Textarea,
  useDisclosure
} from '@nextui-org/react';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

type Tutorial = Database['public']['Tables']['video_tutorials']['Row'];

type VideoTutorialsAdminProps = {
  color: 'primary' | 'secondary' | 'success';
};

export default function VideoTutorialsAdmin({ color }: VideoTutorialsAdminProps) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fetchTutorials = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('video_tutorials').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Error fetching tutorials: ' + error.message);
    } else {
      setTutorials(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  const handleEdit = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setTitle(tutorial.title);
    setDescription(tutorial.description || '');
    setVideoUrl(tutorial.video_url || '');
    setThumbnailUrl(tutorial.thumbnail_url || '');
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedTutorial(null);
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnailUrl('');
    onOpen();
  };

  const handleSave = async () => {
    setIsLoading(true);
    const tutorialData = {
      title,
      description,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
    };

    let error;
    if (selectedTutorial) {
      ({ error } = await supabase.from('video_tutorials').update(tutorialData).match({ id: selectedTutorial.id }));
    } else {
      ({ error } = await supabase.from('video_tutorials').insert(tutorialData));
    }

    if (error) {
      toast.error('Error saving tutorial: ' + error.message);
    } else {
      toast.success(`Tutorial ${selectedTutorial ? 'updated' : 'created'} successfully!`);
      await fetchTutorials();
      onClose();
    }
    setIsLoading(false);
  };

  const handleDelete = async (tutorialId: string) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      setIsLoading(true);
      const { error } = await supabase.from('video_tutorials').delete().match({ id: tutorialId });
      if (error) {
        toast.error('Error deleting tutorial: ' + error.message);
      } else {
        toast.success('Tutorial deleted successfully!');
        await fetchTutorials();
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} color={color} startContent={<PlusCircle size={18} />}>
          Add New Tutorial
        </Button>
      </div>
      <Table aria-label="Video Tutorials Table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>URL</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={tutorials}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading tutorials..." />}
          emptyContent={"No tutorials found."}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.video_url}</TableCell>
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
                {selectedTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
              </ModalHeader>
              <ModalBody>
                <Input label="Title" value={title} onValueChange={setTitle} fullWidth />
                <Textarea label="Description" value={description} onValueChange={setDescription} fullWidth />
                <Input label="Video URL" value={videoUrl} onValueChange={setVideoUrl} fullWidth />
                <Input label="Thumbnail URL" value={thumbnailUrl} onValueChange={setThumbnailUrl} fullWidth />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={color} onPress={handleSave} isLoading={isLoading}>
                  {selectedTutorial ? 'Save Changes' : 'Create Tutorial'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}