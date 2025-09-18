import { Mark } from '@tiptap/core'

export const Footnote = Mark.create({
  name: 'footnote',
  
  addAttributes() {
    return {
      number: { default: 1 },
      content: { default: '' }
    }
  },

  parseHTML() {
    return [{ tag: 'sup[data-footnote]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'sup',
      mergeAttributes(HTMLAttributes, {
        'data-footnote': HTMLAttributes.number,
        class: 'text-blue-600 cursor-pointer hover:underline'
      }),
      HTMLAttributes.number
    ]
  },

  addCommands() {
    return {
      setFootnote: (attributes) => ({ chain }) => {
        return chain()
          .setMark(this.name, attributes)
          .run()
      }
    }
  }
})
