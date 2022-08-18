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
    const components = new Map<babel.Statement, ComponentNode>(
      this.children.map((child) => [child.originalAST, child])
    );

    const ast = babel.cloneNode(this.originalAST, false);
    ast.program.body = ast.program.body.map((child) => {
      return components.get(child)?.toAST() || child;
    });
    return ast;
  }
}
