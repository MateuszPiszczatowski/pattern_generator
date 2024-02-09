export type paperUnit = "mm" | "cm" | "in";
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
  public readonly margin: IPaperMargin;

  constructor(
    public readonly unit: paperUnit,
    public readonly width: number,
    public readonly height: number,
    margin?: IPaperMargin
  ) {
    if (margin) {
      if (margin.top + margin.bottom < height && margin.left + margin.right < width) {
        this.margin = margin;
      } else this.margin = this.getDefaultMargin();
    } else this.margin = this.getDefaultMargin();
  }

  private getDefaultMargin(): IPaperMargin {
    return {
      top: this.height * 0.05,
      bottom: this.height * 0.05,
      right: this.width * 0.05,
      left: this.width * 0.05,
    };
  }
}

export interface IPaperMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IPaperConfig {
  unit: paperUnit;
  width: number;
  height: number;
  margin: IPaperMargin;
}

export const DefaultSizes = {
  a4: new PaperConfig("mm", 210, 297),
  a3: new PaperConfig("mm", 297, 420),
  a0: new PaperConfig("mm", 841, 1189),
  letter: new PaperConfig("in", 8.5, 11),
  legal: new PaperConfig("in", 8.5, 14),
  tabloid: new PaperConfig("in", 11, 17),
};

export function changeUnit(number: number, numberUnit: paperUnit, toUnit: paperUnit) {
  return number * unitRelations[numberUnit][toUnit];
}
