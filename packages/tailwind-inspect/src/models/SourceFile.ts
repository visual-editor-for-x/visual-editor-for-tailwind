import * as babel from "@babel/types";
import { action, computed, makeObservable, observable, reaction } from "mobx";
import { parse } from "@babel/parser";
import { transform } from "@babel/standalone";
import * as recast from "recast";
import { TypedEmitter } from "tiny-typed-emitter";
import { DebugSource } from "./DebugSource";
import { SourceFileNode } from "./node/SourceFileNode";
import { JSXElementNode } from "./node/JSXElementNode";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { JSXNode } from "./node/JSXNode";
import { JSXTextNode } from "./node/JSXTextNode";
import { JSXFragmentNode } from "./node/JSXFragmentNode";
import { JSXExpressionContainerNode } from "./node/JSXExpressionContainerNode";
import { JSXSpreadChildNode } from "./node/JSXSpreadChildNode";

function parseCode(code: string): babel.File {
  return recast.parse(code, {
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
}

export class SourceFile extends TypedEmitter<{
  fetchCode(): void;
}> {
  constructor(code: string) {
    super();
    const ast = parseCode(code);
    this.node = new SourceFileNode(ast);
    this._code = code;

    makeObservable(this);

    reaction(
      () => this.selectedElements,
      (elements) => {
        console.log(elements);
      }
    );

    this.fetchCode();
  }

  async fetchCode() {
    const request = await fetch("/edit-target");
    const code = await request.text();

    const ast = parseCode(code);
    this.node.loadAST(ast);
    this._code = code;

    this.emit("fetchCode");
  }

  @observable node: SourceFileNode;

  @observable private _code: string;

  get code(): string {
    return this._code;
  }

  async updateCode() {
    this.node.updateAST();

    const { code } = recast.print(this.node.ast);
    this._code = code;

    const newAST = parseCode(code);
    this.node.loadAST(newAST);

    await fetch("/edit-target", {
      method: "PUT",
      body: code,
    });
  }

  @observable hoveredElement: JSXElementNode | undefined = undefined;

  @computed get selectedElements(): readonly JSXElementNode[] {
    return filterInstance(this.node.selectedDescendants, [JSXElementNode]);
  }
  @computed get selectedNodes(): readonly JSXNode[] {
    return filterInstance(this.node.selectedDescendants, [
      JSXElementNode,
      JSXTextNode,
      JSXFragmentNode,
      JSXExpressionContainerNode,
      JSXSpreadChildNode,
    ]);
  }

  selectFromDebugSource(debugSource: DebugSource): void {
    this.node.deselect();

    this.node.forEachDescendant((node) => {
      if (node instanceof JSXElementNode) {
        if (
          node.ast.loc?.start.line === debugSource.lineNumber &&
          node.ast.loc?.start.column === debugSource.columnNumber - 1
        ) {
          node.select();
        }
      }
    });
  }
}
