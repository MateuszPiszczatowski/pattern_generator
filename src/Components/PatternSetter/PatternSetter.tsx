import { ReactNode, useState } from "react";
import PatternsBrowser from "../PatternsBrowser/PatternsBrowser";
import { IImageConfig } from "../../utils/interfaces-n-types";

export default function PatternSetter({
  setImageConfig,
  setIsModalEnabled,
  setModalChildren,
}: IPatternSetterProps) {
  const [currentPattern, setCurrentPatter] = useState("");
  return (
    <section>
      <h6>Current pattern: {currentPattern}</h6>
      <button
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
    </section>
  );
}

interface IPatternSetterProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}
