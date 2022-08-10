import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";

import { parse } from "@babel/parser";
import generate from "@babel/generator";
import demoCode from "./demo?raw";
import { transform } from "@babel/standalone";
import { computed, makeObservable, observable } from "mobx";
import { SourceFile } from "../models/SourceFile";

export class AppState {
  constructor() {
    this.sourceFile = new SourceFile(demoCode);
    makeObservable(this);
  }

  readonly elementInstance = new ElementInstance();
  readonly styleInspectorState = new StyleInspectorState(
    () => this.sourceFile.inspectorTargets
  );

  @computed get compiledCode() {
    return this.sourceFile.compiledCode;
  }

  readonly sourceFile: SourceFile;
}
