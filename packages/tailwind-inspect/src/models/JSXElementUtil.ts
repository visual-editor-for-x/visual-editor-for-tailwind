import { JSXAttribute, JSXElement } from "@babel/types";

export const JSXElementUtil = {
  nodeForPath(
    node: JSXElement,
    path: readonly number[]
  ): JSXElement["children"][number] | undefined {
    if (path.length === 0) {
      return node;
    }

    const [nextIndex, ...rest] = path;
    const children = node.children;
    if (nextIndex < children.length) {
      const child = children[nextIndex];
      if (rest.length === 0) {
        return child;
      }

      if (child.type === "JSXElement") {
        return this.nodeForPath(child, rest);
      }
    }
  },

  getAttribute(element: JSXElement, key: string): string | undefined {
    for (const attribute of element.openingElement.attributes) {
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

  setAttribute(element: JSXElement, key: string, value: string | undefined) {
    if (!value) {
      element.openingElement.attributes =
        element.openingElement.attributes.filter(
          (attr) => !(attr.type === "JSXAttribute" && attr.name.name === key)
        );
      return;
    }

    const attribute = element.openingElement.attributes.find(
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
      element.openingElement.attributes.push({
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
