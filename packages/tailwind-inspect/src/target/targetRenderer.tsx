import React, { useEffect } from "react";
// @ts-ignore
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
import ReactDOM from "react-dom/client";
import type { DOMMapping } from "../state/DOMMapping";
import Target from "./target";

const Container: React.FC = () => {
  useEffect(() => {
    console.log("container render");
  });

  return <Target />;
};

// @ts-ignore
const getInstanceFromNode =
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Events[0];
console.log(getInstanceFromNode);

// @ts-ignore
const domMapping: DOMMapping = window.parent.domMapping;

console.log(domMapping);

const root = document.createElement("div");
document.body.appendChild(root);

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
  <React.StrictMode>
    <Container />
  </React.StrictMode>
);

setTimeout(() => {
  console.log("update domMapping");
  domMapping.update(root, getInstanceFromNode);
}, 0);

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", (payload) => {
    setTimeout(() => {
      domMapping.update(root, getInstanceFromNode);
    }, 100);
  });
}
