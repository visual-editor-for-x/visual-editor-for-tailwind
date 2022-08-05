import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

export const getAttributeModifiedCode = (arg: {
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
    enter(path) {
      const isUpdate =
        path.isJSXAttribute({ name: attribute }) &&
        path.parent.loc?.start.line === targetComponentLine;

      const isAdd =
        path.isJSXOpeningElement() &&
        path.node.loc?.start.line === targetComponentLine;

      if (isUpdate) {
        path.node.value = { type: "StringLiteral", value };
        return;
      }
      if (isAdd) {
        path.node.attributes.unshift({
          type: "JSXAttribute",
          name: { type: "JSXIdentifier", name: attribute },
          value: { type: "StringLiteral", value },
        });
        return;
      }
      // TODO remove
    },
  });

  return generate(ast).code;
};
