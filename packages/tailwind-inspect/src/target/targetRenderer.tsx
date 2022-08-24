import React from "react";
import ReactDOM from "react-dom/client";
import Target from "./target";

const root = document.createElement("div");
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Target />
  </React.StrictMode>
);
