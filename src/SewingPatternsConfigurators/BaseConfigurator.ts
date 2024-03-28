import { IPatternConfigurator, ISewingPatter } from "../utils/interfaces-n-types";
export default abstract class BaseConfigurator implements IPatternConfigurator {
  public abstract readonly title: string;
  public abstract readonly picture: string;
  public abstract readonly positions: {
    [key: string]: { message: string; default: number; value?: number };
  };
  public abstract readonly selects: {
    [key: string]: { message: string; default: boolean; value?: boolean };
  };
  public abstract getPattern(): ISewingPatter;

  public setPosition(name: string, value: number) {
    if (Object.keys(this.positions).includes(name)) {
      this.positions[name].value = value;
    } else throw new Error(`position ${name} is not present in the positions array`);
  }
  public setSelect(name: string, value: boolean) {
    if (Object.keys(this.selects).includes(name)) {
      this.selects[name].value = value;
    } else throw new Error(`select ${name} is not present in the positions array`);
  }
  private lackingElems(dictWithValues: { [key: string]: { value?: number | boolean } }) {
    const lacking: string[] = [];
    Object.keys(dictWithValues).forEach((pos) => {
      if (!("value" in dictWithValues[pos])) lacking.push(pos);
    });
    return lacking;
  }
  public lackingPositions() {
    return this.lackingElems(this.positions);
  }
  public lackingSelects() {
    return this.lackingElems(this.selects);
  }
  public isReady() {
    return this.lackingPositions().length === 0 && this.lackingSelects().length === 0;
  }
  public getUnreadyMessages() {
    const messages: string[] = [];
    if (this.lackingPositions().length > 0) {
      let lackingPositionsMessage = "There are positions, that are lacking:";
      this.lackingPositions().forEach((position) => {
        lackingPositionsMessage += ` ${position},`;
      });
      messages.push(lackingPositionsMessage);
    }
    if (this.lackingSelects().length > 0) {
      let lackingSelectsMessage = "There are options, that are lacking:";
      this.lackingSelects().forEach((select) => {
        lackingSelectsMessage += ` ${select},`;
      });
      messages.push(lackingSelectsMessage);
    }
    return messages;
  }

  public reset() {
    Object.keys(this.positions).forEach((position) => delete this.positions[position].value);
    Object.keys(this.selects).forEach((select) => delete this.selects[select].value);
  }
}
