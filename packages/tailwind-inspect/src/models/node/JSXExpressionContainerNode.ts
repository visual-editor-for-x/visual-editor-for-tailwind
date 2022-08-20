import * as babel from "@babel/types";
import { JSXElementNode } from "./JSXElementNode";
import { NodeBase } from "./NodeBase";

export class JSXExpressionContainerNode extends NodeBase<
  JSXElementNode,
  JSXExpressionContainerNode,
  never
> {
  constructor(ast: babel.JSXExpressionContainer) {
    super();
    this.ast = ast;
  }

  ast: babel.JSXExpressionContainer;

  loadAST(ast: babel.JSXExpressionContainer): void {
    this.ast = ast;
  }

  updateAST(): void {}
}
