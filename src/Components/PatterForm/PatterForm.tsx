import { FormEvent, ReactNode } from "react";
import { IImageConfig, IPatternConfigurator } from "../../utils/interfaces-n-types";

export default function PatternForm({
  patternConfigurator,
  setModalChildren,
  setImageConfig,
  setPattern,
  setIsModalEnabled,
}: IPatternFormProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(e.currentTarget.elements);
  }
  return (
    <form onSubmit={onSubmit}>
      {...patternConfigurator.positions.map((position) => {
        return (
          <label htmlFor={position}>
            {position[0].toUpperCase().concat(position.slice(1), " ")}:
            <input type="number" name={position} />
          </label>
        );
      })}
      {...patternConfigurator.selects.map((select) => {
        return (
          <label htmlFor={select}>
            {select}:
            <input type="checkbox" name={select} />
          </label>
        );
      })}
      <input type="submit" value="Save pattern" />
    </form>
  );
}

interface IPatternFormProps {
  patternConfigurator: IPatternConfigurator;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
