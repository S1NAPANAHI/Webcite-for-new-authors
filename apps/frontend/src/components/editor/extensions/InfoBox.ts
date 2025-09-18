import { Node, mergeAttributes } from '@tiptap/core'

export const InfoBox = Node.create({
  name: 'infoBox',
  group: 'block',
  content: 'inline*',
  
  parseHTML() {
    return [{ tag: 'div[data-type="info-box"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'info-box',
        class: 'bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r-md'
      }),
      0
    ]
  },

  addCommands() {
    return {
      setInfoBox: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Info box content...' }] }]
        })
      }
    }
  }
})
