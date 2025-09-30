import React from 'react';
import { BookGlyphs } from '../../../assets/glyphs';
import { Book } from '../../../lib/api-timeline';

interface BookOverlayProps {
  books: Book[];
}

export const BookOverlay: React.FC<BookOverlayProps> = ({ books }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Book Legend */}
      <div className="absolute bottom-4 left-4 bg-timeline-card rounded-lg p-3 opacity-80 pointer-events-auto shadow-lg">
        <h4 className="text-sm font-bold text-timeline-text mb-2">Book Chronicles</h4>
        {books.slice(0, 5).map(book => {
          const BookGlyph = BookGlyphs[book.glyph as keyof typeof BookGlyphs];
          return (
            <div key={book.id} className="flex items-center space-x-2 text-xs text-timeline-text">
              {BookGlyph && <BookGlyph className="w-3 h-3" style={{ color: book.colorcode }} />}
              <span>{book.title}</span>
            </div>
          );
        })}
        {books.length > 5 && (
          <div className="text-xs text-timeline-text opacity-60 mt-1">
            +{books.length - 5} more...
          </div>
        )}
      </div>
    </div>
  );
};