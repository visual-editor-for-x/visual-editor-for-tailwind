import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { computed, makeObservable, observable } from "mobx";

export const textStyleKeys = [
  "color",
  "fontFamily",
  "fontWeight",
  "fontStyle",
  "fontSize",
  "lineHeight",
  "letterSpacing",
  "textDecorationLine",
  "textAlign",
] as const;

export const imageStyleKeys = ["objectFit"] as const;

export const styleShorthands = {
  margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
  padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  borderWidth: [
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
  ],
  borderColor: [
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
  ],
  borderStyle: [
    "borderTopStyle",
    "borderRightStyle",
    "borderBottomStyle",
    "borderLeftStyle",
  ],
  borderRadius: [
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomRightRadius",
    "borderBottomLeftRadius",
  ],
} as const;

export const styleKeys = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",

  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",

  "alignSelf",
  "flexGrow",
  "flexShrink",
  "flexBasis",

  "display",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "flexDirection",
  "flexWrap",
  "alignItems",
  "justifyContent",
  "rowGap",
  "columnGap",

  ...textStyleKeys,
  ...imageStyleKeys,

  "background",

  "borderTopWidth",
  "borderTopStyle",
  "borderTopColor",
  "borderRightWidth",
  "borderRightStyle",
  "borderRightColor",
  "borderBottomWidth",
  "borderBottomStyle",
  "borderBottomColor",
  "borderLeftWidth",
  "borderLeftStyle",
  "borderLeftColor",

  "opacity",
  "cursor",
] as const;

export const positionalStyleKeys = [
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "alignSelf",
  "flexGrow",
  "flexShrink",
  "flexBasis",
] as const;

const shorthandStyleKeys = Object.keys(
  styleShorthands
) as readonly (keyof typeof styleShorthands)[];

export const allStyleKeys = [...styleKeys, ...shorthandStyleKeys] as const;

export type StyleKey = typeof styleKeys[number];
export type ShorthandStyleKey = typeof shorthandStyleKeys[number];
export type AllStyleKey = typeof allStyleKeys[number];

export type StyleProps = {
  [key in StyleKey]?: string;
};
export type ShorthandStyleProps = {
  [key in ShorthandStyleKey]?: string | typeof MIXED;
};
export type AllStyleProps = StyleProps & ShorthandStyleProps;

const StyleBase: {
  new (): AllStyleProps;
} = class {
  constructor() {
    for (const key of styleKeys) {
      // @ts-ignore
      this[key] = undefined;
    }

    for (const [shorthandKey, keys] of Object.entries(styleShorthands)) {
      Object.defineProperty(this, shorthandKey, {
        configurable: true,
        get() {
          // eslint-disable-next-line
          return sameOrMixed(keys.map((key) => this[key]));
        },
        set(value: string | typeof MIXED | undefined) {
          if (value === MIXED) {
            return;
          }
          for (const key of keys) {
            // eslint-disable-next-line
            this[key] = value;
          }
        },
      });
    }

    makeObservable(
      this,
      // @ts-ignore
      {
        ...Object.fromEntries(styleKeys.map((key) => [key, observable])),
        ...Object.fromEntries(shorthandStyleKeys.map((key) => [key, computed])),
      }
    );
  }
};

const tailwindPrefixes = [
  ["marginTop", "mt"],
  ["marginRight", "mr"],
  ["marginBottom", "mb"],
  ["marginLeft", "ml"],
  ["top", "top"],
  ["right", "right"],
  ["bottom", "bottom"],
  ["left", "left"],
  ["width", "w"],
  ["height", "h"],
  ["borderTopLeftRadius", "rounded-tl"],
  ["borderTopRightRadius", "rounded-tr"],
  ["borderBottomRightRadius", "rounded-br"],
  ["borderBottomLeftRadius", "rounded-bl"],
  ["paddingTop", "pt"],
  ["paddingRight", "pr"],
  ["paddingBottom", "pb"],
  ["paddingLeft", "pl"],
  ["background", "bg"],
  ["fontWeight", "font"],
  ["fontSize", "text"],
  ["lineHeight", "leading"],
  ["letterSpacing", "tracking"],
  ["color", "text"],
  ["borderTopWidth", "border-t"],
  ["borderRightWidth", "border-r"],
  ["borderBottomWidth", "border-b"],
  ["borderLeftWidth", "border-l"],
  ["borderTopColor", "border-t"],
  ["borderRightColor", "border-r"],
  ["borderBottomColor", "border-b"],
  ["borderLeftColor", "border-l"],
  ["opacity", "opacity"],
  ["cursor", "cursor"],
] as const;

export class Style extends StyleBase {
  loadTailwind(className: string) {
    const classNames = className.split(/\s+/);

    for (const className of classNames) {
      // TODO: font family

      for (const [key, prefix] of tailwindPrefixes) {
        const match = className.match(new RegExp(`${prefix}-\\[([^\\]]+)\\]`));
        if (match) {
          this[key] = match[1];
        }
      }
    }
  }

  toTailwind(): string {
    const classNames: string[] = [];

    for (const [key, prefix] of tailwindPrefixes) {
      const value = this[key];
      if (value) {
        classNames.push(`${prefix}-[${value}]`);
      }
    }

    if (this.position) {
      classNames.push(this.position);
    }

    if (this.fontFamily) {
      classNames.push(`font-['${this.fontFamily.replace(" ", "_")}']`);
    }

    if (this.textAlign) {
      classNames.push(`text-${this.textAlign}`);
    }
    if (this.fontStyle) {
      if (this.fontStyle === "italic") {
        classNames.push("italic");
      } else {
        classNames.push("not-italic");
      }
    }
    switch (this.textDecorationLine) {
      case "underline":
        classNames.push("underline");
        break;
      case "line-through":
        classNames.push("line-through");
        break;
      case "none":
        classNames.push("no-underline");
        break;
    }
    switch (this.borderStyle) {
      case "dashed":
        classNames.push("border-dashed");
        break;
      case "dotted":
        classNames.push("border-dotted");
        break;
      case "double":
        classNames.push("border-double");
        break;
      case "solid":
        classNames.push("border-solid");
        break;
      case "none":
        classNames.push("border-none");
        break;
    }

    return classNames.join(" ");
  }
}
