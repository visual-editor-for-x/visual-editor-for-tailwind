import { Style } from "./Style";

export class ElementInstance {
  readonly element = {
    tagName: "div",
  };

  readonly computedStyle = new Style();
  readonly style = new Style();
}
