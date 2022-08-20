import * as babel from "@babel/types";
import { JSXElementNode } from "./JSXElementNode";
import { NodeBase } from "./NodeBase";

export class JSXOtherNode extends NodeBase<
  JSXElementNode,
  JSXOtherNode,
  never
> {
  constructor(
    ast: babel.JSXFragment | babel.JSXExpressionContainer | babel.JSXSpreadChild
  ) {
    super();
    this.ast = ast;
  }

  ast: babel.JSXFragment | babel.JSXExpressionContainer | babel.JSXSpreadChild;

  loadAST(
    ast: babel.JSXFragment | babel.JSXExpressionContainer | babel.JSXSpreadChild
  ): void {
    this.ast = ast;
  }

  updateAST(): void {}
}
