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

type Template = Database['public']['Tables']['downloadable_templates']['Row'];

type DownloadableTemplatesAdminProps = {
  color: 'primary' | 'secondary' | 'success';
};

export default function DownloadableTemplatesAdmin({ color }: DownloadableTemplatesAdminProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('downloadable_templates').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Error fetching templates: ' + error.message);
    } else {
      setTemplates(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    setDescription(template.description || '');
    setFile(null);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedTemplate(null);
    setTitle('');
    setDescription('');
    setFile(null);
    onOpen();
  };

  const handleSave = async () => {
    setIsLoading(true);

    let filePath = selectedTemplate?.file_path || null;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('downloadable_templates')
        .upload(fileName, file);

      if (uploadError) {
        toast.error('Error uploading file: ' + uploadError.message);
        setIsLoading(false);
        return;
      }
      filePath = uploadData.path;
    }

    const templateData = {
      title,
      description,
      file_path: filePath,
    };

    let error;
    if (selectedTemplate) {
      ({ error } = await supabase.from('downloadable_templates').update(templateData).match({ id: selectedTemplate.id }));
    } else {
      ({ error } = await supabase.from('downloadable_templates').insert(templateData));
    }

    if (error) {
      toast.error('Error saving template: ' + error.message);
    } else {
      toast.success(`Template ${selectedTemplate ? 'updated' : 'created'} successfully!`);
      await fetchTemplates();
      onClose();
    }
    setIsLoading(false);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setIsLoading(true);
      const { error } = await supabase.from('downloadable_templates').delete().match({ id: templateId });
      if (error) {
        toast.error('Error deleting template: ' + error.message);
      } else {
        toast.success('Template deleted successfully!');
        await fetchTemplates();
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} color={color} startContent={<PlusCircle size={18} />}>
          Add New Template
        </Button>
      </div>
      <Table aria-label="Downloadable Templates Table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>FILE PATH</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={templates}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading templates..." />}
          emptyContent={"No templates found."}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.file_path}</TableCell>
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
                {selectedTemplate ? 'Edit Template' : 'Add New Template'}
              </ModalHeader>
              <ModalBody>
                <Input label="Title" value={title} onValueChange={setTitle} fullWidth />
                <Textarea label="Description" value={description} onValueChange={setDescription} fullWidth />
                <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} fullWidth />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={color} onPress={handleSave} isLoading={isLoading}>
                  {selectedTemplate ? 'Save Changes' : 'Create Template'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}