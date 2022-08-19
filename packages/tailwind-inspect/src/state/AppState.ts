import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";
import demoCode from "./demo?raw";
import { computed, makeObservable } from "mobx";
import { SourceFileOld } from "../models/SourceFileOld";
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
    commit: (message) => {
      //TODO
    },
  });

  @computed get compiledCode() {
    return this.sourceFile.compiledCode;
  }

  readonly sourceFile: SourceFile;
  readonly domMapping: DOMMapping;
}
