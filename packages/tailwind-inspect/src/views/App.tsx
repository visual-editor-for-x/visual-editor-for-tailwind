import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { observer } from "mobx-react-lite";
import { StyleInspector } from "./inspector/StyleInspector";
import { JSXTreeView } from "./JSXTreeView";
import { AppState } from "../state/AppState";
import { DemoRunner } from "./DemoRunner";
import { SelectionOverlay } from "./SelectionOverlay";
import { TargetRunner } from "./TargetRunner";
import { action } from "mobx";

const appState = new AppState();

export const App = observer(function App() {
  return (
    <PaintkitRoot colorScheme="dark">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div className="flex flex-col flex-1">
          <div className="bg-zinc-800 p-2 flex gap-2 items-center">
            <div className="text-sm text-zinc-400 mr-4">
              /edit-target.tsx will be edited
            </div>
            <label className="text-white flex items-center gap-1">
              <input
                style={{ appearance: "auto" }}
                type="checkbox"
                checked={appState.showsCode}
                onClick={action(
                  () => (appState.showsCode = !appState.showsCode)
                )}
              />
              Show Code
            </label>
          </div>
          <div className="flex flex-1">
            <div
              className="flex-1 bg-zinc-800 text-white overflow-y-auto p-4"
              hidden={!appState.showsCode}
              style={{ contain: "strict" }}
            >
              <pre className="text-xs text-white whitespace-pre-wrap">
                {appState.sourceFile.code}
              </pre>
            </div>
            <div
              className="flex-1 relative flex flex-col"
              style={{ contain: "strict" }}
            >
              <TargetRunner appState={appState} />
              <SelectionOverlay appState={appState} />
            </div>
          </div>
        </div>
        <div className="bg-zinc-800 w-64 flex flex-col ">
          <JSXTreeView
            className="h-80 shrink-0 border-b-neutral-700 border-solid border-b-[2px]"
            file={appState.sourceFile}
          />
          <StyleInspector
            className="flex-1 overflow-y-auto"
            state={appState.styleInspectorState}
          />
        </div>
      </div>
    </PaintkitRoot>
  );
});

if (import.meta.hot) {
  // TODO: use vite:afterUpdate https://github.com/vitejs/vite/pull/9810
  import.meta.hot.on("vite:beforeUpdate", (payload) => {
    if (
      payload.updates.some((update) => update.path.endsWith("/edit-target.tsx"))
    ) {
      appState.sourceFile.fetchCode();
    }
  });
}
