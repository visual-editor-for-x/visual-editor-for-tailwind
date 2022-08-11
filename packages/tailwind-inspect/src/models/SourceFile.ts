import { File as FileAST, JSXAttribute, JSXElement, react } from "@babel/types";
import { computed, makeObservable, observable, reaction } from "mobx";
import { parse } from "@babel/parser";
import { transform } from "@babel/standalone";
import { print } from "recast";
import { NodeSelection } from "./NodeSelection";
import { Style } from "./Style";
import { StyleInspectorTarget } from "./StyleInspectorTarget";

interface JSXRoot {
  name?: string;
  element: JSXElement;
}

export class SourceFile {
  constructor(code: string) {
    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    this.ast = ast;
    this.jsxRoots = this.getJSXRoots();
    this._code = code;
    this.compileCode();

    makeObservable(this);

    reaction(
      () => this.selectedElements,
      (elements) => {
        console.log(elements);
      }
    );
  }

  readonly ast: FileAST;
  readonly jsxRoots: readonly JSXRoot[];

  @observable private _code: string;
  @observable private _compiledCode = "";

  get code(): string {
    return this._code;
  }

  get compiledCode(): string {
    return this._compiledCode;
  }

  private updateCode(): void {
    const { code } = print(this.ast);
    this._code = code;
    this.compileCode();
  }

  private compileCode() {
    const output = transform(this._code, {
      presets: ["env", "react"],
      plugins: ["transform-react-jsx-source"],
    }).code;
    //console.log(output);
    this._compiledCode = output;
  }

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

      reaction(
        () => style.toTailwind(),
        (className) => {
          console.log(className);
          setAttribute(element, "className", className);
          this.updateCode();
        }
      );

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

function setAttribute(
  element: JSXElement,
  key: string,
  value: string | undefined
) {
  if (!value) {
    element.openingElement.attributes =
      element.openingElement.attributes.filter(
        (attr) => !(attr.type === "JSXAttribute" && attr.name.name === key)
      );
    return;
  }

  const attribute = element.openingElement.attributes.find(
    (attr): attr is JSXAttribute =>
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      attr.name.name === key
  );
  if (attribute) {
    attribute.value = {
      type: "StringLiteral",
      value,
    };
  } else {
    element.openingElement.attributes.push({
      type: "JSXAttribute",
      name: {
        type: "JSXIdentifier",
        name: key,
      },
      value: {
        type: "StringLiteral",
        value,
      },
    });
  }
}
