import { JSXElementNode } from "./JSXElementNode";
import * as babel from "@babel/types";
import { makeObservable, observable } from "mobx";
import { NodeBase } from "./NodeBase";

export class JSXTextNode extends NodeBase<JSXElementNode, JSXTextNode, never> {
  constructor(ast: babel.JSXText) {
    super();
    this.originalAST = ast;
    this.value = ast.value;
    makeObservable(this);
  }

  @observable value: string;

  originalAST: babel.JSXText;

  loadAST(ast: babel.JSXText) {
    this.originalAST = ast;
    this.value = ast.value;
  }

  toAST(): babel.JSXText {
    const ast = babel.cloneNode(this.originalAST, false);
    ast.value = this.value;
    return ast;
  }
}
