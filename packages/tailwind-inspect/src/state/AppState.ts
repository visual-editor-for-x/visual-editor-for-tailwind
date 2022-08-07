import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";

import { parse, ParseResult } from "@babel/parser";
import generate from "@babel/generator";
import demoCode from "./demo?raw";
import { transform } from "@babel/standalone";
import { makeObservable, observable, reaction } from "mobx";
import { SourceFile } from "../models/SourceFile";
import { JSXAttribute, JSXElement } from "@babel/types";

function classNameForJSXElement(element: JSXElement): string | undefined {
  for (const attribute of element.openingElement.attributes) {
    if (attribute.type !== "JSXAttribute") {
      continue;
    }
    if (attribute.name.name !== "className") {
      continue;
    }

    const value = attribute.value;
    if (value?.type !== "StringLiteral") {
      continue;
    }

    return value.value;
  }
}

export class AppState {
  constructor() {
    const ast = parse(demoCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
    //console.log(demoCode);
    //console.log(ast);

    this.sourceFile = new SourceFile(ast);
    console.log(this.sourceFile.jsxRoots);

    // parsed.program.body.reverse();

    const { code } = generate(ast, {}, demoCode);
    //console.log(code);

    const output = transform(demoCode, { presets: ["env", "react"] }).code;
    //console.log(output);
    this.compiledCode = output;

    makeObservable(this);

    reaction(
      () => this.sourceFile.selectedElements,
      (elements) => {
        console.log(elements);
        const classNames = elements.map(classNameForJSXElement);
        console.log(classNames);

        if (classNames.length) {
          this.elementInstance.style.loadTailwind(classNames[0] ?? "");
        }
      }
    );
  }

  readonly elementInstance = new ElementInstance();
  readonly styleInspectorState = new StyleInspectorState(() => [
    this.elementInstance,
  ]);

  @observable compiledCode = "";

  readonly sourceFile: SourceFile;
}
