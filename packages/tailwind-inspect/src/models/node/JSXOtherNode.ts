import * as babel from "@babel/types";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { JSXElementNode } from "./JSXElementNode";

export class JSXOtherNode extends TreeNode<
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

  toAST():
    | babel.JSXFragment
    | babel.JSXExpressionContainer
    | babel.JSXSpreadChild {
    return this.ast;
  }
}
