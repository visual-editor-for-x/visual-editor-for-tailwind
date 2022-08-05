import { test, describe, expect } from "vitest";
import { readFileSync } from "fs";
import { getAttributeModifiedCode } from "../src";
import path from "path";

describe("getAttributeModifiedCode", () => {
  const getTestCodeByFileName = (fileName: string) =>
    readFileSync(
      path.join(__dirname, "./data/getAttributeModifiedCode", fileName),
      "utf8"
    );

  const testCases = [
    {
      name: "jsx, update one line component",
      inputCode: getTestCodeByFileName("Card.jsx"),
      targetComponentLine: 7,
      attribute: "className",
      value: "mod text-xl mb-2",
    },
    {
      name: "jsx, update multi line component",
      inputCode: getTestCodeByFileName("Card.jsx"),
      targetComponentLine: 8,
      attribute: "className",
      value: "mod text-base",
    },
    {
      name: "tsx, update one line component",
      inputCode: getTestCodeByFileName("Card.tsx"),
      targetComponentLine: 16,
      attribute: "className",
      value: "mod text-xl mb-2",
    },
    {
      name: "tsx, update multi line component",
      inputCode: getTestCodeByFileName("Card.tsx"),
      targetComponentLine: 17,
      attribute: "className",
      value: "mod text-base",
    },
    {
      name: "jsx, add one line component",
      inputCode: getTestCodeByFileName("NoClassNameComponent.jsx"),
      targetComponentLine: 5,
      attribute: "className",
      value: "mod",
    },
    {
      name: "jsx, add multi line component",
      inputCode: getTestCodeByFileName("NoClassNameComponent.jsx"),
      targetComponentLine: 6,
      attribute: "className",
      value: "mod",
    },
    {
      name: "jsx, remove one line component",
      inputCode: getTestCodeByFileName("Card.jsx"),
      targetComponentLine: 4,
      attribute: "className",
      value: "",
    },
    {
      name: "jsx, remove multi line component",
      inputCode: getTestCodeByFileName("Card.jsx"),
      targetComponentLine: 8,
      attribute: "className",
      value: "",
    },
  ];

  testCases.forEach(
    ({ name, inputCode: code, targetComponentLine, attribute, value }) => {
      test(name, () => {
        const arg = { code, targetComponentLine, attribute, value };
        const result = getAttributeModifiedCode(arg);
        expect(result).toMatchSnapshot();
      });
    }
  );
});
