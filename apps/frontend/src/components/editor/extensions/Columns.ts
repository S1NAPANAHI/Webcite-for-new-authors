import { Node, mergeAttributes } from '@tiptap/core'

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: 'grid grid-cols-2 gap-4 my-4'
      }),
      0
    ]
  },

  addCommands() {
    return {
      setColumns: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [
            { type: 'column', content: [{ type: 'paragraph' }] },
            { type: 'column', content: [{ type: 'paragraph' }] }
          ]
        })
      }
    }
  }
})

export const Column = Node.create({
  name: 'column',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
        class: 'column'
      }),
      0
    ]
  }
})
