import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { makeObservable, observable } from "mobx";

export abstract class NodeBase<
  Parent extends NodeBase<any, any, any>,
  Self extends NodeBase<Parent, Self, Child>,
  Child extends NodeBase<any, any, any>
> extends TreeNode<Parent, Self, Child> {
  constructor() {
    super();
    makeObservable(this);
  }

  @observable selected = false;

  select(): void {
    this.selected = true;
    for (const child of this.children) {
      child.deselect();
    }
  }

  deselect(): void {
    this.selected = false;
    for (const child of this.children) {
      child.deselect();
    }
  }
}
