import { Mark } from '@tiptap/core';
import { markInputRule, markPasteRule } from '@tiptap/core';

const inputRegex = /(?:^|\s)((?:\\|\\)((?:[^|]+))(?:\\S*\\|\\))$/;
const pasteRegex = /(?:^|\s)((?:\\|\\)((?:[^|]+))(?:\\S*\\|\\))/g;

export const Spoiler = Mark.create({
  name: 'spoiler',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'spoiler', // Add a class for styling
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span.spoiler', // Parse <span> with class "spoiler"
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      toggleSpoiler: ({ commands }) => {
        return commands.toggleMark(this.type.name);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-x': () => (this.editor.commands as any).toggleSpoiler(),
    };
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ];
  },
});