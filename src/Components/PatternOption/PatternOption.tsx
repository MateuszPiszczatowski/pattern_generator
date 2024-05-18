import { ReactNode } from "react";
import { IImageConfig, IPatternConfigurator } from "../../utils/interfaces-n-types";
import PatternForm from "../PatternForm/PatternForm";
import css from "./PatternOption.module.scss";

// A component representing a pattern that is possible to be chosen. It's a button with a name and image of the pattern that sets adequate PatternForm
export default function PatternOption({
  patternConfigurator,
  setFormElement,
  setImageConfig,
  setPattern,
}: IPatternOptionProps) {
  return (
    <button
      onClick={() => {
        setPattern(patternConfigurator.title);
        setFormElement(
          <PatternForm patternConfigurator={patternConfigurator} setImageConfig={setImageConfig} />
        );
      }}>
      <figure className={css.Figure}>
        <img src={patternConfigurator.picture} className={css.Image}></img>
        <figcaption>{patternConfigurator.title}</figcaption>
      </figure>
    </button>
  );
}

interface IPatternOptionProps {
  patternConfigurator: IPatternConfigurator;
  setFormElement: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
}
