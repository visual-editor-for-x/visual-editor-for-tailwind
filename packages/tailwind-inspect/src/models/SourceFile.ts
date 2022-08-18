import { File as FileAST, JSXElement } from "@babel/types";
import { action, computed, makeObservable, observable, reaction } from "mobx";
import { parse } from "@babel/parser";
import { transform } from "@babel/standalone";
import * as recast from "recast";
import { NodeSelection } from "./NodeSelection";
import { Style } from "./Style";
import { StyleInspectorTarget } from "./StyleInspectorTarget";
import { DebugSource } from "./DebugSource";
import { JSXElementUtil } from "./JSXElementUtil";
import { SourceFileNode } from "./node/SourceFileNode";
import { JSXElementNode } from "./node/JSXElementNode";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";

interface JSXRoot {
  name?: string;
  element: JSXElement;
}

export class SourceFile {
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
    this.node = new SourceFileNode(ast);
    this._code = code;
    this.compileCode();

    makeObservable(this);

    reaction(
      () => this.selectedElements,
      (elements) => {
        console.log(elements);
      }
    );

    reaction(
      () => this.node.toAST(),
      action((ast) => {
        const { code } = recast.print(ast);
        this._code = code;
        this.compileCode();
      })
    );
  }

  readonly ast: FileAST;
  readonly node: SourceFileNode;

  @observable private _code: string;
  @observable private _compiledCode = "";

  get code(): string {
    return this._code;
  }

  get compiledCode(): string {
    return this._compiledCode;
  }

  private compileCode() {
    const output = transform(this._code, {
      presets: ["env", "react"],
      plugins: ["transform-react-jsx-source"],
    }).code;
    //console.log(output);
    this._compiledCode = output ?? "";
  }

  @observable hoveredElement: JSXElementNode | undefined = undefined;

  @computed get selectedElements(): readonly JSXElementNode[] {
    return filterInstance(this.node.selectedDescendants, [JSXElementNode]);
  }

  selectFromDebugSource(debugSource: DebugSource): void {
    this.node.deselect();

    this.node.forEachDescendant((node) => {
      if (node instanceof JSXElementNode) {
        if (
          node.originalAST.loc?.start.line === debugSource.lineNumber &&
          node.originalAST.loc?.start.column === debugSource.columnNumber - 1
        ) {
          node.select();
        }
      }
    });
  }
}
