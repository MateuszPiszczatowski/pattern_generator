import { toRadians } from "../utils/geometry";
import { nanoid } from "nanoid";
import { ISewingPatter } from "../utils/interfaces-n-types";
const spacingSizeFactor = 0.05;
const sizesFactor = 100;

export default class CircleSkirtPattern implements ISewingPatter {
  private readonly skirtLength;
  private readonly waist;
  private readonly degrees;
  private readonly svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  private readonly waistRadius;
  private readonly fullRadius;
  private readonly width;
  private readonly height;
  private readonly fullCirclesCount;
  private readonly spacing;
  private readonly partialAngle;
  private readonly isHalved;
  private readonly shouldRepeat;
  private readonly lineWidth;
  constructor(
    {
      skirtLength,
      waist,
      degrees,
      lineWidth,
    }: { skirtLength: number; waist: number; degrees: number; lineWidth: number },
    { isHalved, shouldRepeat }: { isHalved: boolean; shouldRepeat: boolean } = {
      isHalved: true,
      shouldRepeat: false,
    }
  ) {
    this.lineWidth = lineWidth;
    this.skirtLength = skirtLength * sizesFactor;
    this.waist = waist * sizesFactor;
    this.degrees = degrees;
    this.isHalved = isHalved;
    this.shouldRepeat = shouldRepeat;
    this.fullCirclesCount = Math.floor(degrees / 360);
    this.partialAngle = this.getPartialAngle();
    this.waistRadius = this.getWaistRadius();
    this.fullRadius = this.waistRadius + this.skirtLength;
    this.spacing = spacingSizeFactor * this.fullRadius;
    this.width = this.calcWidth();
    this.height = this.calcHeight();
    this.svg.setAttribute("width", `${this.width}`);
    this.svg.setAttribute("height", `${this.height}`);
    this.appendFullCircles();
    this.appendPartial(
      this.getYAxisMod(
        this.shouldRepeat ? this.fullCirclesCount : Math.min(1, this.fullCirclesCount)
      )
    );
  }

  public getWidth() {
    return this.width / sizesFactor;
  }
  public getHeight() {
    return this.height / sizesFactor;
  }

  private getWaistRadius() {
    return (
      this.waist /
      (this.fullCirclesCount + (this.partialAngle > 0 ? this.partialAngle / 360 : 0)) /
      2 /
      Math.PI
    );
  }

  private calcHeight() {
    const fullCirclesCount = this.shouldRepeat
      ? this.fullCirclesCount
      : Math.min(this.fullCirclesCount, 1);
    return (
      fullCirclesCount * this.fullRadius * (this.isHalved ? 1 : 2) +
      fullCirclesCount * this.spacing * 2 +
      (this.partialAngle > 0 ? this.getPartialCircleHeight() + this.spacing * 2 : 0)
    );
  }

  private calcWidth() {
    const angle = this.partialAngle * (this.isHalved ? 0.5 : 1);
    const radius = this.fullRadius;
    if (this.fullCirclesCount > 0 || angle >= 180) return radius * 2 + this.spacing * 2;
    if (angle <= 90) return radius + this.spacing * 2;
    return radius + Math.cos(toRadians(180 - angle)) * radius + this.spacing * 2;
  }

  private getPartialAngle() {
    return this.degrees - this.fullCirclesCount * 360;
  }

  private getPartialCircleHeight(considerHalving = true) {
    const radius = this.fullRadius;
    const angle = this.partialAngle * (considerHalving && this.isHalved ? 0.5 : 1);
    if (angle < 90) {
      const height = radius * Math.sin(toRadians(angle)); // the circle sector will lay horizontaly, in a way that one of the arms will be paralel to the horizontal axis, and the second arm lower. As far as I know, this should be the shortest way possible to place the object. The height is calculated using trigonometry.
      return height;
    }
    if (angle <= 180) {
      return radius; // for angles from 90 to 180 the shortest height is the radius
    }
    return radius + radius * Math.cos(toRadians((360 - angle) / 2)); // for angles over 180 degrees, the section is placed in a way that arms of the section are from the center to bottom, equally distant from the vertical axis of the circle. This should allow for the lowest height possible.
  }

  private setSvgElemFillAndStroke(elem: SVGElement) {
    elem.setAttribute("fill", "transparent");
    elem.setAttribute("stroke", "black");
    elem.setAttribute("stroke-width", `${this.lineWidth * sizesFactor}`);
  }

  private getSvgCircle(x: number, y: number, radius: number) {
    const svgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    svgCircle.setAttribute("cx", `${x}`);
    svgCircle.setAttribute("cy", `${y}`);
    svgCircle.setAttribute("r", `${radius}`);
    this.setSvgElemFillAndStroke(svgCircle);
    return svgCircle;
  }

  private getYAxisMod(counter: number) {
    return (2 * this.spacing + (this.isHalved ? 1 : 2) * this.fullRadius) * counter + this.spacing;
  }

  private getInnerCircle(yAxisMod: number) {
    return this.getSvgCircle(
      this.fullRadius + this.spacing,
      this.fullRadius + yAxisMod,
      this.waistRadius
    );
  }

  private getOuterCircle(yAxisMod: number) {
    return this.getSvgCircle(
      this.fullRadius + this.spacing,
      this.fullRadius + yAxisMod,
      this.fullRadius
    );
  }

  private arcPath(
    startPointInner: number[],
    endPointInner: number[],
    startPointOuter: number[],
    endPointOuter: number[],
    isSectionOverOneEighty = false
  ) {
    const innerArc = `A${this.waistRadius} ${this.waistRadius} 0 ${
      isSectionOverOneEighty ? 1 : 0
    } ${isSectionOverOneEighty ? 1 : 0} ${endPointInner[0]} ${endPointInner[1]}`;
    const arm = `L${startPointOuter[0]} ${startPointOuter[1]}`;
    const outerArc = `A${this.fullRadius} ${this.fullRadius} 0 ${isSectionOverOneEighty ? 1 : 0} ${
      isSectionOverOneEighty ? 0 : 1
    } ${endPointOuter[0]} ${endPointOuter[1]}`;
    return `M${startPointInner[0]} ${startPointInner[1]} ${innerArc} ${arm} ${outerArc} Z`;
  }

  private underNinetyPath(angle: number, yAxisMod: number) {
    const startPointInner = [this.fullRadius - this.waistRadius + this.spacing, yAxisMod];
    const endPointInner = [
      this.fullRadius - Math.cos(toRadians(angle)) * this.waistRadius + this.spacing,
      Math.sin(toRadians(angle)) * this.waistRadius + yAxisMod,
    ];
    const startPointOuter = [
      this.fullRadius - Math.cos(toRadians(angle)) * this.fullRadius + this.spacing,
      Math.sin(toRadians(angle)) * this.fullRadius + yAxisMod,
    ];
    const endPointOuter = [this.spacing, yAxisMod];
    return this.arcPath(startPointInner, endPointInner, startPointOuter, endPointOuter);
  }

  private ninetyPath(yAxisMod: number) {
    const startPointInner = [this.fullRadius - this.waistRadius + this.spacing, yAxisMod];
    const endPointInner = [this.fullRadius + this.spacing, this.waistRadius + yAxisMod];
    const startPointOuter = [this.fullRadius + this.spacing, this.fullRadius + yAxisMod];
    const endPointOuter = [this.spacing, yAxisMod];
    return this.arcPath(startPointInner, endPointInner, startPointOuter, endPointOuter);
  }

  private ninetyToOneEightyPath(angle: number, yAxisMod: number) {
    const startPointInner = [this.fullRadius - this.waistRadius + this.spacing, yAxisMod];
    const endPointInner = [
      this.fullRadius + Math.cos(toRadians(180 - angle)) * this.waistRadius + this.spacing,
      Math.sin(toRadians(180 - angle)) * this.waistRadius + yAxisMod,
    ];
    const startPointOuter = [
      this.fullRadius + Math.cos(toRadians(180 - angle)) * this.fullRadius + this.spacing,
      Math.sin(toRadians(180 - angle)) * this.fullRadius + yAxisMod,
    ];
    const endPointOuter = [this.spacing, yAxisMod];
    return this.arcPath(startPointInner, endPointInner, startPointOuter, endPointOuter);
  }

  private oneEightyPath(yAxisMod: number) {
    const startPointInner = [this.fullRadius - this.waistRadius + this.spacing, yAxisMod];
    const endPointInner = [this.fullRadius + this.spacing + this.waistRadius, yAxisMod];
    const startPointOuter = [2 * this.fullRadius + this.spacing, yAxisMod];
    const endPointOuter = [this.spacing, yAxisMod];
    return this.arcPath(startPointInner, endPointInner, startPointOuter, endPointOuter);
  }

  private overOneEightyPath(angle: number, yAxisMod: number) {
    const innerYCoord =
      Math.cos(toRadians((360 - angle) / 2)) * this.waistRadius + yAxisMod + this.fullRadius;
    const startPointInner = [
      this.fullRadius - Math.sin(toRadians((360 - angle) / 2)) * this.waistRadius + this.spacing,
      innerYCoord,
    ];
    const endPointInner = [
      this.fullRadius + Math.sin(toRadians((360 - angle) / 2)) * this.waistRadius + this.spacing,
      innerYCoord,
    ];

    const outerYCoord =
      Math.cos(toRadians((360 - angle) / 2)) * this.fullRadius + yAxisMod + this.fullRadius;
    const startPointOuter = [
      this.fullRadius + Math.sin(toRadians((360 - angle) / 2)) * this.fullRadius + this.spacing,
      outerYCoord,
    ];
    const endPointOuter = [
      this.fullRadius - Math.sin(toRadians((360 - angle) / 2)) * this.fullRadius + this.spacing,
      outerYCoord,
    ];
    return this.arcPath(startPointInner, endPointInner, startPointOuter, endPointOuter, true);
  }

  private pathFunctionSelectorAndCaller(angle: number, yAxisMod: number) {
    if (angle < 90) {
      return this.underNinetyPath(angle, yAxisMod);
    }
    if (angle === 90) {
      return this.ninetyPath(yAxisMod);
    }
    if (angle < 180) {
      return this.ninetyToOneEightyPath(angle, yAxisMod);
    }
    if (angle === 180) {
      return this.oneEightyPath(yAxisMod);
    }
    return this.overOneEightyPath(angle, yAxisMod);
  }

  private getHalfSignature(angle: number, yAxisMod: number) {
    const textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const textPathElem = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
    textElem.appendChild(textPathElem);
    const helperPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    helperPath.setAttribute("fill", "transparent");
    helperPath.setAttribute("stroke", "transparent");
    const height = Math.min(
      2 * this.spacing,
      0.3 * this.fullRadius * Math.tan(toRadians(Math.min(90, angle)))
    ); // height is sized by putting a rectangle of 0.6 radius horizontal sides into the sector, 0.1 of the radius offset from the left border, and calculating the max length of the vertical sides, but not bigger than double the space between the circles. It ensures that the text is contained within the sector but doesn't get unreasonably high.
    const yPoint = yAxisMod + height;
    const xPoints = [this.spacing, this.skirtLength];
    helperPath.setAttribute("d", `M${xPoints[0]} ${yPoint} L${xPoints[1]} ${yPoint}`);
    helperPath.setAttribute("id", nanoid());
    textElem.setAttribute("font-size", `${height}`);
    textPathElem.textContent = "Fold in half";
    textPathElem.setAttribute("href", "#" + helperPath.getAttribute("id")!);
    textPathElem.setAttribute("textLength", `${this.skirtLength * 0.6}`);
    textPathElem.setAttribute("startOffset", `${this.skirtLength * 0.1}`);
    return [helperPath, textElem];
  }

  private getCircleSectorPart(angle: number, yAxisMod: number) {
    const circleSectorPart = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const path = this.pathFunctionSelectorAndCaller(angle, yAxisMod);
    circleSectorPart.setAttribute("d", path);
    this.setSvgElemFillAndStroke(circleSectorPart);
    if (this.isHalved) {
      const halfSignature = this.getHalfSignature(angle, yAxisMod);
      return [...halfSignature, circleSectorPart];
    }
    return [circleSectorPart];
  }

  private getMultiplicatorSign() {
    const textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElem.textContent = `${this.fullCirclesCount}x`;
    textElem.setAttribute("font-size", `${this.fullRadius / 3}`);
    textElem.setAttribute("x", `${this.fullRadius - this.spacing * 2}`);
    textElem.setAttribute("y", `${this.getYAxisMod(1) * 0.55}`);
    return textElem;
  }

  private appendFullCircles() {
    const svg = this.svg;
    const isHalved = this.isHalved;
    const count = this.shouldRepeat ? this.fullCirclesCount : Math.min(1, this.fullCirclesCount);
    if (isHalved) {
      for (let i = 0; i < count; i++) {
        svg.append(...this.getCircleSectorPart(180, this.getYAxisMod(i)));
      }
      if (!this.shouldRepeat && this.fullCirclesCount > 1) {
        svg.appendChild(this.getMultiplicatorSign());
      }
    } else {
      for (let i = 0; i < count; i++) {
        svg.appendChild(this.getInnerCircle(this.getYAxisMod(i)));
        svg.appendChild(this.getOuterCircle(this.getYAxisMod(i)));
      }
      if (!this.shouldRepeat && this.fullCirclesCount > 1) {
        svg.appendChild(this.getMultiplicatorSign());
      }
    }
  }

  private appendPartial(yAxisMod: number) {
    const svg = this.svg;
    if (this.partialAngle > 0) {
      svg.append(
        ...this.getCircleSectorPart(this.partialAngle * (this.isHalved ? 0.5 : 1), yAxisMod)
      );
    }
  }

  public getDataUrl() {
    const svgString = new XMLSerializer().serializeToString(this.svg);
    const dataUrl = "data:image/svg+xml," + encodeURIComponent(svgString);
    return dataUrl;
  }
}
