import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import { StyleInspectorState } from "../state/StyleInspectorState";
import { BackgroundPane } from "./BackgroundPane";
import { BorderPane } from "./BorderPane";
import { EffectsPane } from "./EffectsPane";
import { FlexItemPane } from "./FlexItemPane";
import { ImagePane } from "./ImagePane";
import { LayoutPane } from "./LayoutPane";
import { PositionPane } from "./PositionPane";
import { SizePane } from "./SizePane";
import { SVGPane } from "./SVGPane";
import { TextPane } from "./TextPane";

const StyleInspectorWrap = styled.div``;

export const StyleInspector: React.FC<{
  state: StyleInspectorState;
  className?: string;
}> = observer(function StyleInspector({ state, className }) {
  if (state.targets.length === 0) {
    return null;
  }

  return (
    <StyleInspectorWrap className={className}>
      <FlexItemPane state={state} />
      <PositionPane state={state} />
      <SizePane state={state} />
      <LayoutPane state={state} />
      <TextPane state={state} />
      <SVGPane state={state} />
      <ImagePane state={state} />
      <BackgroundPane state={state} />
      <BorderPane state={state} />
      <EffectsPane state={state} />
    </StyleInspectorWrap>
  );
});
