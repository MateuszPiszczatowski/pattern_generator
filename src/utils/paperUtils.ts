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

  private getDefaultMargin(): IMargin {
    return {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    };
  }
}

export const DefaultSizes: { [key: string]: PaperConfig } = {
  a4: new PaperConfig("mm", 210, 297, true, true, true),
  a3: new PaperConfig("mm", 297, 420, true, true, true),
  a0: new PaperConfig("mm", 841, 1189, true, true, true),
  letter: new PaperConfig("in", 8.5, 11, true, true, true),
  legal: new PaperConfig("in", 8.5, 14, true, true, true),
  tabloid: new PaperConfig("in", 11, 17, true, true, true),
};

export function changeUnit(number: number, numberUnit: PaperUnit, toUnit: PaperUnit) {
  return number * unitRelations[numberUnit][toUnit];
}
