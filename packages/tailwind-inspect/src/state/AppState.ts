import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";

import { parse } from "@babel/parser";
import demoCode from "./demo?raw";
import { transform } from "@babel/standalone";
import { makeObservable, observable } from "mobx";

export class AppState {
  constructor() {
    makeObservable(this);

    const parsed = parse(demoCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    console.log(demoCode);
    console.log(parsed);

    const output = transform(demoCode, { presets: ["env", "react"] }).code;
    console.log(output);
    this.compiledCode = output;
  }

  readonly elementInstance = new ElementInstance();
  readonly styleInspectorState = new StyleInspectorState(() => [
    this.elementInstance,
  ]);

  @observable compiledCode = "";
}
