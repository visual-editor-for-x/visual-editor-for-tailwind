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
import { compact } from "lodash-es";
import { computed, makeObservable } from "mobx";
import { SourceFile } from "../models/SourceFile";
import { JSXElementNode } from "../models/node/JSXElementNode";
import { ComponentNode } from "../models/node/ComponentNode";
import { JSXTextNode } from "../models/node/JSXTextNode";
import { JSXFragmentNode } from "../models/node/JSXFragmentNode";
import { JSXSpreadChildNode } from "../models/node/JSXSpreadChildNode";
import { JSXExpressionContainerNode } from "../models/node/JSXExpressionContainerNode";
import {
  colors,
  opacities,
} from "@seanchas116/paintkit/src/components/Palette";

const NODE_DRAG_MIME = "application/x.macaron-tree-drag-node";

class SourceFileTreeViewItem extends RootTreeViewItem {
  constructor(file: SourceFile) {
    super();
    this.file = file;
  }

  readonly file: SourceFile;

  get children(): readonly TreeViewItem[] {
    return this.file.node.children.map(
      (component) => new ComponentTreeViewItem(this.file, this, component)
    );
  }
  deselect(): void {
    this.file.node.deselect();
  }
}

class ComponentTreeViewItem extends TreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: ComponentNode
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly node: ComponentNode;

  get key(): string {
    return this.node.key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    return [new JSXElementTreeViewItem(this.file, this, this.node.rootElement)];
  }
  get selected(): boolean {
    return this.node.selected;
  }
  get hovered(): boolean {
    // TODO
    return false;
  }
  get collapsed(): boolean {
    return this.node.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowIcon
          icon={widgetsFilledIcon}
          style={{
            color: options.inverted ? colors.activeText : colors.component,
          }}
        />
        <TreeRowLabel
          style={{
            fontWeight: "bold",
          }}
        >
          {this.node.componentName ?? "default"}
        </TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    this.node.deselect();
  }
  select(): void {
    this.node.select();
  }
  toggleCollapsed(): void {
    this.node.collapsed = !this.node.collapsed;
  }
}

abstract class JSXGroupTreeViewItem extends TreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: JSXElementNode | JSXFragmentNode
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.node = node;
    makeObservable(this);
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly node: JSXElementNode | JSXFragmentNode;

  get key(): string {
    return this.node.key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    return compact(
      this.node.children.map((child) => {
        if (child instanceof JSXElementNode) {
          return new JSXElementTreeViewItem(this.file, this, child);
        }
        if (child instanceof JSXFragmentNode) {
          return new JSXFragmentTreeViewItem(this.file, this, child);
        }
        if (child instanceof JSXTextNode) {
          // ignore newlines
          if (/^\s*$/.test(child.value) && child.value.includes("\n")) {
            return;
          }
          return new JSXTextTreeViewItem(this.file, this, child);
        }
        if (child instanceof JSXExpressionContainerNode) {
          return new JSXExpressionContainerTreeViewItem(this.file, this, child);
        }
        return new JSXSpreadChildTreeViewItem(this.file, this, child);
      })
    );
  }
  @computed get selected(): boolean {
    return this.node.selected;
  }
  @computed get hovered(): boolean {
    return this.file.hoveredElement === this.node;
  }
  get collapsed(): boolean {
    return this.node.collapsed;
  }
  get showsCollapseButton(): boolean {
    return true;
  }
  deselect(): void {
    this.node.deselect();
  }
  select(): void {
    this.node.select();
  }
  toggleCollapsed(): void {
    this.node.collapsed = !this.node.collapsed;
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }

  canDropData(dataTransfer: DataTransfer): boolean {
    return dataTransfer.types.includes(NODE_DRAG_MIME);
  }

  handleDrop(event: React.DragEvent, before: TreeViewItem | undefined): void {
    const copy = event.altKey || event.ctrlKey;

    const beforeNode =
      before &&
      (
        before as
          | JSXElementTreeViewItem
          | JSXFragmentTreeViewItem
          | JSXTextTreeViewItem
          | JSXSpreadChildTreeViewItem
      ).node;

    // TODO: copy
    for (const node of this.file.selectedNodes) {
      this.node.insertBefore(node, beforeNode);
    }

    this.file.updateCode();

    // TODO: commit
    // this.context.editorState.history.commit(
    //   copy ? "Duplicate Layers" : "Move Layers"
    // );
  }
}

class JSXElementTreeViewItem extends JSXGroupTreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: JSXElementNode
  ) {
    super(file, parent, node);
    this.node = node;
  }

  node: JSXElementNode;

  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowIcon
          icon={chevronsIcon}
          style={{
            opacity: opacities.disabledText,
          }}
        />
        <TreeRowLabel>{this.node.tagName}</TreeRowLabel>
      </TreeRow>
    );
  }
}

class JSXFragmentTreeViewItem extends JSXGroupTreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: JSXFragmentNode
  ) {
    super(file, parent, node);
    this.node = node;
  }

  node: JSXFragmentNode;

  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowIcon icon={chevronsIcon} />
      </TreeRow>
    );
  }
}

class JSXTextTreeViewItem extends LeafTreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: JSXTextNode
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly node: JSXTextNode;

  get key(): string {
    return this.node.key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get selected(): boolean {
    return this.node.selected;
  }
  get hovered(): boolean {
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel
          style={{
            opacity: opacities.label,
          }}
        >
          {this.node.value}
        </TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    this.node.deselect();
  }
  select(): void {
    this.node.select();
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }
}

class JSXExpressionContainerTreeViewItem extends TreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: JSXExpressionContainerNode
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly node: JSXExpressionContainerNode;

  get key(): string {
    return this.node.key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get children(): readonly TreeViewItem[] {
    const child = this.node.firstChild;

    if (child) {
      if (child instanceof JSXElementNode) {
        return [new JSXElementTreeViewItem(this.file, this, child)];
      }
      if (child instanceof JSXFragmentNode) {
        return [new JSXFragmentTreeViewItem(this.file, this, child)];
      }
    }
    return [];
  }
  get collapsed(): boolean {
    return this.node.collapsed;
  }
  get showsCollapseButton(): boolean {
    return !!this.node.firstChild;
  }
  toggleCollapsed(): void {
    this.node.collapsed = !this.node.collapsed;
  }
  get selected(): boolean {
    return this.node.selected;
  }
  get hovered(): boolean {
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel style={{ opacity: opacities.disabledText }}>
          {generate(this.node.ast).code}
        </TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    this.node.deselect();
  }
  select(): void {
    this.node.select();
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }
}

class JSXSpreadChildTreeViewItem extends LeafTreeViewItem {
  constructor(
    file: SourceFile,
    parent: TreeViewItem | undefined,
    node: JSXSpreadChildNode
  ) {
    super();
    this.file = file;
    this._parent = parent;
    this.node = node;
  }

  readonly file: SourceFile;
  private readonly _parent: TreeViewItem | undefined;
  readonly node: JSXSpreadChildNode;

  get key(): string {
    return this.node.key;
  }
  get parent(): TreeViewItem | undefined {
    return this._parent;
  }
  get selected(): boolean {
    return this.node.selected;
  }
  get hovered(): boolean {
    return false;
  }
  renderRow(options: { inverted: boolean }): ReactNode {
    return (
      <TreeRow inverted={options.inverted}>
        <TreeRowLabel>{generate(this.node.ast).code}</TreeRowLabel>
      </TreeRow>
    );
  }
  deselect(): void {
    this.node.deselect();
  }
  select(): void {
    this.node.select();
  }

  handleDragStart(e: React.DragEvent): void {
    e.dataTransfer.effectAllowed = "copyMove";
    e.dataTransfer.setData(NODE_DRAG_MIME, "drag");
  }
}

export const JSXTreeView: React.FC<{
  file: SourceFile;
  className?: string;
}> = ({ file, className }) => {
  const rootItem = useMemo(() => new SourceFileTreeViewItem(file), [file]);

  return <TreeView className={className} rootItem={rootItem} />;
};
