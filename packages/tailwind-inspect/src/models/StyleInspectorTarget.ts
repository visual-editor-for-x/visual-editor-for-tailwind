import { Style } from "./style/Style";

export interface StyleInspectorTarget {
  readonly tagName: string;
  readonly computedStyle: Style;
  readonly style: Style;
}
