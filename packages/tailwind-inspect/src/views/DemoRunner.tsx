import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { AppState } from "../state/AppState";

export const DemoRunner = observer(function DemoRunner({
  appState,
}: {
  appState: AppState;
}) {
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
    return () => window.removeEventListener("resize", handler);
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
