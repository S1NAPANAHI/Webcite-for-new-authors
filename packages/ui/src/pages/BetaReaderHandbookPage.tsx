import React from 'react';
import MarkdownViewer from '../components/MarkdownViewer';

const BetaReaderHandbookPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Beta Reader Handbook</h1>
      <MarkdownViewer filePath="/docs/Documentation for Zoroasterverse Website/community_engagement/beta_program/beta_reader_handbook.md" />
    </div>
  );
};

export default BetaReaderHandbookPage;