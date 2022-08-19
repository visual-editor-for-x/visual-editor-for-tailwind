import { JSXElementNode } from "./JSXElementNode";
import * as babel from "@babel/types";
import { makeObservable, observable } from "mobx";
import { NodeBase } from "./NodeBase";

export class JSXTextNode extends NodeBase<JSXElementNode, JSXTextNode, never> {
  constructor(ast: babel.JSXText) {
    super();
    this.ast = ast;
    this.value = ast.value;
    makeObservable(this);
  }

  @observable value: string;

  ast: babel.JSXText;

  loadAST(ast: babel.JSXText) {
    this.ast = ast;
    this.value = ast.value;
  }

  updateAST() {
    this.ast.value = this.value;
  }
}
