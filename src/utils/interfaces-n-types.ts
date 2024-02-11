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
export interface IPaperMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IPaperConfig {
  unit: PaperUnit;
  width: number;
  height: number;
  margin: IPaperMargin;
}
export type PaperUnit = "mm" | "cm" | "in";
