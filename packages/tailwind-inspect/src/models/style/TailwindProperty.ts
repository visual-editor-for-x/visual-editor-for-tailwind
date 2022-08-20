import { AllStyleKey } from "./Style";

import resolveConfig from "tailwindcss/resolveConfig";
import defaultConfig from "tailwindcss/defaultConfig";
const theme = resolveConfig(defaultConfig).theme!;

console.log(theme);

export interface ITailwindProperty {
  cssName: AllStyleKey;
  toTailwind(cssValue: string): string | undefined;
  fromTailwind(tailwindValue: string): string | undefined;
}

function flattenTheme(theme: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};

  function flatten(obj: Record<string, any>, prefix: string = "") {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object") {
        flatten(value, `${prefix}${key}-`);
      } else {
        result[`${prefix}${key}`] = value;
      }
    }
  }

  flatten(theme);
  return result;
}

export class JITTailwindProperty implements ITailwindProperty {
  constructor(
    cssName: AllStyleKey,
    tailwindName: string,
    themeName: keyof typeof theme,
    valueRegExp?: RegExp
  ) {
    this.tailwindName = tailwindName;
    this.cssName = cssName;

    if (themeName === "fontSize") {
      this.theme = new Map(
        Object.entries(theme[themeName] || {}).map(([key, value]) => [
          key,
          value[0],
        ])
      );
    } else {
      this.theme = new Map(
        Object.entries(flattenTheme(theme[themeName] || {}))
      );
    }

    this.theme = new Map(
      [...this.theme].map(([key, value]) => {
        // rem to px

        if (/^[0-9.]+rem$/.test(value)) {
          const px = parseFloat(value) * 16;
          return [key, `${px}px`];
        }

        return [key, value];
      })
    );

    this.valueRegExp = valueRegExp;
  }

  readonly tailwindName: string;
  readonly cssName: AllStyleKey;
  readonly theme: Map<string, string>;
  readonly valueRegExp: RegExp | undefined;

  toTailwind(cssValue: string): string {
    return `${this.tailwindName}-[${cssValue}]`;
  }

  fromTailwind(tailwindValue: string): string | undefined {
    for (const [keyword, cssValue] of this.theme) {
      if (`${this.tailwindName}-${keyword}` === tailwindValue) {
        return cssValue;
      }
    }

    const match = tailwindValue.match(
      new RegExp(`${this.tailwindName}-\\[([^\\]]+)\\]`)
    );
    if (match) {
      const value = match[1];
      if (this.valueRegExp && !this.valueRegExp.test(value)) {
        return undefined;
      }
      return value;
    }
  }
}

export class FontFamilyTailwindProperty implements ITailwindProperty {
  readonly cssName = "fontFamily";

  toTailwind(cssValue: string): string {
    return `font-['${cssValue.replace(" ", "_")}']`;
  }

  fromTailwind(tailwindValue: string): string | undefined {
    const match = tailwindValue.match(new RegExp(`font-\\['([^\\]]+)\\']`));
    if (match) {
      return match[1].replace("_", " ");
    }
  }
}

export class KeywordTailwindProperty implements ITailwindProperty {
  constructor(cssName: AllStyleKey, tailwindToCSS: Record<string, string>) {
    this.cssName = cssName;
    this.keywordTailwindToCSS = new Map(Object.entries(tailwindToCSS));
    this.keywordCSSToTailwind = new Map(
      Array.from(this.keywordTailwindToCSS.entries()).map(([key, value]) => [
        value,
        key,
      ])
    );
  }
  readonly cssName: AllStyleKey;
  readonly keywords: [string, string][] = [];

  readonly keywordTailwindToCSS: Map<string, string>;
  readonly keywordCSSToTailwind: Map<string, string>;

  toTailwind(cssValue: string): string | undefined {
    return this.keywordCSSToTailwind.get(cssValue);
  }

  fromTailwind(tailwindValue: string): string | undefined {
    return this.keywordTailwindToCSS.get(tailwindValue);
  }
}

export const tailwindProperties: ITailwindProperty[] = [
  // position

  new KeywordTailwindProperty("position", {
    static: "static",
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
  }),
  new JITTailwindProperty("top", "top", "inset"),
  new JITTailwindProperty("right", "right", "inset"),
  new JITTailwindProperty("bottom", "bottom", "inset"),
  new JITTailwindProperty("left", "left", "inset"),
  new JITTailwindProperty("marginTop", "mt", "margin"),
  new JITTailwindProperty("marginRight", "mr", "margin"),
  new JITTailwindProperty("marginBottom", "mb", "margin"),
  new JITTailwindProperty("marginLeft", "ml", "margin"),

  // size

  new JITTailwindProperty("width", "w", "width"),
  new JITTailwindProperty("height", "h", "height"),
  new JITTailwindProperty("borderTopLeftRadius", "rounded-tl", "borderRadius"),
  new JITTailwindProperty("borderTopRightRadius", "rounded-tr", "borderRadius"),
  new JITTailwindProperty(
    "borderBottomRightRadius",
    "rounded-br",
    "borderRadius"
  ),
  new JITTailwindProperty(
    "borderBottomLeftRadius",
    "rounded-bl",
    "borderRadius"
  ),

  // layout

  new KeywordTailwindProperty("display", {
    inline: "inline",
    block: "block",
    "inline-block": "inline-block",
    flex: "flex",
    "inline-flex": "inline-flex",
    hidden: "none",
  }),
  new JITTailwindProperty("paddingTop", "pt", "padding"),
  new JITTailwindProperty("paddingRight", "pr", "padding"),
  new JITTailwindProperty("paddingBottom", "pb", "padding"),
  new JITTailwindProperty("paddingLeft", "pl", "padding"),
  new KeywordTailwindProperty("flexDirection", {
    "flex-row": "row",
    "flex-row-reverse": "row-reverse",
    "flex-col": "column",
    "flex-col-reverse": "column-reverse",
  }),
  new KeywordTailwindProperty("flexWrap", {
    "flex-wrap": "wrap",
    "flex-wrap-reverse": "wrap-reverse",
    "flex-nowrap": "nowrap",
  }),
  new KeywordTailwindProperty("alignItems", {
    "items-start": "flex-start",
    "items-end": "flex-end",
    "items-center": "center",
    "items-baseline": "baseline",
    "items-stretch": "stretch",
  }),
  new KeywordTailwindProperty("justifyContent", {
    "justify-start": "flex-start",
    "justify-end": "flex-end",
    "justify-center": "center",
    "justify-between": "space-between",
    "justify-around": "space-around",
    "justify-evenly": "space-evenly",
  }),
  new JITTailwindProperty("columnGap", "gap-x", "gap"),
  new JITTailwindProperty("rowGap", "gap-y", "gap"),

  // text

  new JITTailwindProperty("color", "text", "textColor", /^#/),
  new FontFamilyTailwindProperty(),
  new JITTailwindProperty("fontWeight", "font", "fontWeight", /^[^']/),
  new JITTailwindProperty("fontSize", "text", "fontSize"),
  new JITTailwindProperty("lineHeight", "leading", "lineHeight"),
  new JITTailwindProperty("letterSpacing", "tracking", "letterSpacing"),
  new KeywordTailwindProperty("textAlign", {
    "text-left": "left",
    "text-center": "center",
    "text-right": "right",
    "text-justify": "justify",
  }),
  new KeywordTailwindProperty("fontStyle", {
    "not-italic": "normal",
    italic: "italic",
  }),
  new KeywordTailwindProperty("textDecorationLine", {
    "no-underline": "none",
    underline: "underline",
    "line-through": "line-through",
  }),

  // background

  new JITTailwindProperty("background", "bg", "backgroundColor"),

  // border

  new KeywordTailwindProperty("borderStyle", {
    "border-none": "none",
    "border-solid": "solid",
    "border-double": "double",
    "border-dotted": "dotted",
    "border-dashed": "dashed",
  }),
  new JITTailwindProperty("borderTopWidth", "border-t", "borderWidth"),
  new JITTailwindProperty("borderRightWidth", "border-r", "borderWidth"),
  new JITTailwindProperty("borderBottomWidth", "border-b", "borderWidth"),
  new JITTailwindProperty("borderLeftWidth", "border-l", "borderWidth"),
  new JITTailwindProperty("borderTopColor", "border-t", "borderColor"),
  new JITTailwindProperty("borderRightColor", "border-r", "borderColor"),
  new JITTailwindProperty("borderBottomColor", "border-b", "borderColor"),
  new JITTailwindProperty("borderLeftColor", "border-l", "borderColor"),

  // effects

  new JITTailwindProperty("opacity", "opacity", "opacity"),
  new JITTailwindProperty("cursor", "cursor", "opacity"),
];
