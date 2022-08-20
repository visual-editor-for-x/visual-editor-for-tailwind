import * as babel from "@babel/types";
import { JSXElementNode } from "./JSXElementNode";
import { JSXFragmentNode } from "./JSXFragmentNode";
import { NodeBase } from "./NodeBase";

export class JSXExpressionContainerNode extends NodeBase<
  JSXElementNode,
  JSXExpressionContainerNode,
  JSXElementNode | JSXFragmentNode
> {
  constructor(ast: babel.JSXExpressionContainer) {
    super();
    this.ast = ast;
    this.loadAST(ast);
  }

  ast: babel.JSXExpressionContainer;

  loadAST(ast: babel.JSXExpressionContainer): void {
    this.ast = ast;

    let childElement: babel.JSXElement | babel.JSXFragment | undefined;

    babel.traverse(ast, (node) => {
      if (
        !childElement &&
        (node.type === "JSXElement" || node.type === "JSXFragment")
      ) {
        childElement = node;
      }
    });

    const oldChild = this.firstChild;
    this.clear();

    if (childElement) {
      if (oldChild && oldChild.ast.type === childElement.type) {
        oldChild.loadAST(childElement as any);
        this.append(oldChild);
      } else {
        const newChild =
          childElement.type === "JSXElement"
            ? new JSXElementNode(childElement)
            : new JSXFragmentNode(childElement);
        this.append(newChild);
      }
    }
  }

  updateAST(): void {}
}
