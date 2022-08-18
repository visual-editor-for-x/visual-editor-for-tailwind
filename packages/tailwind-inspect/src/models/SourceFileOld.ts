import { File as FileAST, JSXElement } from "@babel/types";
import { computed, makeObservable, observable, reaction } from "mobx";
import { parse } from "@babel/parser";
import { transform } from "@babel/standalone";
import * as recast from "recast";
import { NodeSelection } from "./NodeSelection";
import { Style } from "./Style";
import { StyleInspectorTarget } from "./StyleInspectorTarget";
import { DebugSource } from "./DebugSource";
import { JSXElementUtil } from "./JSXElementUtil";

interface JSXRoot {
  name?: string;
  element: JSXElement;
}

export class SourceFileOld {
  constructor(code: string) {
    // const ast = parse(code, {
    //   sourceType: "module",
    //   plugins: ["jsx", "typescript"],
    //   tokens: true,
    // });
    const ast = recast.parse(code, {
      parser: {
        parse(code: string) {
          return parse(code, {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
            tokens: true,
          });
        },
      },
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
    const { code } = recast.print(this.ast);
    this._code = code;
    this.compileCode();
  }

  private compileCode() {
    const output = transform(this._code, {
      presets: ["env", "react"],
      plugins: ["transform-react-jsx-source"],
    }).code;
    //console.log(output);
    this._compiledCode = output ?? "";
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
      style.loadTailwind(
        JSXElementUtil.getAttribute(element, "className") ?? ""
      );

      reaction(
        () => style.toTailwind(),
        (className) => {
          console.log(className);
          JSXElementUtil.setAttribute(element, "className", className);
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
    return JSXElementUtil.nodeForPath(this.jsxRoots[index].element, rest);
  }

  selectFromDebugSource(debugSource: DebugSource): void {
    this.selection.clear();

    this.traverseWithPath((node, path) => {
      if (
        node.loc?.start.line === debugSource.lineNumber &&
        node.loc?.start.column === debugSource.columnNumber - 1
      ) {
        this.selection.add(path);
      }
    });
  }

  traverseWithPath(visit: (node: JSXElement, path: readonly number[]) => void) {
    const traverse = (node: JSXElement, path: readonly number[]) => {
      visit(node, path);
      for (const [index, child] of node.children.entries()) {
        if (child.type === "JSXElement") {
          traverse(child, [...path, index]);
        }
      }
    };

    for (const [index, root] of this.jsxRoots.entries()) {
      traverse(root.element, [index]);
    }
  }
}
