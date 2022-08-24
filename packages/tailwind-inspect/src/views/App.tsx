import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { observer } from "mobx-react-lite";
import { StyleInspector } from "./inspector/StyleInspector";
import { JSXTreeView } from "./JSXTreeView";
import { AppState } from "../state/AppState";
import { DemoRunner } from "./DemoRunner";
import { SelectionOverlay } from "./SelectionOverlay";

const appState = new AppState();

export const App = observer(function App() {
  return (
    <PaintkitRoot colorScheme="dark">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div
          className="flex-1 bg-zinc-800 text-white overflow-y-auto p-4"
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
          <div className="bg-zinc-800 p-1">
            <button
              className="
              bg-blue-500
              text-white
              text-sm
              py-1
              px-2
              rounded-md
              hover:bg-blue-600
            "
            >
              Open demo.tsx...
            </button>
          </div>
          <div className="flex-1 relative">
            <DemoRunner appState={appState} />
            <SelectionOverlay appState={appState} />
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
