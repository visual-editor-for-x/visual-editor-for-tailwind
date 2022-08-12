import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { compact } from "lodash-es";
import { observer } from "mobx-react-lite";
import React, { useEffect, useLayoutEffect, useState } from "react";
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
        <div className="flex-1 relative" style={{ contain: "strict" }}>
          <DemoRunner appState={appState} />
          <SelectionOverlay appState={appState} />
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

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement;

    const path = appState.domMapping.pathForDOM(element);
    if (path) {
      appState.sourceFile.selection.clear();
      appState.sourceFile.selection.add(path);
    }
  };

  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current) {
      appState.domMapping.update(ref.current);
    }
  });

  return (
    <div
      onClick={onClick}
      ref={ref}
      className="absolute left-0 top-0 w-full h-full"
    >
      <Component />
    </div>
  );
});

const SelectionOverlay = observer(function SelectionOverlay({
  appState,
}: {
  appState: AppState;
}) {
  const ref = React.createRef<SVGSVGElement>();

  const [topLeft, setTopLeft] = useState<[number, number]>([0, 0]);

  const selectedElements = compact(
    appState.sourceFile.selection.allPaths.map((path) =>
      appState.domMapping.domForPath(path)
    )
  );

  console.log(selectedElements);

  useLayoutEffect(() => {
    if (ref.current) {
      const { top, left } = ref.current.getBoundingClientRect();
      setTopLeft([left, top]);
    }
  }, []);

  return (
    <svg
      ref={ref}
      className="absolute left-0 top-0 w-full h-full pointer-events-none"
    >
      {selectedElements.map((element, i) => {
        const rect = element.getBoundingClientRect();

        const left = rect.left - topLeft[0];
        const top = rect.top - topLeft[1];
        const width = rect.width;
        const height = rect.height;

        return (
          <rect
            key={i}
            x={left}
            y={top}
            width={width}
            height={height}
            fill="transparent"
            stroke={colors.active}
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
});

export default App;
