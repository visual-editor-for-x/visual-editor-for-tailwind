import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { JSXElementNode } from "./JSXElementNode";
import { SourceFileNode } from "./SourceFileNode";
import * as babel from "@babel/types";

interface FoundComponent {
  name?: string;
  statement: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration;
  element: babel.JSXElement;
}

export class ComponentNode extends TreeNode<
  SourceFileNode,
  ComponentNode,
  JSXElementNode
> {
  constructor(foundComponent: FoundComponent) {
    super();
    this.originalAST = foundComponent.statement;
    this.componentName = foundComponent.name;
    this.root = new JSXElementNode(foundComponent.element);
  }

  originalAST: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration;
  componentName: string | undefined;
  root: JSXElementNode;

  loadAST(ast: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration) {
    const foundComponent = findComponentFromStatement(ast);
    if (!foundComponent) {
      throw new Error("No JSX Root");
    }

    this.originalAST = ast;
    this.componentName = foundComponent.name;
    this.root.loadAST(foundComponent.element);
  }

  toAST(): babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration {
    // TODO: avoid copying the return value deeply

    const statement = babel.cloneNode(this.originalAST);

    const declaration = statement.declaration;
    if (declaration?.type === "FunctionDeclaration") {
      for (const bodyStatement of declaration.body.body) {
        if (bodyStatement.type === "ReturnStatement") {
          bodyStatement.argument = this.root.toAST();
        }
      }
    }

    return statement;
  }

  static maybeCreate(ast: babel.Statement): ComponentNode | undefined {
    const foundComponent = findComponentFromStatement(ast);
    if (foundComponent) {
      return new ComponentNode(foundComponent);
    }
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
