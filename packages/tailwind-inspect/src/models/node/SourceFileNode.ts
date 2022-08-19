import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { ComponentNode } from "./ComponentNode";
import * as babel from "@babel/types";
import { clone, compact } from "lodash-es";
import { makeObservable, observable } from "mobx";
import { NodeBase } from "./NodeBase";

export class SourceFileNode extends NodeBase<
  never,
  SourceFileNode,
  ComponentNode
> {
  constructor(ast: babel.File) {
    super();
    this.originalAST = ast;
    this.loadAST(ast);
  }

  originalAST: babel.File;

  loadAST(ast: babel.File) {
    // TODO: reuse instances
    const components = compact(
      ast.program.body.map((child) => ComponentNode.maybeCreate(child))
    );

    this.originalAST = ast;
    this.clear();
    this.append(...components);
  }

  toAST(): babel.File {
    this.children.forEach((c) => c.toAST());
    return this.originalAST;
  }
}
