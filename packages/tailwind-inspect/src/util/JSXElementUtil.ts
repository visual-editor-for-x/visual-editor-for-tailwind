import { JSXAttribute, JSXElement, JSXOpeningElement } from "@babel/types";

export const JSXElementUtil = {
  getAttribute(
    openingElement: JSXOpeningElement,
    key: string
  ): string | undefined {
    for (const attribute of openingElement.attributes) {
      if (attribute.type !== "JSXAttribute") {
        continue;
      }
      if (attribute.name.name !== key) {
        continue;
      }

      const value = attribute.value;
      if (value?.type !== "StringLiteral") {
        continue;
      }

      return value.value;
    }
  },

  setAttribute(
    openingElement: JSXOpeningElement,
    key: string,
    value: string | undefined
  ) {
    if (!value) {
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => !(attr.type === "JSXAttribute" && attr.name.name === key)
      );
      return;
    }

    const attribute = openingElement.attributes.find(
      (attr): attr is JSXAttribute =>
        attr.type === "JSXAttribute" &&
        attr.name.type === "JSXIdentifier" &&
        attr.name.name === key
    );
    if (attribute) {
      attribute.value = {
        type: "StringLiteral",
        value,
      };
    } else {
      openingElement.attributes.push({
        type: "JSXAttribute",
        name: {
          type: "JSXIdentifier",
          name: key,
        },
        value: {
          type: "StringLiteral",
          value,
        },
      });
    }
  },
};
