/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from 'lexical';

import {addClassNamesToElement} from '@lexical/utils';
import {$applyNodeReplacement, TextNode} from 'lexical';


const keyValueStyle = 'background-color: #ffff00;'

/** @noInheritDoc */
export class KeyValueNode extends TextNode {
  static getType(): string {
    return 'KeyValue';
  }

  static clone(node: KeyValueNode): KeyValueNode {
    return new KeyValueNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config)
    element.style.cssText = keyValueStyle
    element.className = 'keyValue'

    // addClassNamesToElement(element, config.theme.hashtag); // TODO KeyValue theme
    return element;
  }

  static importJSON(serializedNode: SerializedTextNode): KeyValueNode {
    const node = $createKeyValueNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: 'KeyValue',
    };
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createKeyValueNode(text = ''): KeyValueNode {
  return $applyNodeReplacement(new KeyValueNode(text));
}

export function $isKeyValueNode(
  node: LexicalNode | null | undefined,
): node is KeyValueNode {
  return node instanceof KeyValueNode;
}
