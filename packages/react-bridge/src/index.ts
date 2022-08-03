import {
  activate as activateBackend,
  initialize as initializeBackend,
} from "react-devtools-inline/backend";
import { initialize as initializeFrontend } from "react-devtools-inline/frontend";

initializeBackend(window);
initializeFrontend(window);

const initBridge = () => {
  activateBackend(window);

  let tmpBorder = "";
  window.addEventListener("pointerout", (e) => {
    if (!e.target || !window.__REACT_DEVTOOLS_GLOBAL_HOOK__) return;

    const target = e.target as HTMLElement;
    target.style.border = tmpBorder;
  });

  window.addEventListener("pointerover", (e) => {
    if (!e.target || !window.__REACT_DEVTOOLS_GLOBAL_HOOK__) return;

    const renderer = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
    if (!renderer) {
      console.error("No __REACT_DEVTOOLS_GLOBAL_HOOK__ renderer !!");
      return;
    }

    const target = e.target as HTMLElement;
    tmpBorder = target.style.border;

    const fiber = renderer.findFiberByHostInstance(e.target);

    if (fiber && fiber._debugSource) {
      target.title = `${fiber._debugSource.fileName}:${fiber._debugSource.lineNumber}`;
      target.style.border = "1px solid blue";

      window.parent.postMessage(
        { source: "tailwind-editor", _debugSource: fiber._debugSource },
        "*"
      );
      console.log(fiber._debugSource);
    }
  });
};

window.addEventListener("load", initBridge);
