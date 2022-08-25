import { StyleInspectorState } from "./StyleInspectorState";
//import demoCode from "./demo?raw";
import { computed, makeObservable, observable } from "mobx";
import { DOMMapping } from "./DOMMapping";
import { SourceFile } from "../models/SourceFile";
import originalTarget from "../target.original?raw";

export class AppState {
  constructor() {
    this.sourceFile = new SourceFile(originalTarget);
    this.domMapping = new DOMMapping(this.sourceFile);
    makeObservable(this);
  }

  readonly styleInspectorState = new StyleInspectorState({
    getTargets: () => this.sourceFile.selectedElements,
    notifyChange: () => {
      this.sourceFile.updateCode();
    },
    notifyChangeEnd: (message) => {
      //TODO
    },
  });

  readonly sourceFile: SourceFile;
  readonly domMapping: DOMMapping;

  @observable showsCode = true;
}
