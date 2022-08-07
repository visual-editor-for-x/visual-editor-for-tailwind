import { ElementInstance } from "../models/ElementInstance";
import { StyleInspectorState } from "./StyleInspectorState";

import { parse } from "@babel/parser";
import demoCode from "./demo?raw";

const parsed = parse(demoCode, {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
});
console.log(demoCode);
console.log(parsed);

export class AppState {
  readonly elementInstance = new ElementInstance();
  readonly styleInspectorState = new StyleInspectorState(() => [
    this.elementInstance,
  ]);
}
