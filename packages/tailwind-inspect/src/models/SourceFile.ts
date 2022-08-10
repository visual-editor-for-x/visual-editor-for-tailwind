import { File as FileAST, JSXElement } from "@babel/types";
import { compact } from "lodash-es";
import { computed, makeObservable, observable, reaction } from "mobx";
import { NodeSelection } from "./NodeSelection";
import { Style } from "./Style";
import { StyleInspectorTarget } from "./StyleInspectorTarget";

interface JSXRoot {
  name?: string;
  element: JSXElement;
}

export class SourceFile {
  constructor(ast: FileAST) {
    this.ast = ast;
    this.jsxRoots = this.getJSXRoots();

    reaction(
      () => this.selectedElements,
      (elements) => {
        console.log(elements);
      }
    );
  }

  readonly ast: FileAST;
  readonly jsxRoots: readonly JSXRoot[];

  private getJSXRoots(): JSXRoot[] {
    const statements = this.ast.program.body;

    const jsxRoots: JSXRoot[] = [];

    for (const statement of statements) {
      if (
        statement.type === "ExportDefaultDeclaration" ||
        statement.type === "ExportNamedDeclaration"
      ) {
        const declaration = statement.declaration;
        if (declaration?.type === "FunctionDeclaration") {
          const name = declaration.id?.name;
          const body = declaration.body;
          if (body.type === "BlockStatement") {
            const bodyStatements = body.body;
            for (const bodyStatement of bodyStatements) {
              if (bodyStatement.type === "ReturnStatement") {
                const returnStatement = bodyStatement;
                const returnValue = returnStatement.argument;
                if (returnValue?.type === "JSXElement") {
                  jsxRoots.push({
                    name,
                    element: returnValue,
                  });
                }
              }
            }
          }
        }
      }
    }

    return jsxRoots;
  }

  selection = new NodeSelection();

  @computed get selectedElements(): readonly JSXElement[] {
    const nodes = this.selection.allPaths.map((path) => this.nodeForPath(path));
    return nodes.filter(
      (node): node is JSXElement => node?.type === "JSXElement"
    );
  }

  @computed get inspectorTargets(): StyleInspectorTarget[] {
    return this.selectedElements.map((element) => {
      let tagName: string;
      if (element.openingElement.name.type === "JSXIdentifier") {
        tagName = element.openingElement.name.name;
      } else {
        tagName = "div";
      }

      const style = new Style();
      style.loadTailwind(classNameForJSXElement(element) ?? "");

      // TODO: set style to AST

      const computedStyle = new Style();

      return {
        tagName,
        style,
        computedStyle,
      };
    });
  }

  nodeForPath(
    path: readonly number[]
  ): JSXElement["children"][number] | undefined {
    if (path.length === 0) {
      return undefined;
    }

    const [index, ...rest] = path;

    if (index >= this.jsxRoots.length) {
      return undefined;
    }
    return nodeForPath(this.jsxRoots[index].element, rest);
  }
}

function nodeForPath(
  node: JSXElement,
  path: readonly number[]
): JSXElement["children"][number] | undefined {
  if (path.length === 0) {
    return node;
  }

  const [nextIndex, ...rest] = path;
  const children = node.children;
  if (nextIndex < children.length) {
    const child = children[nextIndex];
    if (rest.length === 0) {
      return child;
    }

    if (child.type === "JSXElement") {
      return nodeForPath(child, rest);
    }
  }
}

function classNameForJSXElement(element: JSXElement): string | undefined {
  for (const attribute of element.openingElement.attributes) {
    if (attribute.type !== "JSXAttribute") {
      continue;
    }
    if (attribute.name.name !== "className") {
      continue;
    }

    const value = attribute.value;
    if (value?.type !== "StringLiteral") {
      continue;
    }

    return value.value;
  }
}
