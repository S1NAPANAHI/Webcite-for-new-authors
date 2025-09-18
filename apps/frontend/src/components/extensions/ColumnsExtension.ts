import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',

  addAttributes() {
    return {
      count: {
        default: 2,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
        getAttrs: node => ({
          count: node.dataset.count ? parseInt(node.dataset.count, 10) : 2,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 
        'data-type': 'columns', 
        class: 'grid gap-4', // Converted to Tailwind classes
        style: `grid-template-columns: repeat(${HTMLAttributes.count}, 1fr);` // Dynamic part remains inline
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setColumns: (count) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { count },
          content: Array(count).fill({ type: 'column', content: [{ type: 'paragraph' }] }),
        });
      },
    };
  },
});

export const Column = Node.create({
  name: 'column',
  group: 'column',
  content: 'block+',
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'column', class: 'p-2 border border-gray-200 rounded' }), // Added basic styling
      0,
    ];
  },
});
