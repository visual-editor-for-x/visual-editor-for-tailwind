import { describe, expect, it } from "vitest";
import { Style } from "./Style";

describe(Style.name, () => {
  describe("loadTailwind", () => {
    it("should load tailwind classnames", () => {
      const style = new Style();
      style.loadTailwind("bg-[#fff]");
      expect(style.background).toEqual("#fff");
    });
  });
});
