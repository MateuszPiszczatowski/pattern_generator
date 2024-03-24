import { IPatternConfigurator, ISewingPatter } from "../utils/interfaces-n-types";
export default abstract class BaseConfigurator implements IPatternConfigurator {
  public abstract readonly title: string;
  public abstract readonly picture: string;
  public abstract readonly positions: string[];
  public abstract readonly selects: string[];
  public abstract getPattern(): ISewingPatter;

  protected readonly positionsValues: { [key: string]: number } = {};
  protected readonly selectsValues: { [key: string]: boolean } = {};
  public setPosition(name: string, value: number) {
    if (this.positions.includes(name)) {
      this.positionsValues[name] = value;
    } else throw new Error(`position ${name} is not present in the positions array`);
  }
  public setSelect(name: string, value: boolean) {
    if (this.selects.includes(name)) {
      this.selectsValues[name] = value;
    } else throw new Error(`select ${name} is not present in the positions array`);
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
}
