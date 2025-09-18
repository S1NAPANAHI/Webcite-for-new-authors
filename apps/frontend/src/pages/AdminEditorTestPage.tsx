import React from 'react';
import AdvancedEditor from '../components/AdvancedEditor';

export default function AdminEditorTestPage() {
  const handleSave = (html) => {
    console.log('Saving content:', html);
    // In a real application, you would send this HTML to your backend or Supabase
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Advanced Editor Test Page</h1>
      <AdvancedEditor onSave={handleSave} initialContent="<p>Hello, <strong>world</strong>!</p>" />
    </div>
  );
}
