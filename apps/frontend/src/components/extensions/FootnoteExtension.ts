import { Mark } from '@tiptap/core';

export default Mark.create({
  name: 'footnote',

  addAttributes() {
    return {
      number: {
        default: 1,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'sup[data-footnote]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'sup',
      {
        'data-footnote': HTMLAttributes.number,
        class: 'text-xs align-super',
      },
      this.options.renderLabel?.(HTMLAttributes.number) || HTMLAttributes.number,
    ];
  },

  addCommands() {
    return {
      addFootnote: () => ({ chain }) => {
        const num = prompt('Footnote number');
        if (num) {
          return chain().setMark(this.name, { number: num }).run();
        }
        return false;
      },
    };
  },
});
