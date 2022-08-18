import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";
import demoCode from "./demo?raw";
import { computed, makeObservable } from "mobx";
import { SourceFileOld } from "../models/SourceFileOld";
import { DOMMapping } from "./DOMMapping";

export class AppState {
  constructor() {
    this.sourceFile = new SourceFileOld(demoCode);
    this.domMapping = new DOMMapping(this.sourceFile);
    makeObservable(this);
  }

  readonly styleInspectorState = new StyleInspectorState(
    () => this.sourceFile.inspectorTargets
  );

  @computed get compiledCode() {
    return this.sourceFile.compiledCode;
  }

  readonly sourceFile: SourceFileOld;
  readonly domMapping: DOMMapping;
}
