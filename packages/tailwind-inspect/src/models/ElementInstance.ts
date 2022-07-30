import { Style } from "./Style";

export class ElementInstance {
  readonly tagName: string = "div";
  readonly computedStyle = new Style();
  readonly style = new Style();
}
