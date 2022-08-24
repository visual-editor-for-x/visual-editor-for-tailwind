import { StyleInspectorState } from "./StyleInspectorState";
import demoCode from "./demo?raw";
import { computed, makeObservable } from "mobx";
import { DOMMapping } from "./DOMMapping";
import { SourceFile } from "../models/SourceFile";

export class AppState {
  constructor() {
    this.sourceFile = new SourceFile(demoCode);
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

  @computed get compiledCode() {
    return this.sourceFile.compiledCode;
  }

  readonly sourceFile: SourceFile;
  readonly domMapping: DOMMapping;
}
