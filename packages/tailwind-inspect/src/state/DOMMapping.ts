import { Rect, Vec2 } from "paintvec";
// @ts-ignore
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
import { JSXElementNode } from "../models/node/JSXElementNode";
import { SourceFile } from "../models/SourceFile";

// @ts-ignore
const getInstanceFromNode =
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Events[0];

export class DOMMapping {
  constructor(sourceFile: SourceFile) {
    this.sourceFile = sourceFile;
  }

  readonly sourceFile: SourceFile;

  readonly domForNode = new Map<JSXElementNode, Element>();
  readonly nodeForDOM = new Map<Element, JSXElementNode>();

  update(root: Element, getInstance = getInstanceFromNode): void {
    const viewportTopLeft = Rect.from(root.getBoundingClientRect()).topLeft;

    this.domForNode.clear();
    this.nodeForDOM.clear();

    const locationToNode = new Map<string, JSXElementNode>();

    this.sourceFile.node.forEachDescendant((node) => {
      if (node instanceof JSXElementNode) {
        const loc = node.ast.loc;
        if (loc) {
          locationToNode.set(
            JSON.stringify([loc.start.line, loc.start.column]),
            node
          );
        }
      }
    });

    const traverse = (dom: Element) => {
      const fiberNode = getInstance(dom);

      if (fiberNode?._debugSource) {
        const line = fiberNode._debugSource.lineNumber;
        const column = fiberNode._debugSource.columnNumber - 1;

        const node = locationToNode.get(JSON.stringify([line, column]));
        if (node) {
          this.domForNode.set(node, dom);
          this.nodeForDOM.set(dom, node);
          node.computedStyle.loadComputedStyle(dom);
          node.boundingBox = Rect.from(dom.getBoundingClientRect()).translate(
            viewportTopLeft.neg
          );
        }
      }

      for (const child of dom.children) {
        traverse(child);
      }
    };
    traverse(root);
  }
}
