import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { ResizeBox } from "@seanchas116/paintkit/src/components/ResizeBox";
import { observer } from "mobx-react-lite";
import { AppState } from "../state/AppState";

export const SelectionOverlay = observer(function SelectionOverlay({
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
