export default function PatternForm({ positions }: IPatternFormProps) {
  return (
    <form>
      {positions.map((position) => {
        return (
          <label htmlFor={position}>
            {position[0].toUpperCase().concat(position.slice(1), " ")}:
            <input type="number" name={position} />
          </label>
        );
      })}
    </form>
  );
}

interface IPatternFormProps {
  positions: string[];
}
