import { makeObservable, observable } from "mobx";

export class NodeSelection {
  constructor() {
    makeObservable(this);
  }

  readonly selectedPathStrings = observable.set<string>();

  @observable hoveredPath: readonly number[] | undefined = undefined;

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

  get allPaths(): number[][] {
    return [...this.selectedPathStrings].map((pathStr) => {
      return pathStr.split(",").map((str) => parseInt(str, 10));
    });
  }
}
