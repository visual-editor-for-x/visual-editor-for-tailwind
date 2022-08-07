import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useEffect, useRef } from "react";
import { StyleInspector } from "./inspector/StyleInspector";
import { JSXTreeView } from "./outline/JSXTreeView";
import { AppState } from "./state/AppState";

const appState = new AppState();

const App = observer(function App() {
  const tailwindClass = appState.elementInstance.style.toTailwind();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(
    action(() => {
      if (targetRef.current) {
        appState.elementInstance.computedStyle.loadComputedStyle(
          targetRef.current
        );
      }
    }),
    [tailwindClass]
  );

  return (
    <PaintkitRoot colorScheme="dark">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div className="flex-1">
          <div className={tailwindClass} ref={targetRef}>
            Lorem Ipsum
            <div className="bg-red-500 w-24 h-12">Block 1</div>
            <div className="bg-blue-500 w-12 h-24">Block 2</div>
          </div>
          <div className="text-gray-500 text-sm">
            class: <span className="text-gray-700">{tailwindClass}</span>
          </div>
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
