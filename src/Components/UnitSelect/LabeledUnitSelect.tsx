import { PaperUnit, units } from "../../utils/interfaces-n-types";
import { nanoid } from "nanoid";

export default function LabeledUnitSelect({ style, defaultUnit }: ILabeledUnitSelectProps) {
  function getDefaultValue() {
    return defaultUnit && units.includes(defaultUnit) ? defaultUnit : "cm";
  }
  return (
    <label htmlFor="unit" className={style}>
      Unit:{" "}
      <select name="unit" defaultValue={getDefaultValue()} key={nanoid()}>
        {units.map((unit) => (
          <option value={unit} key={nanoid()}>
            {unit}
          </option>
        ))}
      </select>
    </label>
  );
}

interface ILabeledUnitSelectProps {
  style?: string;
  defaultUnit?: PaperUnit;
}
