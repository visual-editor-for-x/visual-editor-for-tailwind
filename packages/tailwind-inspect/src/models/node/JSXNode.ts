import { JSXElementNode } from "./JSXElementNode";
import { JSXOtherNode } from "./JSXOtherNode";
import { JSXTextNode } from "./JSXTextNode";

export type JSXNode = JSXElementNode | JSXTextNode | JSXOtherNode;
