import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import * as babel from "@babel/types";
import { clone } from "lodash-es";
import { JSXTextNode } from "./JSXTextNode";
import { JSXOtherNode } from "./JSXOtherNode";
import { Style } from "../Style";
import { JSXElementUtil } from "../JSXElementUtil";

export class JSXElementNode extends TreeNode<
  JSXElementNode,
  JSXElementNode,
  JSXElementNode | JSXTextNode | JSXOtherNode
> {
  constructor(ast: babel.JSXElement) {
    super();
    this.originalAST = ast;
    this.loadAST(ast);
  }

  originalAST: babel.JSXElement;
  readonly style = new Style();

  loadAST(ast: babel.JSXElement) {
    const children = ast.children.map((child) => {
      if (child.type === "JSXText") {
        return new JSXTextNode(child);
      } else if (child.type === "JSXElement") {
        return new JSXElementNode(child);
      } else {
        return new JSXOtherNode(child);
      }
    });

    this.originalAST = ast;
    this.clear();
    this.append(...children);
    this.style.loadTailwind(
      JSXElementUtil.getAttribute(ast, "className") ?? ""
    );
  }

  toAST(): babel.JSXElement {
    const ast = clone(this.originalAST);
    ast.children = this.children.map((child) => child.toAST());
    JSXElementUtil.setAttribute(ast, "className", this.style.toTailwind());
    return ast;
  }
}
