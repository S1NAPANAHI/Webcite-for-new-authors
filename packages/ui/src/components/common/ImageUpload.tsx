import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface ImageUploadProps {
  folder: string;
  onUpload: (url: string) => void;
  onError: (error: string) => void;
  onStart?: () => void;
  children: React.ReactNode;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  folder,
  onUpload,
  onError,
  onStart,
  children,
  accept = 'image/png, image/jpeg, image/jpg, image/gif, image/webp',
  maxSizeMB = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.match('image.*')) {
      onError('Only image files are allowed');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    try {
      onStart?.();
      setIsUploading(true);

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('timeline')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('timeline')
        .getPublicUrl(filePath);

      // Call the onUpload callback with the public URL
      onUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      onError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up the file input when the component unmounts
  useEffect(() => {
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative ${isUploading ? 'opacity-50 pointer-events-none' : ''} ${
        isDragging ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />
      {children}
    </div>
  );
};

export default ImageUpload;
