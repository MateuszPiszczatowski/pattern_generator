export default function LabeledUnitSelect() {
  return (
    <label htmlFor="unit">
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
