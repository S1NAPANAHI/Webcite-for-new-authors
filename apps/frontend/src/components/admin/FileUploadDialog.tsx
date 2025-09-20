import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { v4 as uuid } from 'uuid';
import { Upload, Loader2, AlertCircle, FolderOpen } from 'lucide-react';

/* folders that match your Supabase storage structure */
export const FOLDERS = [
  'backgrounds',
  'characters', 
  'banners',
  'covers',
  'heroes',
  'misc',
] as const;

type Folder = typeof FOLDERS[number];

interface Props {
  onUploaded?: () => void;          // parent refresh callback
  className?: string;
  defaultFolder?: Folder;
}

export const FileUploadDialog: React.FC<Props> = ({ 
  onUploaded, 
  className = '',
  defaultFolder = 'misc' 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<Folder>(defaultFolder);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function upload() {
    if (!file) { 
      setError('Please choose a file'); 
      return; 
    }
    
    setBusy(true); 
    setError(null);
    setSuccess(false);

    try {
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? 'media';
      const fileId = uuid();
      const cleanFileName = file.name.replaceAll(' ', '_').replaceAll(/[^a-zA-Z0-9._-]/g, '');
      const path = `${folder}/${fileId}-${cleanFileName}`;

      console.log('Uploading to:', { bucket, path, folder });

      // 1. Upload to Supabase Storage
      const { error: upErr } = await supabase
        .storage.from(bucket)
        .upload(path, file, { 
          cacheControl: '3600', 
          upsert: false 
        });
      
      if (upErr) throw upErr;

      // 2. Create database record
      const { error: dbErr } = await supabase.from('files').insert({
        id: fileId,
        name: cleanFileName,
        original_name: file.name,
        bucket,
        path,
        folder,
        type: 'images', // assuming images for now
        mime_type: file.type,
        size: file.size,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (dbErr) throw dbErr;

      console.log('Upload successful:', { fileId, folder, path });
      
      setFile(null);
      setSuccess(true);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      if (onUploaded) onUploaded();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (e: any) {
      console.error('Upload error:', e);
      setError(e.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`file-upload-dialog bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Upload Files
      </h3>
      
      {/* File Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose File
          </label>
          <input
            type="file"
            onChange={e => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
              setSuccess(false);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
            accept="image/*"
          />
        </div>

        {/* Folder Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Save to Folder
          </label>
          <select
            value={folder}
            onChange={e => setFolder(e.target.value as Folder)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {FOLDERS.map(f => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* File Info */}
        {file && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>File:</strong> {file.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Type:</strong> {file.type}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Will save to:</strong> {folder}/
            </p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={upload}
          disabled={!file || busy}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            busy
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : file
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {file ? `Upload to ${folder}` : 'Choose a file first'}
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
            <div className="w-4 h-4 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-sm">File uploaded successfully to {folder} folder!</span>
          </div>
        )}
      </div>
    </div>
  );
};