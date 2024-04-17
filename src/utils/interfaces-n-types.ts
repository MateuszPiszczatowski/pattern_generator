export interface IWidthAndHeight {
  width: number;
  height: number;
}

export interface IImageConfig {
  source: string;
  width: number;
  height: number;
  unit: PaperUnit;
}
export interface IMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IPaperConfig {
  unit: PaperUnit;
  width: number;
  height: number;
  margin: IMargin;
  helpingCorners: boolean;
  helpingBorders: boolean;
  pagesCounter: boolean;
  getWithChangedOrientation: () => IPaperConfig;
}
export type PaperUnit = "mm" | "cm" | "in";

export interface ISewingPatter {
  getWidth: () => number;
  getHeight: () => number;
  getDataUrl: () => string;
}

export interface IPatternConfigurator {
  title: string;
  picture: string;
  positions: { [key: string]: { message: string; default: number; value?: number } };
  selects: { [key: string]: { message: string; default: boolean; value?: boolean } };
  lackingPositions: () => string[];
  lackingSelects: () => string[];
  setPosition: (name: string, value: number) => void;
  setSelect: (name: string, value: boolean) => void;
  isReady: () => boolean;
  reset: () => void;
  getPattern: () => ISewingPatter;
  getUnreadyMessages: () => string[];
}
