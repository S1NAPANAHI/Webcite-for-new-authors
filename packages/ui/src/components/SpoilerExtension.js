import { Mark, mergeAttributes } from '@tiptap/core';
import { markInputRule, markPasteRule } from '@tiptap/core';
const inputRegex = /(?:^|\s)((?:\\|\\)((?:[^|]+))(:?\\S*\\|\\))$/;
const pasteRegex = /(?:^|\s)((?:\\|\\)((?:[^|]+))(:?\\S*\\|\\))/g;
export const Spoiler = Mark.create({
    name: 'spoiler',
    addOptions() {
        return {
            HTMLAttributes: {
                class: 'spoiler',
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'span.spoiler',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
        return {
            toggleSpoiler: () => ({ commands }) => {
                return commands.toggleMark(this.name);
            },
        };
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-x': () => this.editor.commands.toggleSpoiler(),
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
