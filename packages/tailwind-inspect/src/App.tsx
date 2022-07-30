import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { observer } from "mobx-react-lite";
import { StyleInspector } from "./inspector/StyleInspector";
import { AppState } from "./state/AppState";

const appState = new AppState();

const App = observer(function App() {
  return (
    <PaintkitRoot colorScheme="dark">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div className="flex-1">
          {appState.elementInstance.style.toTailwind()}
        </div>
        <div className="bg-zinc-800 w-64">
          <StyleInspector state={appState.styleInspectorState} />
        </div>
      </div>
    </PaintkitRoot>
  );
});

export default App;
