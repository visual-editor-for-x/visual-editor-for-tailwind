import { isReplacedElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { action, computed, makeObservable, observable } from "mobx";
import {
  AllStyleKey,
  allStyleKeys,
  imageStyleKeys,
  Style,
  textStyleKeys,
} from "../models/Style";

export interface StyleInspectorTarget {
  readonly tagName: string;
  readonly computedStyle: Style;
  readonly style: Style;
}

export class StylePropertyState {
  constructor(state: StyleInspectorState, key: AllStyleKey) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: AllStyleKey;

  @computed get targets(): StyleInspectorTarget[] {
    if (this.key === "color") {
      return [...this.state.textTargets, ...this.state.svgTargets];
    }

    if (imageStyleKeys.includes(this.key as never)) {
      return this.state.imageTargets;
    }
    if (textStyleKeys.includes(this.key as never)) {
      return this.state.textTargets;
    }
    return this.state.targets;
  }

  @computed get computed(): string | undefined {
    const value = sameOrMixed(
      this.targets.map((i) => i.computedStyle[this.key])
    );
    if (value === MIXED) {
      return;
    }
    return value;
  }

  @computed get value(): string | typeof MIXED | undefined {
    return sameOrMixed(this.targets.map((i) => i.style[this.key]));
  }

  readonly onChangeWithoutCommit = action((value: string | undefined) => {
    for (const instance of this.targets) {
      instance.style[this.key] = value || undefined;

      // if (this.key === "width") {
      //   if (!instance.parent && instance.variant) {
      //     if (value) {
      //       instance.variant.width = undefined;
      //     }
      //   }
      // }
    }
    return true;
  });

  readonly onCommit = action(() => {
    //this.state.editorState.history.commit(`Change ${startCase(this.key)}`);
    return true;
  });

  readonly onChange = action((value: string | undefined) => {
    this.onChangeWithoutCommit(value);
    this.onCommit();
    return true;
  });
}

export class StyleInspectorState {
  constructor(getTargets: () => StyleInspectorTarget[]) {
    this._getTargets = getTargets;
    makeObservable(this);

    this.props = Object.fromEntries(
      allStyleKeys.map((key) => [key, new StylePropertyState(this, key)])
    ) as Record<AllStyleKey, StylePropertyState>;
  }

  private readonly _getTargets: () => StyleInspectorTarget[];

  get targets(): StyleInspectorTarget[] {
    return this._getTargets();
  }

  @computed get imageTargets(): StyleInspectorTarget[] {
    // TODO: include other replaced elements?
    return this.targets.filter((i) => i.tagName === "img");
  }

  @computed get textTargets(): StyleInspectorTarget[] {
    return this.targets.filter(
      (i) => !isReplacedElement(i.tagName) && i.tagName !== "svg"
    );
  }

  @computed get svgTargets(): StyleInspectorTarget[] {
    return this.targets.filter((i) => i.tagName === "svg");
  }

  @computed get tagName(): string | typeof MIXED | undefined {
    return sameOrMixed(this.targets.map((i) => i.tagName));
  }

  readonly props: Record<AllStyleKey, StylePropertyState>;

  @observable showsSizeDetails = false;

  readonly onToggleShowSizeDetails = action(() => {
    this.showsSizeDetails = !this.showsSizeDetails;
  });

  @observable showsSeparateRadiuses = false;

  readonly onToggleShowSeparateRadiuses = action(() => {
    this.showsSeparateRadiuses = !this.showsSeparateRadiuses;
  });

  @observable borderEdgeMode: "all" | "top" | "right" | "bottom" | "left" =
    "all";

  readonly setBorderEdgeModeToAll = action(() => {
    this.borderEdgeMode = "all";
  });
  readonly setBorderEdgeModeToTop = action(() => {
    this.borderEdgeMode = "top";
  });
  readonly setBorderEdgeModeToRight = action(() => {
    this.borderEdgeMode = "right";
  });
  readonly setBorderEdgeModeToBottom = action(() => {
    this.borderEdgeMode = "bottom";
  });
  readonly setBorderEdgeModeToLeft = action(() => {
    this.borderEdgeMode = "left";
  });

  @computed get computedParentDisplay(): string | undefined | typeof MIXED {
    return undefined;
    // return sameOrMixed(
    //   this.instances.map((i) => i.parent?.computedStyle.display)
    // );
  }

  @computed get computedParentFlexDirection():
    | string
    | undefined
    | typeof MIXED {
    return undefined;
    // return sameOrMixed(
    //   this.instances.map((i) => i.parent?.computedStyle.flexDirection)
    // );
  }
}
