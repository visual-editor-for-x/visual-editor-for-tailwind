import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { StyleInspector } from "./inspector/StyleInspector";
import { AppState } from "./state/AppState";
import Demo from "./state/demo";

const appState = new AppState();

const App = observer(function App() {
  const tailwindClass = appState.elementInstance.style.toTailwind();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetRef.current) {
      appState.elementInstance.computedStyle.loadComputedStyle(
        targetRef.current
      );
    }
  }, [tailwindClass]);

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
          <Demo />
        </div>
        <div className="bg-zinc-800 w-64 overflow-y-auto">
          <StyleInspector state={appState.styleInspectorState} />
        </div>
      </div>
    </PaintkitRoot>
  );
});

export default App;
