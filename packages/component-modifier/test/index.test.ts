import { test, describe, expect } from "vitest";
import { readFileSync } from "fs";
import { getModifiedCode } from "../src";
import path from "path";

describe("getModifiedCode", () => {
  const getTestCodeByFileName = (fileName: string) =>
    readFileSync(
      path.join(__dirname, "./data/getModifiedCode", fileName),
      "utf8"
    );

  const testCases = [
    {
      name: "jsx, one line component",
      inputCode: getTestCodeByFileName("Card.jsx"),
      targetComponentLine: 7,
      attribute: "className",
      value: "mod text-xl mb-2",
    },
    {
      name: "jsx, multi line component",
      inputCode: getTestCodeByFileName("Card.jsx"),
      targetComponentLine: 8,
      attribute: "className",
      value: "mod text-base",
    },
    {
      name: "tsx, one line component",
      inputCode: getTestCodeByFileName("Card.tsx"),
      targetComponentLine: 16,
      attribute: "className",
      value: "mod text-xl mb-2",
    },
    {
      name: "tsx, multi line component",
      inputCode: getTestCodeByFileName("Card.tsx"),
      targetComponentLine: 17,
      attribute: "className",
      value: "mod text-base",
    },
  ];

  testCases.forEach((testCase) => {
    const {
      name,
      inputCode: code,
      targetComponentLine,
      attribute,
      value,
    } = testCase;
    test(name, () => {
      const result = getModifiedCode({
        code,
        targetComponentLine,
        attribute,
        value,
      });
      expect(result).toMatchSnapshot();
    });
  });
});
