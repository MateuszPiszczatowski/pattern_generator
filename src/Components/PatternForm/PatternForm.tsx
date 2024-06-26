import { FormEvent } from "react";
import { IImageConfig, IPatternConfigurator, PaperUnit } from "../../utils/interfaces-n-types";
import LabeledUnitSelect from "../UnitSelect/LabeledUnitSelect";
import css from "./PatternForm.module.scss";

export default function PatternForm({ patternConfigurator, setImageConfig }: IPatternFormProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const positions: { [key: string]: number } = {};
    const selects: { [key: string]: boolean } = {};
    Object.keys(patternConfigurator.positions).forEach((position) => {
      const element = e.currentTarget.elements.namedItem(position) as HTMLInputElement | null;
      if (element) {
        positions[position] = Number(element.value);
      }
    });
    Object.keys(patternConfigurator.selects).forEach((select) => {
      const element = e.currentTarget.elements.namedItem(select) as HTMLInputElement | null;
      if (element) {
        selects[select] = element.checked;
      }
    });
    Object.keys(positions).forEach((key) => patternConfigurator.setPosition(key, positions[key]));
    Object.keys(selects).forEach((key) => patternConfigurator.setSelect(key, selects[key]));
    if (patternConfigurator.isReady()) {
      const pattern = patternConfigurator.getPattern();
      setImageConfig({
        height: pattern.getHeight(),
        width: pattern.getWidth(),
        source: pattern.getDataUrl(),
        unit: (e.currentTarget.elements.namedItem("unit") as HTMLInputElement).value as PaperUnit,
      });
    } else {
      window.alert("".concat(...patternConfigurator.getUnreadyMessages()));
      console.log("".concat(...patternConfigurator.getUnreadyMessages()));
    }
    patternConfigurator.reset();
  }
  return (
    <div className={css.Container}>
      <form onSubmit={onSubmit} className={css.Form}>
        <LabeledUnitSelect style={css.Label} />
        {...Object.keys(patternConfigurator.positions).map((position) => {
          return (
            <label htmlFor={position} className={css.Label}>
              {patternConfigurator.positions[position].message}:
              <input
                className={css.TextOrNumberInput}
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={patternConfigurator.positions[position].default}
                name={position}
              />
            </label>
          );
        })}
        {...Object.keys(patternConfigurator.selects).map((select) => {
          return (
            <label htmlFor={select} className={css.Label}>
              {patternConfigurator.selects[select].message}:
              <input
                className={css.Checkbox}
                type="checkbox"
                name={select}
                defaultChecked={patternConfigurator.selects[select].default}
              />
            </label>
          );
        })}
        <input className={css.Submit} type="submit" value="Save pattern" />
      </form>
    </div>
  );
}

interface IPatternFormProps {
  patternConfigurator: IPatternConfigurator;
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
}
