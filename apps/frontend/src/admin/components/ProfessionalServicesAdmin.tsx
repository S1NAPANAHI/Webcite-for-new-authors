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
  Switch,
  useDisclosure
} from '@nextui-org/react';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

type Service = Database['public']['Tables']['professional_services']['Row'];

type ProfessionalServicesAdminProps = {
  color: 'primary' | 'secondary' | 'success';
};

export default function ProfessionalServicesAdmin({ color }: ProfessionalServicesAdminProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [serviceType, setServiceType] = useState('');

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('professional_services').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Error fetching services: ' + error.message);
    } else {
      setServices(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setTitle(service.title);
    setDescription(service.description || '');
    setPrice(service.price || '');
    setIsAvailable(service.is_available || false);
    setServiceType(service.service_type || '');
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setIsAvailable(false);
    setServiceType('');
    onOpen();
  };

  const handleSave = async () => {
    setIsLoading(true);
    const serviceData = {
      title,
      description,
      price: Number(price),
      is_available: isAvailable,
      service_type: serviceType,
    };

    let error;
    if (selectedService) {
      ({ error } = await supabase.from('professional_services').update(serviceData).match({ id: selectedService.id }));
    } else {
      ({ error } = await supabase.from('professional_services').insert(serviceData));
    }

    if (error) {
      toast.error('Error saving service: ' + error.message);
    } else {
      toast.success(`Service ${selectedService ? 'updated' : 'created'} successfully!`);
      await fetchServices();
      onClose();
    }
    setIsLoading(false);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setIsLoading(true);
      const { error } = await supabase.from('professional_services').delete().match({ id: serviceId });
      if (error) {
        toast.error('Error deleting service: ' + error.message);
      } else {
        toast.success('Service deleted successfully!');
        await fetchServices();
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} color={color} startContent={<PlusCircle size={18} />}>
          Add New Service
        </Button>
      </div>
      <Table aria-label="Professional Services Table">
        <TableHeader>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          items={services}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading services..." />}
          emptyContent={"No services found."}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.service_type}</TableCell>
              <TableCell>${String(item.price)}</TableCell>
              <TableCell>{item.is_available ? 'Available' : 'Unavailable'}</TableCell>
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
                {selectedService ? 'Edit Service' : 'Add New Service'}
              </ModalHeader>
              <ModalBody>
                <Input label="Service Type" value={serviceType} onValueChange={setServiceType} fullWidth placeholder="e.g., developmental-editing" />
                <Input label="Title" value={title} onValueChange={setTitle} fullWidth />
                <Textarea label="Description" value={description} onValueChange={setDescription} fullWidth />
                <Input label="Price" value={String(price)} onValueChange={setPrice} fullWidth type="number" />
                <Switch isSelected={isAvailable} onValueChange={setIsAvailable}>Available</Switch>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={color} onPress={handleSave} isLoading={isLoading}>
                  {selectedService ? 'Save Changes' : 'Create Service'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}