import CircleSkirtPattern from "../SewingPatterns/CircleSkirt";
import CircleSkirtConfigurator from "./CircleSkirtConfigurator";
import BaseConfigurator from "./BaseConfigurator";
import picture from "../assets/testwide.svg";
class exampleConfigurator extends BaseConfigurator {
  public readonly title = "Example Pattern";
  public readonly picture = picture;
  public readonly positions = {
    "example-position1": { message: "Example position 1", default: 0 },
    "example-position2": { message: "Example position 2", default: 0 },
  };

  public readonly selects = { "example-select1": { message: "Example select", default: false } };
  public getPattern() {
    return new CircleSkirtPattern(
      { degrees: 360, lineWidth: 0.1, skirtLength: 80, waist: 80 },
      { isHalved: true, shouldRepeat: false }
    );
  }
}
export default [new CircleSkirtConfigurator(), new exampleConfigurator()];
