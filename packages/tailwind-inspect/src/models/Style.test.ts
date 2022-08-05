import { describe, expect, it } from "vitest";
import { Style } from "./Style";

describe(Style.name, () => {
  describe("loadTailwind", () => {
    it("should load tailwind classnames", () => {
      const style = new Style();
      style.loadTailwind("bg-[#fff] absolute font-['Open_Sans']");
      expect(style.background).toEqual("#fff");
      expect(style.position).toEqual("absolute");
      expect(style.fontFamily).toEqual("Open Sans");
      expect(style.toTailwind()).toEqual(
        "absolute font-['Open_Sans'] bg-[#fff]"
      );
    });
  });
});
