import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";

import { parse, ParseResult } from "@babel/parser";
import { File } from "@babel/types";
import generate from "@babel/generator";
import demoCode from "./demo?raw";
import { transform } from "@babel/standalone";
import { makeObservable, observable } from "mobx";

export class AppState {
  constructor() {
    makeObservable(this);

    this.ast = parse(demoCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    console.log(demoCode);
    console.log(this.ast);

    // parsed.program.body.reverse();

    const { code } = generate(this.ast, {}, demoCode);
    console.log(code);

    const output = transform(demoCode, { presets: ["env", "react"] }).code;
    console.log(output);
    this.compiledCode = output;
  }

  readonly elementInstance = new ElementInstance();
  readonly styleInspectorState = new StyleInspectorState(() => [
    this.elementInstance,
  ]);

  @observable ast: File;

  @observable compiledCode = "";
}
