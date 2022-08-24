import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { AppState } from "../state/AppState";
import Target from "../target/target";

export const TargetRunner: React.FC<{
  appState: AppState;
}> = ({ appState }) => {
  const ref = React.createRef<HTMLIFrameElement>();

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) {
      return;
    }

    // @ts-ignore
    window.domMapping = appState.domMapping;

    const contentDocument = iframe.contentDocument!;

    contentDocument.open();
    contentDocument.write(`
      <!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://code.iconify.design/iconify-icon/1.0.0-beta.2/iconify-icon.min.js"></script>
      </body>
      </html>
    `);
    contentDocument.close();

    const root = contentDocument.createElement("div");
    contentDocument.body.appendChild(root);
    const reactRoot = ReactDOM.createRoot(root);

    reactRoot.render(
      <React.StrictMode>
        <Target />
      </React.StrictMode>
    );

    appState.domMapping.sourceFile.on("openFile", () => {
      console.log("update domMapping");
      appState.domMapping.update(root);
    });
  }, []);

  return <iframe className="absolute left-0 top-0 w-full h-full" ref={ref} />;
};

if (import.meta.hot) {
  // TODO: use vite:afterUpdate https://github.com/vitejs/vite/pull/9810
  import.meta.hot.on("vite:beforeUpdate", (payload) => {
    if (
      payload.updates.some((update) =>
        update.path.endsWith("/target/target.tsx")
      )
    ) {
      console.log("beforeUpdate", payload);
      // TODO: update domMapping
    }
  });
}
