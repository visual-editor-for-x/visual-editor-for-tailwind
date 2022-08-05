import { AllStyleKey, StyleKey } from "./Style";

export interface ITailwindProperty {
  cssName: AllStyleKey;
  toTailwind(cssValue: string): string | undefined;
  fromTailwind(tailwindValue: string): string | undefined;
}

export class JITTailwindProperty implements ITailwindProperty {
  constructor(cssName: AllStyleKey, tailwindName: string) {
    this.tailwindName = tailwindName;
    this.cssName = cssName;
  }

  readonly tailwindName: string;
  readonly cssName: AllStyleKey;

  toTailwind(cssValue: string): string {
    return `${this.tailwindName}-[${cssValue}]`;
  }

  fromTailwind(tailwindValue: string): string | undefined {
    const match = tailwindValue.match(
      new RegExp(`${this.tailwindName}-\\[([^\\]]+)\\]`)
    );
    if (match) {
      return match[1];
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
  constructor(
    cssName: AllStyleKey,
    keywordCSSToTailwind: Record<string, string>
  ) {
    this.cssName = cssName;
    this.keywordCSSToTailwind = new Map(Object.entries(keywordCSSToTailwind));
    this.keywordTailwindToCSS = new Map(
      Array.from(this.keywordCSSToTailwind.entries()).map(([key, value]) => [
        value,
        key,
      ])
    );
  }
  readonly cssName: StyleKey;
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
    none: "hidden",
  }),
  new JITTailwindProperty("paddingTop", "pt"),
  new JITTailwindProperty("paddingRight", "pr"),
  new JITTailwindProperty("paddingBottom", "pb"),
  new JITTailwindProperty("paddingLeft", "pl"),
  new KeywordTailwindProperty("flexDirection", {
    row: "flex-row",
    "row-reverse": "flex-row-reverse",
    column: "flex-col",
    "column-reverse": "flex-col-reverse",
  }),
  new KeywordTailwindProperty("flexWrap", {
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
    nowrap: "flex-nowrap",
  }),
  new KeywordTailwindProperty("alignItems", {
    "flex-start": "items-start",
    "flex-end": "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  }),
  new KeywordTailwindProperty("justifyContent", {
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    center: "justify-center",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
  }),
  new JITTailwindProperty("columnGap", "gap-x"),
  new JITTailwindProperty("rowGap", "gap-y"),

  // text

  new FontFamilyTailwindProperty(),
  new JITTailwindProperty("fontWeight", "font"),
  new JITTailwindProperty("fontSize", "text"),
  new JITTailwindProperty("lineHeight", "leading"),
  new JITTailwindProperty("letterSpacing", "tracking"),
  new JITTailwindProperty("color", "text"),
  new KeywordTailwindProperty("textAlign", {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }),
  new KeywordTailwindProperty("fontStyle", {
    normal: "not-italic",
    italic: "italic",
  }),
  new KeywordTailwindProperty("textDecorationLine", {
    none: "no-underline",
    underline: "underline",
    "line-through": "line-through",
  }),

  // background

  new JITTailwindProperty("background", "bg"),

  // border

  new KeywordTailwindProperty("borderStyle", {
    none: "border-none",
    solid: "border-solid",
    double: "border-double",
    dotted: "border-dotted",
    dashed: "border-dashed",
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
