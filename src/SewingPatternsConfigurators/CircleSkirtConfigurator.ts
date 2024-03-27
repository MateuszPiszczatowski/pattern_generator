import CircleSkirtPattern from "../SewingPatterns/CircleSkirt";
import BaseConfigurator from "./BaseConfigurator";
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
  public override isReady() {
    let result = super.isReady();
    if (result) {
      this.positions.forEach((position) => {
        if (this.positionsValues[position] <= 0 || Number.isNaN(this.positionsValues[position])) {
          result = false;
        }
      });
      return result;
    }
    return false;
  }

  public override getUnreadyMessages() {
    const messages = super.getUnreadyMessages();
    const positionsWithTooLowValues: string[] = [];
    const positionsWithNaNs: string[] = [];
    this.positions.forEach((position) => {
      if (this.positionsValues[position] <= 0) {
        positionsWithTooLowValues.push(position);
      }
      if (Number.isNaN(this.positionsValues[position])) {
        positionsWithNaNs.push(position);
      }
    });
    if (positionsWithTooLowValues.length > 0) {
      let tooLowValuesMessage =
        "All of these positions must be set to higher than 0 but currently they are not:";
      positionsWithTooLowValues.forEach((position) => {
        tooLowValuesMessage += ` ${position},`;
      });
      messages.push(tooLowValuesMessage);
    }
    if (positionsWithNaNs.length > 0) {
      let naNsMessage = `All these positions have been set to something that can't be converted to numbers:`;
      positionsWithNaNs.forEach((position) => {
        naNsMessage += ` ${position},`;
      });
      messages.push(naNsMessage);
    }
    return messages;
  }
}
