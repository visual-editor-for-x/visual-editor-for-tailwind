import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { StyleInspector } from "./inspector/StyleInspector";

function App() {
  return (
    <PaintkitRoot colorScheme="dark">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div className="flex-1"></div>
        <div className="bg-zinc-800 w-64">
          <StyleInspector />
        </div>
      </div>
    </PaintkitRoot>
  );
}

export default App;
