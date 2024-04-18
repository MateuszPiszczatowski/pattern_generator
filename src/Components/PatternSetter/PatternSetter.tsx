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
    <div>
      <h2 className={css.Header}>Current pattern: {currentPattern}</h2>
      <button
        className={css.Button}
        onClick={() => {
          setModalChildren([
            <PatternsBrowser
              setImageConfig={setImageConfig}
              setPattern={setCurrentPatter}
              setModalChildren={setModalChildren}
              setIsModalEnabled={setIsModalEnabled}
            />,
          ]);
          setIsModalEnabled(true);
        }}>
        Change pattern
      </button>
    </div>
  );
}

interface IPatternSetterProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}
