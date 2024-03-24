import CircleSkirtPattern from "../SewingPatterns/CircleSkirt";
import { IPatternConfigurator } from "../utils/interfaces-n-types";

export default class CircleSkirtConfigurator implements IPatternConfigurator {
  public readonly positions = ["skirtLength", "waist", "degrees", "lineWidth"];
  public readonly selects = ["isHalved", "shouldRepeat"];
  private readonly positionsValues: { [key: string]: number } = {};
  private readonly selectsValues: { [key: string]: boolean } = {};

  public setPosition(name: string, value: number) {
    if (this.positions.includes(name)) {
      this.positionsValues[name] = value;
    } else throw new Error(`position ${name} not present in the positions array`);
  }
  public setSelect(name: string, value: boolean) {
    if (this.selects.includes(name)) {
      this.selectsValues[name] = value;
    } else throw new Error(`select ${name} not present in the positions array`);
  }

  private lackingElems(elemArray: string[], searchedObject: { [key: string]: number | boolean }) {
    const lacking: string[] = [];
    const present = Object.keys(searchedObject);
    elemArray.forEach((pos) => {
      if (!(pos in present)) lacking.push(pos);
    });
    return lacking;
  }
  public lackingPositions() {
    return this.lackingElems(this.positions, this.positionsValues);
  }
  public lackingSelects() {
    return this.lackingElems(this.selects, this.selectsValues);
  }
  public isReady() {
    return this.lackingPositions.length === 0 && this.lackingSelects.length === 0;
  }
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
