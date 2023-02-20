import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, COMMAND_PRIORITY_EDITOR, CONTROLLED_TEXT_INSERTION_COMMAND, createCommand, LexicalCommand, TextNode } from 'lexical'
import { useEffect } from 'react'
import { mergeRegister } from '@lexical/utils'

export const FUT_COMMAND: LexicalCommand<string> = createCommand('FUT_COMMAND')

export default function ITestPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => { /* Your handler logic here */
        if (e.key === 'f') {
          // editor.dispatchCommand(CONTROLLED_TEXT_INSERTION_COMMAND, 'fut! ')
          const isProcessed = editor.dispatchCommand(FUT_COMMAND, 'fut! ')
          if (isProcessed) e.preventDefault()
        }
      }

      const removeFutCommand = editor.registerCommand(
        FUT_COMMAND,
        (text: string) => {
          // way 1: dispatch a command:
          // editor.dispatchCommand(CONTROLLED_TEXT_INSERTION_COMMAND, text)

          // way 2: in editor.update():
          // Inside the `editor.update` you can use special $ prefixed helper functions.
          // These functions cannot be used outside the closure, and will error if you try.
          // (If you're familiar with React, you can imagine these to be a bit like using a hook
          // outside of a React function component).
          editor.update(() => {
            const root = $getRoot() // Get the RootNode from the EditorState
            const selection = $getSelection() // Get the selection from the EditorState
            console.log('selection:', selection)
            // const paragraphNode = $createParagraphNode() // Create a new ParagraphNode
            const textNode = $createTextNode('Futten') // Create a new TextNode
            textNode.setStyle('{ color:red;')

            // paragraphNode.append(textNode) // Append the text node to the paragraph
            // root.append(paragraphNode) // Finally, append the paragraph to the root
            if (selection) {
              selection.insertNodes([textNode])
            }
          })

          return true // this does not seem to have the desired effect, we need to call preventDefault() on the event
        },
        COMMAND_PRIORITY_EDITOR,
      )


      const removeRootListener = editor.registerRootListener(
        (
          rootElement: null | HTMLElement,
          prevRootElement: null | HTMLElement,
        ) => {
          prevRootElement?.removeEventListener('keydown', onKeyDown)
          rootElement?.addEventListener('keydown', onKeyDown)
        },
      )

      return mergeRegister(
        removeFutCommand,
        removeRootListener,
      )

    }, [editor],
  )

  return null
}
