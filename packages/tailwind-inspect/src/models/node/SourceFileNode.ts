import { ComponentNode } from "./ComponentNode";
import * as babel from "@babel/types";
import { compact } from "lodash-es";
import { NodeBase } from "./NodeBase";

export class SourceFileNode extends NodeBase<
  never,
  SourceFileNode,
  ComponentNode
> {
  constructor(ast: babel.File) {
    super();
    this.ast = ast;
    this.loadAST(ast);
  }

  ast: babel.File;

  loadAST(ast: babel.File): void {
    const oldChildren = [...this.children];

    const components = compact(
      ast.program.body.map((child) =>
        ComponentNode.maybeCreate(child, () => oldChildren.pop())
      )
    );

    this.ast = ast;
    this.clear();
    this.append(...components);
  }

  updateAST(): void {
    this.children.forEach((c) => c.updateAST());
  }
}
