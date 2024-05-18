import { PaperUnit, units } from "../../utils/interfaces-n-types";
import { nanoid } from "nanoid";

// A component that is being used to set unit in multiple places
export default function LabeledUnitSelect({ style, defaultUnit }: ILabeledUnitSelectProps) {
  // Check if default value hest been set, and if not, set it to 'cm'
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
