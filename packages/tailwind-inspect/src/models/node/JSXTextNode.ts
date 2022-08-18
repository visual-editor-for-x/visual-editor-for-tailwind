import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { JSXElementNode } from "./JSXElementNode";
import * as babel from "@babel/types";
import { observable } from "mobx";
import { clone } from "lodash-es";

export class JSXTextNode extends TreeNode<JSXElementNode, JSXTextNode, never> {
  constructor(ast: babel.JSXText) {
    super();
    this.originalAST = ast;
    this.value = ast.value;
  }

  @observable value: string;

  originalAST: babel.JSXText;

  loadAST(ast: babel.JSXText) {
    this.originalAST = ast;
    this.value = ast.value;
  }

  toAST(): babel.JSXText {
    const ast = clone(this.originalAST);
    ast.value = this.value;
    return ast;
  }
}
