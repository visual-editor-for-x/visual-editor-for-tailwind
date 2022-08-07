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
  TreeRowLabel,
} from "@seanchas116/paintkit/src/components/treeview/TreeRow";
import { TreeView } from "@seanchas116/paintkit/src/components/treeview/TreeView";
import generate from "@babel/generator";
import { ReactNode, useMemo } from "react";
import * as shortUUID from "short-uuid";
import { SourceFile } from "../models/SourceFile";

class SourceFileTreeViewItem extends RootTreeViewItem {
  constructor(file: SourceFile) {
    super();
    this.file = file;
  }

  readonly file: SourceFile;

  get children(): readonly TreeViewItem[] {
    return this.file
      .getJSXRoots()
      .map(
        (root) =>
          new JSXRootTreeViewItem(this, root.name ?? "default", root.element)
      );
  }
  deselect(): void {
    // TODO
  }
}

class JSXRootTreeViewItem extends TreeViewItem {
  constructor(
    parent: TreeViewItem | undefined,
    name: string,
    node: JSXElement
  ) {
    super();
    this._parent = parent;
    this.name = name;
    this.node = node;
  }

  private readonly _parent: TreeViewItem | undefined;
  readonly name: string;
  readonly node: JSXElement;
  private readonly _key = shortUUID.generate();

  get key(): string {
    return this._key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    return [new JSXElementTreeViewItem(this, this.node)];
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
    // TODO
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
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
  constructor(parent: TreeViewItem | undefined, node: JSXElement) {
    super();
    this._parent = parent;
    this.node = node;
  }

  private readonly _parent: TreeViewItem | undefined;
  readonly node: JSXElement;
  private readonly _key = shortUUID.generate();

  get key(): string {
    return this._key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    return this.node.children.map((child) => {
      switch (child.type) {
        case "JSXElement":
          return new JSXElementTreeViewItem(this, child);
        case "JSXText":
          return new JSXTextTreeViewItem(this, child);
        default:
          return new JSXOtherTreeViewItem(this, child);
      }
    });
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
    // TODO
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel>
          {generate(this.node.openingElement.name).code}
        </TreeRowLabel>
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

class JSXTextTreeViewItem extends LeafTreeViewItem {
  constructor(parent: TreeViewItem | undefined, node: JSXText) {
    super();
    this._parent = parent;
    this.node = node;
  }

  private readonly _parent: TreeViewItem | undefined;
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
    parent: TreeViewItem | undefined,
    node: JSXFragment | JSXExpressionContainer | JSXSpreadChild
  ) {
    super();
    this._parent = parent;
    this.node = node;
  }

  private readonly _parent: TreeViewItem | undefined;
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
