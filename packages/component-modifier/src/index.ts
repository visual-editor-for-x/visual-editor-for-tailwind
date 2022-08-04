import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

export const getModifiedCode = (arg: {
  code: string;
  targetComponentLine: number;
  attribute: string;
  value: string;
}) => {
  const { code, targetComponentLine, attribute, value } = arg;

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    JSXAttribute(path) {
      if (
        path.parent.loc?.start.line === targetComponentLine &&
        path.node.name.name === attribute
      ) {
        path.node.value = { type: "StringLiteral", value };
      }
    },
  });

  return generate(ast).code;
};
