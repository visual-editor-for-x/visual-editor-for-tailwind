import * as babel from "@babel/types";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { JSXElementNode } from "./JSXElementNode";
import { JSXFragmentNode } from "./JSXFragmentNode";
import { JSXOtherNode } from "./JSXOtherNode";
import { JSXTextNode } from "./JSXTextNode";

export type JSXNode =
  | JSXElementNode
  | JSXTextNode
  | JSXOtherNode
  | JSXFragmentNode;

export function createNodesFromASTs(
  asts: babel.JSXElement["children"],
  oldChildren: readonly JSXNode[]
): JSXNode[] {
  const oldElementNodes = filterInstance(oldChildren, [JSXElementNode]);
  const oldFragmentNodes = filterInstance(oldChildren, [JSXFragmentNode]);
  const oldTextNodes = filterInstance(oldChildren, [JSXTextNode]);
  const oldOtherNodes = filterInstance(oldChildren, [JSXOtherNode]);

  return asts.map((child) => {
    if (child.type === "JSXText") {
      const node = oldTextNodes.shift();
      if (node) {
        node.loadAST(child);
        return node;
      } else {
        return new JSXTextNode(child);
      }
    } else if (child.type === "JSXFragment") {
      const node = oldFragmentNodes.shift();
      if (node) {
        node.loadAST(child);
        return node;
      } else {
        return new JSXFragmentNode(child);
      }
    } else if (child.type === "JSXElement") {
      const node = oldElementNodes.shift();
      if (node) {
        node.loadAST(child);
        return node;
      } else {
        return new JSXElementNode(child);
      }
    } else {
      const node = oldOtherNodes.shift();
      if (node) {
        node.loadAST(child);
        return node;
      } else {
        return new JSXOtherNode(child);
      }
    }
  });
}
