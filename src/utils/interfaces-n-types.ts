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

export const units = ["mm", "cm", "in"] as const;
export type PaperUnit = (typeof units)[number];

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
  getLackingPositions: () => string[];
  getLackingSelects: () => string[];
  setPosition: (name: string, value: number) => void;
  setSelect: (name: string, value: boolean) => void;
  isReady: () => boolean;
  reset: () => void;
  getPattern: () => ISewingPatter;
  getUnreadyMessages: () => string[];
}
