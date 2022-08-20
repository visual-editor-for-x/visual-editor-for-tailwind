import * as babel from "@babel/types";
import { JSXTextNode } from "./JSXTextNode";
import { JSXOtherNode } from "./JSXOtherNode";
import { Style } from "../style/Style";
import { JSXElementUtil } from "../../util/JSXElementUtil";
import { NodeBase } from "./NodeBase";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import { JSXFragmentNode } from "./JSXFragmentNode";
import { createNodesFromASTs, JSXNode } from "./JSXNode";

export class JSXElementNode extends NodeBase<
  JSXElementNode | JSXFragmentNode,
  JSXElementNode,
  JSXNode
> {
  constructor(ast: babel.JSXElement) {
    super();
    this.ast = ast;
    this.loadAST(ast);
    makeObservable(this);
  }

  ast: babel.JSXElement;
  readonly style = new Style();
  readonly computedStyle = new Style();
  @observable.ref boundingBox: Rect = Rect.from({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  loadAST(ast: babel.JSXElement) {
    const children = createNodesFromASTs(ast.children, this.children);
    this.ast = ast;
    this.clear();
    this.append(...children);
    this.style.loadTailwind(
      JSXElementUtil.getAttribute(ast.openingElement, "className") ?? ""
    );
  }

  updateAST(): void {
    const children = this.children;
    children.forEach((c) => c.updateAST());

    this.ast.children = children.map((c) => c.ast);
    // this.style.toTailwind();
    JSXElementUtil.setAttribute(
      this.ast.openingElement,
      "className",
      this.style.toTailwind()
    );
  }

  get tagName(): string {
    if (this.ast.openingElement.name.type === "JSXIdentifier") {
      return this.ast.openingElement.name.name;
    } else {
      return "div";
    }
  }
}
