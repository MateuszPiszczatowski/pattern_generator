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
}
export type PaperUnit = "mm" | "cm" | "in";
