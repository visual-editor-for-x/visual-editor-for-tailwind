import * as babel from "@babel/types";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { JSXElementNode } from "./JSXElementNode";
import { JSXExpressionContainerNode } from "./JSXExpressionContainerNode";
import { JSXFragmentNode } from "./JSXFragmentNode";
import { JSXSpreadChildNode } from "./JSXSpreadChildNode";
import { JSXTextNode } from "./JSXTextNode";

export type JSXNode =
  | JSXElementNode
  | JSXTextNode
  | JSXFragmentNode
  | JSXExpressionContainerNode
  | JSXSpreadChildNode;

export function createNodesFromASTs(
  asts: babel.JSXElement["children"],
  oldChildren: readonly JSXNode[]
): JSXNode[] {
  const oldElementNodes = filterInstance(oldChildren, [JSXElementNode]);
  const oldFragmentNodes = filterInstance(oldChildren, [JSXFragmentNode]);
  const oldTextNodes = filterInstance(oldChildren, [JSXTextNode]);
  const oldExpressionContainerNodes = filterInstance(oldChildren, [
    JSXExpressionContainerNode,
  ]);
  const oldSpreadChildNodes = filterInstance(oldChildren, [JSXSpreadChildNode]);

  return asts.map((child) => {
    switch (child.type) {
      case "JSXText": {
        const node = oldTextNodes.shift();
        if (node) {
          node.loadAST(child);
          return node;
        } else {
          return new JSXTextNode(child);
        }
      }
      case "JSXExpressionContainer": {
        const node = oldExpressionContainerNodes.shift();
        if (node) {
          node.loadAST(child);
          return node;
        }
        return new JSXExpressionContainerNode(child);
      }
      case "JSXSpreadChild": {
        const node = oldSpreadChildNodes.shift();
        if (node) {
          node.loadAST(child);
          return node;
        }
        return new JSXSpreadChildNode(child);
      }
      case "JSXElement": {
        const node = oldElementNodes.shift();
        if (node) {
          node.loadAST(child);
          return node;
        }
        return new JSXElementNode(child);
      }
      case "JSXFragment": {
        const node = oldFragmentNodes.shift();
        if (node) {
          node.loadAST(child);
          return node;
        }
        return new JSXFragmentNode(child);
      }
    }
  });
}
