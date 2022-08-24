import React from "react";
import ReactDOM from "react-dom/client";
import Target from "./target";

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
