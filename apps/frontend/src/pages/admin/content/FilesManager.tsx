import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilesManager = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get('/api/files/files');
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('/api/files/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      setSelectedFile(null);
      fetchFiles(); // Refresh the list of files
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file.');
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`/api/files/files/${id}`);
        setFiles(files.filter(file => file.id !== id));
      } catch (err) {
        console.error('Error deleting file:', err);
        setError('Failed to delete file.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Files & Media Manager</h1>

      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Upload New File</h2>
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button 
          onClick={handleFileUpload}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload File
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Existing Files</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Filename</th>
            <th className="py-2 px-4 border-b">MIME Type</th>
            <th className="py-2 px-4 border-b">Size (bytes)</th>
            <th className="py-2 px-4 border-b">URL</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file: any) => (
            <tr key={file.id}>
              <td className="border px-4 py-2">{file.filename}</td>
              <td className="border px-4 py-2">{file.mime_type}</td>
              <td className="border px-4 py-2">{file.size_bytes}</td>
              <td className="border px-4 py-2">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View
                </a>
              </td>
              <td className="border px-4 py-2">
                <button 
                  onClick={() => handleDeleteFile(file.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FilesManager;