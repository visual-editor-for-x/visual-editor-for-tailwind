import { JSXElementNode } from "./JSXElementNode";
import { SourceFileNode } from "./SourceFileNode";
import * as babel from "@babel/types";
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
  static maybeCreate(
    ast: babel.Statement,
    getReusableComponent: (name?: string) => ComponentNode | undefined
  ): ComponentNode | undefined {
    const foundComponent = findComponentFromStatement(ast);
    if (foundComponent) {
      const component = getReusableComponent(foundComponent.name);
      if (component) {
        component.loadFoundComponent(foundComponent);
        return component;
      }
      return new ComponentNode(foundComponent);
    }
  }

  constructor(foundComponent: FoundComponent) {
    super();
    this.ast = foundComponent.statement;
    this.componentName = foundComponent.name;
    this.rootElement = new JSXElementNode(foundComponent.element);
    this.append(this.rootElement);
  }

  ast: babel.ExportDefaultDeclaration | babel.ExportNamedDeclaration;
  componentName: string | undefined;
  rootElement: JSXElementNode;

  loadFoundComponent(foundComponent: FoundComponent) {
    this.ast = foundComponent.statement;
    this.componentName = foundComponent.name;
    this.rootElement.loadAST(foundComponent.element);
  }

  updateAST(): void {
    this.rootElement.updateAST();
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
