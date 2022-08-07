import { observable } from "mobx";

export class NodeSelection {
  readonly selectedPathStrings = observable.set<string>();

  includes(path: readonly number[]): boolean {
    return this.selectedPathStrings.has(path.join(","));
  }

  add(path: readonly number[]) {
    this.delete(path);
    this.selectedPathStrings.add(path.join(","));
  }

  delete(path: readonly number[]) {
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

  clear() {
    this.selectedPathStrings.clear();
  }
}
