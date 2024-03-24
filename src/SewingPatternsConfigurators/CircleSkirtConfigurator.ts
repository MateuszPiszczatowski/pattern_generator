import CircleSkirtPattern from "../SewingPatterns/CircleSkirt";
import BaseConfigurator from "./baseConfigurator";
import picture from "../assets/testsingle.svg";
export default class CircleSkirtConfigurator extends BaseConfigurator {
  public readonly title = "Circle Skirt";
  public readonly picture = picture;
  public readonly positions = ["skirtLength", "waist", "degrees", "lineWidth"];
  public readonly selects = ["isHalved", "shouldRepeat"];
  getPattern() {
    if (this.isReady())
      return new CircleSkirtPattern(
        {
          degrees: this.positionsValues.degrees,
          lineWidth: this.positionsValues.lineWidth,
          skirtLength: this.positionsValues.skirtLength,
          waist: this.positionsValues.skirtLength,
        },
        { isHalved: this.selectsValues.isHalved, shouldRepeat: this.selectsValues.shouldRepeat }
      );
    throw new Error("Configuration is not ready!");
  }
}
