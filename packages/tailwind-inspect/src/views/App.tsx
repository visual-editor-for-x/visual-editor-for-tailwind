import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { ResizeBox } from "@seanchas116/paintkit/src/components/ResizeBox";
import { compact } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Rect, Vec2 } from "paintvec";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleInspector } from "./inspector/StyleInspector";
import { JSXTreeView } from "./JSXTreeView";
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

  const onMouseDown = action((e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement;

    const node = appState.domMapping.nodeForDOM.get(element);
    if (node) {
      appState.sourceFile.node.deselect();
      node.select();
    }
  });

  const onMouseMove = action((e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement;
    appState.sourceFile.hoveredElement =
      appState.domMapping.nodeForDOM.get(element);
  });

  const onMouseLeave = action(() => {
    appState.sourceFile.hoveredElement = undefined;
  });

  const ref = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current) {
      const elem = ref.current;
      // Looks like we have to wait for fiber nodes to be ready
      setTimeout(
        action(() => {
          appState.domMapping.update(elem);
        }),
        0
      );
    }
  });

  useEffect(() => {
    const elem = ref.current;
    if (!elem) {
      return;
    }

    const handler = action(() => {
      appState.domMapping.update(elem);
    });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("change", handler);
  }, [ref]);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
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
  const selectedElements = appState.sourceFile.selectedElements;
  const selectedRects = selectedElements.map((element) => element.boundingBox);

  const hoveredElement = appState.sourceFile.hoveredElement;
  const hoveredRect = hoveredElement?.boundingBox;

  return (
    <svg className="absolute left-0 top-0 w-full h-full pointer-events-none">
      {hoveredRect && (
        <rect
          x={hoveredRect.left}
          y={hoveredRect.top}
          width={hoveredRect.width}
          height={hoveredRect.height}
          fill="transparent"
          stroke={colors.active}
          strokeWidth={1}
        />
      )}

      {selectedRects.map((rect, i) => {
        return (
          <ResizeBox
            p0={rect.topLeft}
            p1={rect.bottomRight}
            snap={(p) => p}
            onChangeBegin={() => {}}
            onChange={(p0, p1) => {
              // TODO
            }}
            onChangeEnd={() => {}}
          />
        );
      })}
    </svg>
  );
});

export default App;
