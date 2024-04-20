import { ReactNode, useState } from "react";
import PatternsBrowser from "../PatternsBrowser/PatternsBrowser";
import { IImageConfig } from "../../utils/interfaces-n-types";
import css from "./PatternSetter.module.scss";
export default function PatternSetter({
  setImageConfig,
  setIsModalEnabled,
  setModalChildren,
}: IPatternSetterProps) {
  const [currentPattern, setCurrentPatter] = useState("");
  return (
    <section>
      <h2>Pattern section</h2>
      <h3 className={css.Header}>Current pattern: {currentPattern}</h3>
      <PatternsBrowser
        setImageConfig={setImageConfig}
        setPattern={setCurrentPatter}
        setModalChildren={setModalChildren}
        setIsModalEnabled={setIsModalEnabled}></PatternsBrowser>
    </section>
  );
}

interface IPatternSetterProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}
