import { describe, expect, it } from "vitest";
import { Style } from "./Style";

describe(Style.name, () => {
  describe("loadTailwind", () => {
    it("should load tailwind classnames", () => {
      const style = new Style();
      style.loadTailwind("bg-[#fff] absolute font-['Open_Sans'] text-[#345]");
      expect(style.background).toEqual("#fff");
      expect(style.position).toEqual("absolute");
      expect(style.fontFamily).toEqual("Open Sans");
      expect(style.color).toEqual("#345");
      expect(style.position).toEqual("absolute");
      expect(style.toTailwind()).toEqual(
        "absolute text-[#345] font-['Open_Sans'] bg-[#fff]"
      );
    });
  });
});
