import { PaperUnit } from "../../utils/interfaces-n-types";

export default function LabeledUnitSelect({ style, defaultUnit }: ILabeledUnitSelectProps) {
  const units = ["in", "cm", "mm"];
  console.log(defaultUnit);
  console.log(defaultUnit && units.includes(defaultUnit));
  return (
    <label htmlFor="unit" className={style}>
      Unit:{" "}
      <select
        name="unit"
        defaultValue={defaultUnit && units.includes(defaultUnit) ? defaultUnit : "cm"}>
        {units.map((unit) => (
          <option value={unit} key={unit} selected={unit === defaultUnit}>
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
