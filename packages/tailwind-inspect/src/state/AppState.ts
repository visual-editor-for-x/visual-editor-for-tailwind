import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";
import demoCode from "./demo?raw";
import { computed, makeObservable } from "mobx";
import { SourceFile } from "../models/SourceFile";
import { DOMMapping } from "./DOMMapping";

export class AppState {
  constructor() {
    this.sourceFile = new SourceFile(demoCode);
    this.domMapping = new DOMMapping(this.sourceFile);
    makeObservable(this);
  }

  readonly styleInspectorState = new StyleInspectorState(
    () => this.sourceFile.inspectorTargets
  );

  @computed get compiledCode() {
    return this.sourceFile.compiledCode;
  }

  readonly sourceFile: SourceFile;
  readonly domMapping: DOMMapping;
}
