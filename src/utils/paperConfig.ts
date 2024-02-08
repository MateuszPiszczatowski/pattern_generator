export type paperMeassure = "mm" | "cm" | "in";

export class PaperConfig implements paperConfig {
  public readonly margin: paperMargin;
  constructor(
    public readonly meassure: paperMeassure,
    public readonly width: number,
    public readonly height: number,
    margin?: paperMargin
  ) {
    if (margin) {
      if (margin.top + margin.bottom < height && margin.left + margin.right < width) {
        this.margin = margin;
      } else this.margin = this.getDefaultMargin();
    } else this.margin = this.getDefaultMargin();
  }

  private getDefaultMargin(): paperMargin {
    return {
      top: this.height * 0.1,
      bottom: this.height * 0.1,
      right: this.width * 0.1,
      left: this.width * 0.1,
    };
  }
}

export interface paperMargin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface paperConfig {
  meassure: paperMeassure;
  width: number;
  height: number;
  margin: paperMargin;
}

export const DefaultSizes = {
  a4: new PaperConfig("mm", 210, 297),
  a3: new PaperConfig("mm", 297, 420),
  a0: new PaperConfig("mm", 841, 1189),
  letter: new PaperConfig("in", 8.5, 11),
  legal: new PaperConfig("in", 8.5, 14),
  tabloid: new PaperConfig("in", 11, 17),
};
