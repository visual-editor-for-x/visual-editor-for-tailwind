import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import { StringLiteral } from "@babel/types";
import { readFileSync } from "fs";

const input = {
  fileName: "/Users/user/Develop/service/src/pages/about/index.tsx",
  componentStartLine: 55,
  attribute: "className",
  oldValue: "column",
  newValue: "new-column",
};

const { fileName, componentStartLine, attribute, oldValue, newValue } = input;

const file = readFileSync(fileName, "utf8");

const ast = parse(file, {
  sourceType: "module",
  plugins: ["jsx", "typescript"],
});

traverse(ast, {
  JSXAttribute(path) {
    if (
      path.parent.loc?.start.line === componentStartLine &&
      path.node.name.name === attribute &&
      (path.node.value as StringLiteral).value === oldValue
    ) {
      path.node.value = { type: "StringLiteral", value: newValue };
    }
  },
});

const result = generate(ast);

console.log(result.code);
