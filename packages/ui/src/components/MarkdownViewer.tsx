import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

interface MarkdownViewerProps {
  filePath: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        const html = marked(markdown);
        setContent(html);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading content: {error}</div>;
  }

  return (
    <div className="prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default MarkdownViewer;