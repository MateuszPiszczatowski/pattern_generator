import CircleSkirtPattern from "../SewingPatterns/CircleSkirt";
import BaseConfigurator from "./BaseConfigurator";
export default class CircleSkirtConfigurator extends BaseConfigurator {
  public readonly title = "Circle Skirt";
  public readonly picture = "";
  public readonly positions: {
    [key: string]: { message: string; default: number; value?: number };
  } = {
    skirtLength: { message: "Length of the skirt", default: 100 },
    waist: { message: "Waist circumference", default: 80 },
    degrees: { message: "Circle's degrees", default: 540 },
    lineWidth: { message: "Pattern's drawing line width", default: 0.1 },
  };
  public readonly selects: {
    [key: string]: { message: string; default: boolean; value?: boolean };
  } = {
    isHalved: {
      message: "Should symetric elemnts be halved?",
      default: true,
    },
    shouldRepeat: {
      message:
        "Should print each repeating element (disable to only show how many elements should be cutted out)",
      default: false,
    },
  };

  getPattern() {
    if (this.isReady())
      return new CircleSkirtPattern(
        {
          degrees: this.positions.degrees.value!,
          lineWidth: this.positions.lineWidth.value!,
          skirtLength: this.positions.skirtLength.value!,
          waist: this.positions.waist.value!,
        },
        { isHalved: this.selects.isHalved.value!, shouldRepeat: this.selects.shouldRepeat.value! }
      );
    throw new Error("Configuration is not ready!");
  }
  public override isReady() {
    let result = super.isReady();
    if (result) {
      Object.keys(this.positions).forEach((position) => {
        if (this.positions[position].value! <= 0 || Number.isNaN(this.positions[position].value)) {
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
    Object.keys(this.positions).forEach((position) => {
      if ("value" in this.positions[position]) {
        if (this.positions[position].value! <= 0) {
          positionsWithTooLowValues.push(position);
        }
        if (Number.isNaN(this.positions[position].value)) {
          positionsWithNaNs.push(position);
        }
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
