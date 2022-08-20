import * as babel from "@babel/types";
import { JSXElementNode } from "./JSXElementNode";
import { NodeBase } from "./NodeBase";

export class JSXSpreadChildNode extends NodeBase<
  JSXElementNode,
  JSXSpreadChildNode,
  never
> {
  constructor(ast: babel.JSXSpreadChild) {
    super();
    this.ast = ast;
  }

  ast: babel.JSXSpreadChild;

  loadAST(ast: babel.JSXSpreadChild): void {
    this.ast = ast;
  }

  updateAST(): void {}
}
