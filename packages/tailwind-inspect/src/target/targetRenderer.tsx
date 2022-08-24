import React from "react";
import ReactDOM from "react-dom/client";
import type { DOMMapping } from "../state/DOMMapping";
import Target from "./target";

// @ts-ignore
const domMapping: DOMMapping = window.parent.domMapping;

console.log(domMapping);

const root = document.createElement("div");
document.body.appendChild(root);

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
  <React.StrictMode>
    <Target />
  </React.StrictMode>
);

if (import.meta.hot) {
  import.meta.hot.accept("./target", () => {
    console.log("accept");
    reactRoot.render(
      <React.StrictMode>
        <Target />
      </React.StrictMode>
    );
  });
}
