import * as babel from "@babel/types";
import { NodeBase } from "./NodeBase";
import { makeObservable } from "mobx";
import { JSXElementNode } from "./JSXElementNode";
import { createNodesFromASTs, JSXNode } from "./JSXNode";

export class JSXFragmentNode extends NodeBase<
  JSXFragmentNode | JSXElementNode,
  JSXFragmentNode,
  JSXNode
> {
  constructor(ast: babel.JSXFragment) {
    super();
    this.ast = ast;
    this.loadAST(ast);
    makeObservable(this);
  }

  ast: babel.JSXFragment;

  loadAST(ast: babel.JSXFragment) {
    const children = createNodesFromASTs(ast.children, this.children);
    this.ast = ast;
    this.clear();
    this.append(...children);
  }

  updateAST(): void {
    const children = this.children;
    children.forEach((c) => c.updateAST());
    this.ast.children = children.map((c) => c.ast);
  }
}
