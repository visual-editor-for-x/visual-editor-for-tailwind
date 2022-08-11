import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { observer } from "mobx-react-lite";
import React from "react";
import { StyleInspector } from "../inspector/StyleInspector";
import { JSXTreeView } from "../outline/JSXTreeView";
import { AppState } from "../state/AppState";

const appState = new AppState();

const App = observer(function App() {
  return (
    <PaintkitRoot colorScheme="dark">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div
          className="flex-1 bg-gray-900 text-white overflow-y-auto p-4"
          style={{ contain: "strict" }}
        >
          <pre className="text-xs text-white whitespace-pre-wrap">
            {appState.sourceFile.code}
          </pre>
        </div>
        <div className="flex-1" style={{ contain: "strict" }}>
          <DemoRunner appState={appState} />
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

const DemoRunner = observer(({ appState }: { appState: AppState }) => {
  const module = new Function("exports", "React", appState.compiledCode) as (
    exports: any,
    react: typeof React
  ) => void;
  const exports: { default?: React.FC } = {};
  module(exports, React);

  const Component = exports.default!;

  return <Component />;
});

export default App;
