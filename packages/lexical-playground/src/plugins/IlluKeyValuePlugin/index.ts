import type {TextNode} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalTextEntity} from '@lexical/react/useLexicalTextEntity';
import {useCallback, useEffect} from 'react';

import { $createKeyValueNode, KeyValueNode } from '../../nodes/KeyValueNode'

function getRegexString(): string {
  const keyValue = '(\\w{2,}):(\\w*)'


  return keyValue;
}

const REGEX = new RegExp(getRegexString(), 'i');

export default function KeyValuePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([KeyValueNode])) {
      throw new Error('KeyValuePlugin: KeyValueNode not registered on editor');
    }
  }, [editor]);

  const createKeyValueNode = useCallback((textNode: TextNode): KeyValueNode => {
    return $createKeyValueNode(textNode.getTextContent());
  }, []);

  const getKeyValueMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text);


    if (matchArr === null) {
      return null;
    }

    const keyValueLength = matchArr[0].length;
    const startOffset = matchArr.index
    const endOffset = startOffset + keyValueLength;
    console.log('###', matchArr, keyValueLength, startOffset, endOffset)
    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  useLexicalTextEntity<KeyValueNode>(
    getKeyValueMatch,
    KeyValueNode,
    createKeyValueNode,
  );

  return null;
}
