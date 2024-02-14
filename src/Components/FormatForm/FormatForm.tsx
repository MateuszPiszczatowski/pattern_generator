export default function FormatForm() {
  return (
    <form>
      <label htmlFor="unit">
        Unit:{" "}
        <select name="unit">
          {["in", "cm", "mm"].map((unit) => (
            <option value={unit} />
          ))}
        </select>
      </label>
      <label htmlFor="width">
        Width: <input name="width" type="number" />
      </label>
      <label htmlFor="height">
        Height: <input name="height" type="nubmer" />
      </label>
      <h6>Margins:</h6>
      <section>
        <label htmlFor="top">
          Top: <input name="top" type="number" />
        </label>
        <label htmlFor="right">
          Right: <input name="right" type="number" />
        </label>
        <label htmlFor="bottom">
          Bottom: <input name="bottom" type="number" />
        </label>
        <label htmlFor="left">
          Left: <input name="left" type="number" />
        </label>
      </section>
    </form>
  );
}
