import { ReactNode } from "react";
import patternsConfiguratorsList from "../../SewingPatternsConfigurators/patternsConfiguratorsList";
import { IImageConfig } from "../../utils/interfaces-n-types";
import PatternOption from "../PatternOption/PatternOption";
import css from "./PatternBrowser.module.scss";

export default function PatternsBrowser({
  setImageConfig,
  setPattern,
  setModalChildren,
  setIsModalEnabled,
}: IPatternsBrowserProps) {
  return (
    <div className={css.Container}>
      {...patternsConfiguratorsList.map((configurator) => (
        <PatternOption
          patternConfigurator={configurator}
          setModalChildren={setModalChildren}
          setIsModalEnabled={setIsModalEnabled}
          setImageConfig={setImageConfig}
          setPattern={setPattern}
        />
      ))}
    </div>
  );
}

interface IPatternsBrowserProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
