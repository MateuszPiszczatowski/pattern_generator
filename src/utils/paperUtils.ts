import { IPaperConfig, IMargin, PaperUnit } from "./interfaces-n-types";

const unitRelations = {
  mm: {
    mm: 1,
    cm: 0.1,
    in: 1 / 25.4,
  },
  cm: {
    mm: 10,
    cm: 1,
    in: 1 / 2.54,
  },
  in: {
    mm: 25.4,
    cm: 2.54,
    in: 1,
  },
};

export class PaperConfig implements IPaperConfig {
  public readonly margin: IMargin;

  constructor(
    public readonly unit: PaperUnit,
    public readonly width: number,
    public readonly height: number,
    public readonly helpingBorders: boolean,
    public readonly helpingCorners: boolean,
    public readonly pagesCounter: boolean,
    margin?: IMargin
  ) {
    if (margin) {
      if (margin.top + margin.bottom < height && margin.left + margin.right < width) {
        this.margin = margin;
      } else this.margin = this.getDefaultMargin();
    } else this.margin = this.getDefaultMargin();
  }

  public getWithChangedOrientation() {
    const reorientedPaperConfig = new PaperConfig(
      this.unit,
      this.height,
      this.width,
      this.helpingBorders,
      this.helpingCorners,
      this.pagesCounter,
      {
        top: this.margin.left,
        right: this.margin.top,
        bottom: this.margin.right,
        left: this.margin.bottom,
      }
    );
    return reorientedPaperConfig;
  }

  private getDefaultMargin(): IMargin {
    return {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    };
  }
}

const defaultMargins = {
  mm: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  in: {
    top: 0.5,
    right: 0.5,
    bottom: 0.5,
    left: 0.5,
  },
};

export const DefaultSizes: { [key: string]: PaperConfig } = {
  a4: new PaperConfig("mm", 210, 297, true, true, true, defaultMargins.mm),
  a3: new PaperConfig("mm", 297, 420, true, true, true, defaultMargins.mm),
  a0: new PaperConfig("mm", 841, 1189, true, true, true, defaultMargins.mm),
  letter: new PaperConfig("in", 8.5, 11, true, true, true, defaultMargins.in),
  legal: new PaperConfig("in", 8.5, 14, true, true, true, defaultMargins.in),
  tabloid: new PaperConfig("in", 11, 17, true, true, true, defaultMargins.in),
};

export function changeUnit(number: number, numberUnit: PaperUnit, toUnit: PaperUnit) {
  return number * unitRelations[numberUnit][toUnit];
}
