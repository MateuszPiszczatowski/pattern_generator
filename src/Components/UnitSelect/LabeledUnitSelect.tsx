export default function LabeledUnitSelect({ style }: ILabeledUnitSelectProps) {
  return (
    <label htmlFor="unit" className={style}>
      Unit:{" "}
      <select name="unit" defaultValue="cm">
        {["in", "cm", "mm"].map((unit) => (
          <option value={unit} key={unit}>
            {unit}
          </option>
        ))}
      </select>
    </label>
  );
}

interface ILabeledUnitSelectProps {
  style?: string;
}
