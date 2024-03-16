import { toRadians } from "../utils/geometry";
const spacingSizeFactor = 0.05;
const sizesFactor = 100;

export default class CircleSkirtPattern {
  positions = ["length", "waist", "degrees"];
  private positionsValues = {
    skirtLength: 0,
    waist: 0,
    degrees: 0,
  };
  private readonly waistRadius;
  private readonly fullRadius;
  private readonly width;
  private readonly height;
  private readonly fullCirclesCount;
  private readonly spacing;
  private readonly partialAngle;
  constructor(length: number, waist: number, degrees: number) {
    this.positionsValues.skirtLength = length * sizesFactor;
    this.positionsValues.waist = waist * sizesFactor;
    this.positionsValues.degrees = degrees;
    this.fullCirclesCount = Math.floor(degrees / 360);
    this.partialAngle = this.getPartialAngle();
    this.waistRadius = this.getWaistRadius();
    this.fullRadius = this.waistRadius + this.positionsValues.skirtLength;
    this.spacing = spacingSizeFactor * this.fullRadius;
    this.width = this.calcWidth();
    this.height = this.calcHeight();
  }

  public getWidth() {
    return this.width / sizesFactor;
  }
  public getHeight() {
    return this.height / sizesFactor;
  }

  private getWaistRadius() {
    return (
      this.positionsValues.waist /
      (this.fullCirclesCount + (this.partialAngle > 0 ? this.partialAngle / 360 : 0)) /
      2 /
      Math.PI
    );
  }

  private calcHeight() {
    return (
      this.fullCirclesCount * this.fullRadius * 2 +
      this.fullCirclesCount * this.spacing * 2 +
      (this.partialAngle > 0 ? this.getPartialCircleHeight() + this.spacing * 2 : 0)
    );
  }

  private calcWidth() {
    const angle = this.partialAngle;
    const radius = this.fullRadius;
    if (this.fullCirclesCount > 0 || angle >= 180) return radius * 2 + this.spacing * 2;
    if (angle <= 90) {
      return radius + this.spacing * 2;
    }
    return radius + Math.cos(toRadians(360 - angle)) * radius + this.spacing * 2;
  }

  private getPartialAngle() {
    return this.positionsValues.degrees - this.fullCirclesCount * 360;
  }

  private getPartialCircleHeight(forOuterCircle = true) {
    const radius = forOuterCircle ? this.fullRadius : this.waistRadius;
    const angle = this.partialAngle;
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
    elem.setAttribute("stroke-width", `${0.02 * this.waistRadius}`);
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
    return 2 * (this.spacing + this.fullRadius) * counter + this.spacing;
  }

  private getInnerCircle(counter: number) {
    return this.getSvgCircle(
      this.fullRadius + this.spacing,
      this.fullRadius + this.getYAxisMod(counter),
      this.waistRadius
    );
  }

  private getOuterCircle(counter: number) {
    return this.getSvgCircle(
      this.fullRadius + this.spacing,
      this.fullRadius + this.getYAxisMod(counter),
      this.fullRadius
    );
  }

  private underNinetyPath() {
    console.log(this);
    const yAxisMod = this.getYAxisMod(this.fullCirclesCount);
    const angle = this.partialAngle;
    const endPointOuter = [this.spacing, yAxisMod];
    const startPointOuter = [
      this.fullRadius - Math.cos(toRadians(angle)) * this.fullRadius + this.spacing,
      Math.sin(toRadians(angle)) * this.fullRadius + yAxisMod,
    ];
    const startPointInner = [this.fullRadius - this.waistRadius + this.spacing, yAxisMod];
    const endPointInner = [
      this.fullRadius - Math.cos(toRadians(angle)) * this.waistRadius + this.spacing,
      Math.sin(toRadians(angle)) * this.waistRadius + yAxisMod,
    ];
    const innerArc = `A${this.waistRadius} ${this.waistRadius} 0 0 0 ${endPointInner[0]} ${endPointInner[1]}`;
    const arm = `L${startPointOuter[0]} ${startPointOuter[1]}`;
    const outerArc = `A${this.fullRadius} ${this.fullRadius} 0 0 1 ${endPointOuter[0]} ${endPointOuter[1]}`;
    return `M${startPointInner[0]} ${startPointInner[1]} ${innerArc} ${arm} ${outerArc} Z`;
  }

  private ninetyPath() {
    return "";
  }

  private ninetyToOneEightyPath() {
    return "";
  }

  private oneEightyPath() {
    return "";
  }

  private overOneEightyPath() {
    return "";
  }

  private pathFunctionSelectorAndCaller() {
    const angle = this.partialAngle;
    if (angle < 90) {
      return this.underNinetyPath();
    }
    if (angle === 90) {
      return this.ninetyPath();
    }
    if (angle < 180) {
      return this.ninetyToOneEightyPath();
    }
    if (angle === 180) {
      return this.oneEightyPath();
    }
    return this.overOneEightyPath();
  }

  private getCircleSectorPart() {
    const circleSectorPart = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const path = this.pathFunctionSelectorAndCaller();
    circleSectorPart.setAttribute("d", path);
    this.setSvgElemFillAndStroke(circleSectorPart);
    return circleSectorPart;
  }

  public getDataUrl() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", `${this.width}`);
    svg.setAttribute("height", `${this.height}`);
    for (let i = 0; i < this.fullCirclesCount; i++) {
      svg.appendChild(this.getInnerCircle(i));
      svg.appendChild(this.getOuterCircle(i));
    }
    svg.appendChild(this.getCircleSectorPart());
    const svgString = new XMLSerializer().serializeToString(svg);
    const dataUrl = "data:image/svg+xml," + encodeURIComponent(svgString);
    return dataUrl;
  }
}
