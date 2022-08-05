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
      const isRemove =
        value === "" &&
        path.node.loc?.start.line === targetComponentLine &&
        path.isJSXOpeningElement();

      if (isRemove) {
        path.node.attributes = path.node.attributes.filter(
          (attr) => attr.type === "JSXAttribute" && attr.name.name !== attribute
        );
        path.stop();
        return;
      }

      const isUpdate =
        path.parent.loc?.start.line === targetComponentLine &&
        path.isJSXAttribute({ name: attribute });

      if (isUpdate) {
        path.node.value = { type: "StringLiteral", value };
        path.stop();
        return;
      }

      const isAdd =
        path.node.loc?.start.line === targetComponentLine &&
        path.isJSXOpeningElement();

      if (isAdd) {
        path.node.attributes.unshift({
          type: "JSXAttribute",
          name: { type: "JSXIdentifier", name: attribute },
          value: { type: "StringLiteral", value },
        });
        path.stop();
        return;
      }
    },
  });

  return generate(ast).code;
};
