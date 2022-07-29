import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { StyleInspector } from "./inspector/StyleInspector";

function App() {
  return (
    <PaintkitRoot colorScheme="auto">
      <div className="flex w-full h-full fixed left-0 top-0">
        <div className="flex-1"></div>
        <div className="bg-gray-500 w-64">
          <StyleInspector />
        </div>
      </div>
    </PaintkitRoot>
  );
}

export default App;
