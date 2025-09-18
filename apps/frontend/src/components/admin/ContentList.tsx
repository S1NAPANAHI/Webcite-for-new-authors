import React, { useEffect, useState } from 'react';
// Removed corrupted import

interface Content {
  id: number;
  created_at: string;
  title: string;
  content: string;
  section: string;
}

const ContentList: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*');

      if (error) {
        console.error('Error fetching content:', error);
      } else {
        setContent(data as Content[]);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading content...</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl mb-4">Existing Content</h2>
      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="p-4 border rounded">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-gray-500">Section: {item.section}</p>
            <p className="mt-2">{item.content}</p>
            <div className="mt-4 space-x-2">
              <button className="p-2 bg-yellow-500 text-white rounded text-sm">Edit</button>
              <button className="p-2 bg-red-500 text-white rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentList;

