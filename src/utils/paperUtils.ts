import {
  IPaperConfig,
  IMargin,
  PaperUnit,
  IWidthAndHeight,
  IImageConfig,
} from "./interfaces-n-types";

// Relations between defined units.
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

/* Function that takes imageConfig and paperConfig and returns image sizes in the same units as the paper is set in.
 * The purpose is for the user to convienently pass both configs as attributes rather than tinkering with getting all the needed info themself.
 */
export function getIImageSizesInIPaperUnits(
  imageConfig: IImageConfig,
  paperConfig: IPaperConfig
): IWidthAndHeight {
  const imageWidthInPaperUnits = changeUnit(imageConfig.width, imageConfig.unit, paperConfig.unit);
  const imageHeightInPaperUnits = changeUnit(
    imageConfig.height,
    imageConfig.unit,
    paperConfig.unit
  );
  return { width: imageWidthInPaperUnits, height: imageHeightInPaperUnits };
}

// Class for a paper printing configuration.
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

  // Change the orientation of the paper so the top is on the left.
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

  // Set default margin to all 0.
  private getDefaultMargin(): IMargin {
    return {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    };
  }
}

// Default margins for default sizes.
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

// Commonly used sizes are predefined here.
export const DefaultSizes: { [key: string]: PaperConfig } = {
  a4: new PaperConfig("mm", 210, 297, true, true, true, defaultMargins.mm),
  a3: new PaperConfig("mm", 297, 420, true, true, true, defaultMargins.mm),
  a0: new PaperConfig("mm", 841, 1189, true, true, true, defaultMargins.mm),
  letter: new PaperConfig("in", 8.5, 11, true, true, true, defaultMargins.in),
  legal: new PaperConfig("in", 8.5, 14, true, true, true, defaultMargins.in),
  tabloid: new PaperConfig("in", 11, 17, true, true, true, defaultMargins.in),
};

// Converts the number according to base and target units.
export function changeUnit(number: number, numberUnit: PaperUnit, toUnit: PaperUnit) {
  return number * unitRelations[numberUnit][toUnit];
}
