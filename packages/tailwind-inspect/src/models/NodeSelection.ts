import { observable } from "mobx";

export class NodeSelection {
  readonly selectedPathStrings = observable.set<string>();

  isSelected(path: readonly number[]): boolean {
    return this.selectedPathStrings.has(path.join(","));
  }

  select(path: readonly number[]) {
    this.deselect(path);
    this.selectedPathStrings.add(path.join(","));
  }

  deselect(path: readonly number[]) {
    const str = path.join(",");

    const newItems = [...this.selectedPathStrings].filter((pathStr) => {
      if (pathStr === str) {
        return false;
      }
      if (pathStr.startsWith(str + ",")) {
        return false;
      }
      return true;
    });

    this.selectedPathStrings.replace(newItems);
  }
}
