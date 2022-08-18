// @ts-ignore
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
import { SourceFile } from "../models/SourceFile";

// @ts-ignore
const getInstanceFromNode =
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Events[0];

export class DOMMapping {
  constructor(sourceFile: SourceFile) {
    this.sourceFile = sourceFile;
  }

  readonly sourceFile: SourceFile;

  private readonly _domForPath = new Map<string, Element>();
  private readonly _pathForDOM = new Map<Element, readonly number[]>();

  domForPath(path: readonly number[]): Element | undefined {
    return this._domForPath.get(JSON.stringify(path));
  }

  pathForDOM(dom: Element): readonly number[] | undefined {
    return this._pathForDOM.get(dom);
  }

  update(root: Element): void {
    this._domForPath.clear();
    this._pathForDOM.clear();

    const locationToPath = new Map<string, readonly number[]>();

    this.sourceFile.traverseWithPath((node, path) => {
      const loc = node.loc;
      if (loc) {
        locationToPath.set(
          JSON.stringify([loc.start.line, loc.start.column]),
          path
        );
      }
    });

    const traverse = (dom: Element) => {
      const fiberNode = getInstanceFromNode(dom);

      if (fiberNode?._debugSource) {
        const line = fiberNode._debugSource.lineNumber;
        const column = fiberNode._debugSource.columnNumber - 1;

        const path = locationToPath.get(JSON.stringify([line, column]));
        if (path) {
          this._domForPath.set(JSON.stringify(path), dom);
          this._pathForDOM.set(dom, path);
        }
      }

      for (const child of dom.children) {
        traverse(child);
      }
    };
    traverse(root);
  }
}
