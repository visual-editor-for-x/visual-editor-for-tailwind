import {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from "@babel/types";
import {
  LeafTreeViewItem,
  RootTreeViewItem,
  TreeViewItem,
} from "@seanchas116/paintkit/src/components/treeview/TreeViewItem";
import {
  TreeRow,
  TreeRowIcon,
  TreeRowLabel,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { TreeView } from "@seanchas116/paintkit/src/components/treeview/TreeView";
import chevronsIcon from "@seanchas116/paintkit/src/icon/Chevrons";
import widgetsFilledIcon from "@iconify-icons/ic/baseline-widgets";
import generate from "@babel/generator";
import { ReactNode, useMemo } from "react";
import * as shortUUID from "short-uuid";
import { SourceFile } from "../models/SourceFile";
import { compact } from "lodash-es";
import { NodeSelection } from "../models/NodeSelection";

class SourceFileTreeViewItem extends RootTreeViewItem {
  constructor(file: SourceFile) {
    super();
    this.file = file;
  }

  readonly file: SourceFile;

  get children(): readonly TreeViewItem[] {
    return this.file.jsxRoots.map(
      (root, i) =>
        new JSXRootTreeViewItem(
          this.file,
          this,
          root.name ?? "default",
          i,
          root.element
        )
    );
  }
  deselect(): void {
    this.file.selection.clear();
  }
}

class JSXRootTreeViewItem extends TreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    name: string,
    index: number,
    node: JSXElement
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.name = name;
    this.index = index;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly name: string;
  readonly index: number;
  readonly node: JSXElement;
  private readonly _key = shortUUID.generate();

  get key(): string {
    return this._key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    return [
      new JSXElementTreeViewItem(this.file, this, [this.index], this.node),
    ];
  }
  get selected(): boolean {
    // TODO
    return false;
  }
  get hovered(): boolean {
    // TODO
    return false;
  }
  get collapsed(): boolean {
    // TODO
    return false;
  }
  get showsCollapseButton(): boolean {
    return true;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowIcon icon={widgetsFilledIcon} />
        <TreeRowLabel>{this.name}</TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    // TODO
  }
  select(): void {
    // TODO
  }
  toggleCollapsed(): void {
    // TODO
  }
}

class JSXElementTreeViewItem extends TreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    path: readonly number[],
    node: JSXElement
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.path = path;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly node: JSXElement;
  readonly path: readonly number[];
  private readonly _key = shortUUID.generate();

  get key(): string {
    return this._key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    return compact(
      this.node.children.map((child, i) => {
        switch (child.type) {
          case "JSXElement":
            return new JSXElementTreeViewItem(
              this.file,
              this,
              [...this.path, i],
              child
            );
          case "JSXText":
            // ignore newlines
            if (/^\s*$/.test(child.value) && child.value.includes("\n")) {
              return;
            }
            return new JSXTextTreeViewItem(
              this.file,
              this,
              [...this.path, i],
              child
            );
          default:
            return new JSXOtherTreeViewItem(
              this.file,
              this,
              [...this.path, i],
              child
            );
        }
      })
    );
  }
  get selected(): boolean {
    return this.file.selection.includes(this.path);
  }
  get hovered(): boolean {
    // TODO
    return false;
  }
  get collapsed(): boolean {
    // TODO
    return false;
  }
  get showsCollapseButton(): boolean {
    return true;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowIcon icon={chevronsIcon} />
        <TreeRowLabel>
          {generate(this.node.openingElement.name).code}
        </TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    this.file.selection.delete(this.path);
  }
  select(): void {
    this.file.selection.add(this.path);
  }
  toggleCollapsed(): void {
    // TODO
  }
}

class JSXTextTreeViewItem extends LeafTreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    path: readonly number[],
    node: JSXText
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.path = path;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly path: readonly number[];
  readonly node: JSXText;
  private readonly _key = shortUUID.generate();

  get key(): string {
    return this._key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get selected(): boolean {
    // TODO
    return false;
  }
  get hovered(): boolean {
    // TODO
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel>{this.node.value}</TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    // TODO
  }
  select(): void {
    // TODO
  }
}

class JSXOtherTreeViewItem extends LeafTreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    path: readonly number[],
    node: JSXFragment | JSXExpressionContainer | JSXSpreadChild
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.path = path;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly path: readonly number[];
  readonly node: JSXFragment | JSXExpressionContainer | JSXSpreadChild;
  private readonly _key = shortUUID.generate();

  get key(): string {
    return this._key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get selected(): boolean {
    // TODO
    return false;
  }
  get hovered(): boolean {
    // TODO
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel>{generate(this.node).code}</TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    // TODO
  }
  select(): void {
    // TODO
  }
}

export const JSXTreeView: React.FC<{
  file: SourceFile;
  className?: string;
}> = ({ file, className }) => {
  const rootItem = useMemo(() => new SourceFileTreeViewItem(file), [file]);

  return <TreeView className={className} rootItem={rootItem} />;
};
