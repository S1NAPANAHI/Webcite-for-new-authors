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

type Guide = Database['public']['Tables']['writing_guides']['Row'];

type WritingGuidesAdminProps = {
  color: 'primary' | 'secondary' | 'success';
};

export default function WritingGuidesAdmin({ color }: WritingGuidesAdminProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [slug, setSlug] = useState('');

  const fetchGuides = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('writing_guides').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Error fetching guides: ' + error.message);
    } else {
      setGuides(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleEdit = (guide: Guide) => {
    setSelectedGuide(guide);
    setTitle(guide.title);
    setContent(guide.content || '');
    setStatus(guide.status || 'draft');
    setSlug(guide.slug || '');
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedGuide(null);
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
    const guideData = {
      title,
      content,
      status,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    };

    let error;
    if (selectedGuide) {
      ({ error } = await supabase.from('writing_guides').update(guideData).match({ id: selectedGuide.id }));
    } else {
      ({ error } = await supabase.from('writing_guides').insert(guideData));
    }

    if (error) {
      toast.error('Error saving guide: ' + error.message);
    } else {
      toast.success(`Guide ${selectedGuide ? 'updated' : 'created'} successfully!`);
      await fetchGuides();
      onClose();
    }
    setIsLoading(false);
  };

  const handleDelete = async (guideId: string) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      setIsLoading(true);
      const { error } = await supabase.from('writing_guides').delete().match({ id: guideId });
      if (error) {
        toast.error('Error deleting guide: ' + error.message);
      } else {
        toast.success('Guide deleted successfully!');
        await fetchGuides();
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} color={color} startContent={<PlusCircle size={18} />}>
          Add New Guide
        </Button>
      </div>
      <Table aria-label="Writing Guides Table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={guides}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading guides..." />}
          emptyContent={"No guides found."}
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
                {selectedGuide ? 'Edit Guide' : 'Add New Guide'}
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
                    placeholder="Write the guide here..."
                  />
                </div>
                <Switch 
                  isSelected={status === 'published'}
                  onValueChange={(val) => setStatus(val ? 'published' : 'draft')}
                  color={color}
                  className="mt-4"
                >
                  Publish Guide
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={color} onPress={handleSave} isLoading={isLoading}>
                  {selectedGuide ? 'Save Changes' : 'Create Guide'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}