import * as babel from "@babel/types";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { makeObservable, observable } from "mobx";
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
    this.originalAST = ast;
  }

  originalAST:
    | babel.JSXFragment
    | babel.JSXExpressionContainer
    | babel.JSXSpreadChild;

  loadAST(
    ast: babel.JSXFragment | babel.JSXExpressionContainer | babel.JSXSpreadChild
  ) {
    this.originalAST = ast;
  }

  toAST():
    | babel.JSXFragment
    | babel.JSXExpressionContainer
    | babel.JSXSpreadChild {
    return this.originalAST;
  }
}
