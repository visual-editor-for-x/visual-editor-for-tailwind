import React, { useEffect } from "react";

export const TargetRunner: React.FC = () => {
  const ref = React.createRef<HTMLIFrameElement>();

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) {
      return;
    }

    iframe.srcdoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  </head>
  <body>
  <script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="/@vite/client"></script>
<script src="https://cdn.tailwindcss.com"></script>
<!-- for use with dynamically loaded React components -->
<script src="https://code.iconify.design/iconify-icon/1.0.0-beta.2/iconify-icon.min.js"></script>
  <script type="module">
    import "/src/target/targetRenderer.tsx";
  </script>
  </body>
`;
  }, []);

  return <iframe className="absolute left-0 top-0 w-full h-full" ref={ref} />;
};