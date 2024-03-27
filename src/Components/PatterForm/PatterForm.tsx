import { FormEvent, ReactNode } from "react";
import { IImageConfig, IPatternConfigurator, PaperUnit } from "../../utils/interfaces-n-types";
import PatternsBrowser from "../PatternsBrowser/PatternsBrowser";
import LabeledUnitSelect from "../UnitSelect/LabeledUnitSelect";

export default function PatternForm({
  patternConfigurator,
  setModalChildren,
  setImageConfig,
  setPattern,
  setIsModalEnabled,
}: IPatternFormProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const positions: { [key: string]: number } = {};
    const selects: { [key: string]: boolean } = {};
    patternConfigurator.positions.forEach((position) => {
      const element = e.currentTarget.elements.namedItem(position) as HTMLInputElement | null;
      if (element) {
        positions[position] = Number(element.value);
      }
    });
    patternConfigurator.selects.forEach((select) => {
      const element = e.currentTarget.elements.namedItem(select) as HTMLInputElement | null;
      if (element) {
        selects[select] = element.checked;
      }
    });
    Object.keys(positions).forEach((key) => patternConfigurator.setPosition(key, positions[key]));
    Object.keys(selects).forEach((key) => patternConfigurator.setSelect(key, selects[key]));
    if (patternConfigurator.isReady()) {
      setPattern(patternConfigurator.title);
      const pattern = patternConfigurator.getPattern();
      setImageConfig({
        height: pattern.getHeight(),
        width: pattern.getWidth(),
        source: pattern.getDataUrl(),
        unit: (e.currentTarget.elements.namedItem("unit") as HTMLInputElement).value as PaperUnit,
      });
      setModalChildren(<></>);
      setIsModalEnabled(false);
      return;
    } else {
      window.alert("".concat(...patternConfigurator.getUnreadyMessages())); // TODO generate detailed info in configurator
      console.log("".concat(...patternConfigurator.getUnreadyMessages()));
    }
    patternConfigurator.reset();
  }
  return (
    <>
      <button
        onClick={() =>
          setModalChildren(
            <PatternsBrowser
              setImageConfig={setImageConfig}
              setIsModalEnabled={setIsModalEnabled}
              setModalChildren={setModalChildren}
              setPattern={setPattern}
            />
          )
        }>
        Back to pattern browser
      </button>
      <form onSubmit={onSubmit}>
        <LabeledUnitSelect />
        {...patternConfigurator.positions.map((position) => {
          return (
            <label htmlFor={position}>
              {position[0].toUpperCase().concat(position.slice(1), " ")}:
              <input type="number" min={0} name={position} />
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
    </>
  );
}

interface IPatternFormProps {
  patternConfigurator: IPatternConfigurator;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
