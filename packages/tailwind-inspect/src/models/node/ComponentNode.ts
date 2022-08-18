import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { JSXElementNode } from "./JSXElementNode";
import { SourceFileNode } from "./SourceFileNode";
import * as babel from "@babel/types";
import { makeObservable, observable } from "mobx";
import { NodeBase } from "./NodeBase";

interface FoundComponent {
  name?: string;
  statement: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration;
  element: babel.JSXElement;
}

export class ComponentNode extends NodeBase<
  SourceFileNode,
  ComponentNode,
  JSXElementNode
> {
  static maybeCreate(ast: babel.Statement): ComponentNode | undefined {
    const foundComponent = findComponentFromStatement(ast);
    if (foundComponent) {
      return new ComponentNode(foundComponent);
    }
  }

  constructor(foundComponent: FoundComponent) {
    super();
    this.originalAST = foundComponent.statement;
    this.componentName = foundComponent.name;
    this.rootElement = new JSXElementNode(foundComponent.element);
    this.append(this.rootElement);
  }

  originalAST: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration;
  componentName: string | undefined;
  rootElement: JSXElementNode;

  loadAST(ast: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration) {
    const foundComponent = findComponentFromStatement(ast);
    if (!foundComponent) {
      throw new Error("No JSX Root");
    }

    this.originalAST = ast;
    this.componentName = foundComponent.name;
    this.rootElement.loadAST(foundComponent.element);
  }

  toAST(): babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration {
    // TODO: avoid copying the return value deeply

    const statement = babel.cloneNode(this.originalAST);

    const declaration = statement.declaration;
    if (declaration?.type === "FunctionDeclaration") {
      for (const bodyStatement of declaration.body.body) {
        if (bodyStatement.type === "ReturnStatement") {
          bodyStatement.argument = this.rootElement.toAST();
        }
      }
    }

    return statement;
  }
}

function findComponentFromStatement(
  statement: babel.Statement
): FoundComponent | undefined {
  if (
    statement.type !== "ExportDefaultDeclaration" &&
    statement.type !== "ExportNamedDeclaration"
  ) {
    return;
  }

  const declaration = statement.declaration;
  if (declaration?.type !== "FunctionDeclaration") {
    return;
  }

  const name = declaration.id?.name;
  for (const bodyStatement of declaration.body.body) {
    if (bodyStatement.type === "ReturnStatement") {
      const returnStatement = bodyStatement;
      const returnValue = returnStatement.argument;
      if (returnValue?.type === "JSXElement") {
        return {
          statement,
          name,
          element: returnValue,
        };
      }
    }
  }
}
