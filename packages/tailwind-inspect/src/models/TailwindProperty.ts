import { AllStyleKey } from "./Style";

export interface ITailwindProperty {
  cssName: AllStyleKey;
  toTailwind(cssValue: string): string | undefined;
  fromTailwind(tailwindValue: string): string | undefined;
}

export class JITTailwindProperty implements ITailwindProperty {
  constructor(
    cssName: AllStyleKey,
    tailwindName: string,
    valueRegExp?: RegExp
  ) {
    this.tailwindName = tailwindName;
    this.cssName = cssName;
    this.valueRegExp = valueRegExp;
  }

  readonly tailwindName: string;
  readonly cssName: AllStyleKey;
  readonly valueRegExp: RegExp | undefined;

  toTailwind(cssValue: string): string {
    return `${this.tailwindName}-[${cssValue}]`;
  }

  fromTailwind(tailwindValue: string): string | undefined {
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
  new JITTailwindProperty("top", "top"),
  new JITTailwindProperty("right", "right"),
  new JITTailwindProperty("bottom", "bottom"),
  new JITTailwindProperty("left", "left"),
  new JITTailwindProperty("marginTop", "mt"),
  new JITTailwindProperty("marginRight", "mr"),
  new JITTailwindProperty("marginBottom", "mb"),
  new JITTailwindProperty("marginLeft", "ml"),

  // size

  new JITTailwindProperty("width", "w"),
  new JITTailwindProperty("height", "h"),
  new JITTailwindProperty("borderTopLeftRadius", "rounded-tl"),
  new JITTailwindProperty("borderTopRightRadius", "rounded-tr"),
  new JITTailwindProperty("borderBottomRightRadius", "rounded-br"),
  new JITTailwindProperty("borderBottomLeftRadius", "rounded-bl"),

  // layout

  new KeywordTailwindProperty("display", {
    inline: "inline",
    block: "block",
    "inline-block": "inline-block",
    flex: "flex",
    "inline-flex": "inline-flex",
    hidden: "none",
  }),
  new JITTailwindProperty("paddingTop", "pt"),
  new JITTailwindProperty("paddingRight", "pr"),
  new JITTailwindProperty("paddingBottom", "pb"),
  new JITTailwindProperty("paddingLeft", "pl"),
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
  new JITTailwindProperty("columnGap", "gap-x"),
  new JITTailwindProperty("rowGap", "gap-y"),

  // text

  new JITTailwindProperty("color", "text", /^#/),
  new FontFamilyTailwindProperty(),
  new JITTailwindProperty("fontWeight", "font", /^[^']/),
  new JITTailwindProperty("fontSize", "text"),
  new JITTailwindProperty("lineHeight", "leading"),
  new JITTailwindProperty("letterSpacing", "tracking"),
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

  new JITTailwindProperty("background", "bg"),

  // border

  new KeywordTailwindProperty("borderStyle", {
    "border-none": "none",
    "border-solid": "solid",
    "border-double": "double",
    "border-dotted": "dotted",
    "border-dashed": "dashed",
  }),
  new JITTailwindProperty("borderTopWidth", "border-t"),
  new JITTailwindProperty("borderRightWidth", "border-r"),
  new JITTailwindProperty("borderBottomWidth", "border-b"),
  new JITTailwindProperty("borderLeftWidth", "border-l"),
  new JITTailwindProperty("borderTopColor", "border-t"),
  new JITTailwindProperty("borderRightColor", "border-r"),
  new JITTailwindProperty("borderBottomColor", "border-b"),
  new JITTailwindProperty("borderLeftColor", "border-l"),

  // effects

  new JITTailwindProperty("opacity", "opacity"),
  new JITTailwindProperty("cursor", "cursor"),
];
