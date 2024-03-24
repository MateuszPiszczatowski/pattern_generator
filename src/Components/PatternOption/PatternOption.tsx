import { ReactNode } from "react";
import { IImageConfig, IPatternConfigurator } from "../../utils/interfaces-n-types";
import PatternForm from "../PatterForm/PatterForm";

export default function PatternOption({
  patternConfigurator,
  setModalChildren,
  setImageConfig,
  setPattern,
  setIsModalEnabled,
}: IPatternOptionProps) {
  return (
    <button
      onClick={() =>
        setModalChildren(
          <PatternForm
            patternConfigurator={patternConfigurator}
            setModalChildren={setModalChildren}
            setImageConfig={setImageConfig}
            setPattern={setPattern}
            setIsModalEnabled={setIsModalEnabled}
          />
        )
      }>
      <figure>
        <img src={patternConfigurator.picture}></img>
        <figcaption>{patternConfigurator.title}</figcaption>
      </figure>
    </button>
  );
}

interface IPatternOptionProps {
  patternConfigurator: IPatternConfigurator;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
