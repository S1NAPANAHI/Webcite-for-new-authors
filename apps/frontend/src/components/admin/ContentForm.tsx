import React, { useState } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';

const ContentForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [section, setSection] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('homepage_content')
      .insert([{ title, content, section }]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Content created successfully!');
      setTitle('');
      setContent('');
      setSection('');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl mb-4">Add New Content</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Section</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full p-2 border"
            placeholder="e.g., hero, about, features"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border"
            rows={6}
            required
          ></textarea>
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Create Content
        </button>
        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default ContentForm;
