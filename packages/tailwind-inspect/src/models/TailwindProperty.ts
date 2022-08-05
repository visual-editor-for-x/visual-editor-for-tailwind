import { StyleKey } from "./Style";

export interface ITailwindProperty {
  cssName: StyleKey;
  toTailwind(cssValue: string): string | undefined;
  fromTailwind(tailwindValue: string): string | undefined;
}

export class JITTailwindProperty implements ITailwindProperty {
  constructor(cssName: StyleKey, tailwindName: string) {
    this.tailwindName = tailwindName;
    this.cssName = cssName;
  }

  readonly tailwindName: string;
  readonly cssName: StyleKey;

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
  constructor(cssName: StyleKey, keywordCSSToTailwind: Record<string, string>) {
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
  new JITTailwindProperty("marginTop", "mt"),
  new JITTailwindProperty("marginRight", "mr"),
  new JITTailwindProperty("marginBottom", "mb"),
  new JITTailwindProperty("marginLeft", "ml"),
  new JITTailwindProperty("top", "top"),
  new JITTailwindProperty("right", "right"),
  new JITTailwindProperty("bottom", "bottom"),
  new JITTailwindProperty("left", "left"),
  new JITTailwindProperty("width", "w"),
  new JITTailwindProperty("height", "h"),
  new JITTailwindProperty("borderTopLeftRadius", "rounded-tl"),
  new JITTailwindProperty("borderTopRightRadius", "rounded-tr"),
  new JITTailwindProperty("borderBottomRightRadius", "rounded-br"),
  new JITTailwindProperty("borderBottomLeftRadius", "rounded-bl"),
  new JITTailwindProperty("paddingTop", "pt"),
  new JITTailwindProperty("paddingRight", "pr"),
  new JITTailwindProperty("paddingBottom", "pb"),
  new JITTailwindProperty("paddingLeft", "pl"),
  new JITTailwindProperty("columnGap", "gap-x"),
  new JITTailwindProperty("rowGap", "gap-y"),
  new JITTailwindProperty("background", "bg"),
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
  new JITTailwindProperty("borderTopWidth", "border-t"),
  new JITTailwindProperty("borderRightWidth", "border-r"),
  new JITTailwindProperty("borderBottomWidth", "border-b"),
  new JITTailwindProperty("borderLeftWidth", "border-l"),
  new JITTailwindProperty("borderTopColor", "border-t"),
  new JITTailwindProperty("borderRightColor", "border-r"),
  new JITTailwindProperty("borderBottomColor", "border-b"),
  new JITTailwindProperty("borderLeftColor", "border-l"),
  new JITTailwindProperty("opacity", "opacity"),
  new JITTailwindProperty("cursor", "cursor"),
];
