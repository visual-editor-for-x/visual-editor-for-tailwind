import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";

import { parse, ParseResult } from "@babel/parser";
import generate from "@babel/generator";
import demoCode from "./demo?raw";
import { transform } from "@babel/standalone";
import { makeObservable, observable } from "mobx";
import { SourceFile } from "../models/SourceFile";

export class AppState {
  constructor() {
    makeObservable(this);

    const ast = parse(demoCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    //console.log(demoCode);
    //console.log(ast);

    const file = new SourceFile(ast);
    console.log(file.getJSXRoots());

    // parsed.program.body.reverse();

    const { code } = generate(ast, {}, demoCode);
    //console.log(code);

    const output = transform(demoCode, { presets: ["env", "react"] }).code;
    //console.log(output);
    this.compiledCode = output;
  }

  readonly elementInstance = new ElementInstance();
  readonly styleInspectorState = new StyleInspectorState(() => [
    this.elementInstance,
  ]);

  @observable compiledCode = "";
}
