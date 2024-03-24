import { ReactNode } from "react";
import CircleSkirtPattern from "../../SewingPatterns/CircleSkirt";
import CircleSkirtConfigurator from "../../SewingPatternsConfigurators/CircleSkirtConfigurator";
import patternsConfiguratorsList from "../../SewingPatternsConfigurators/patternsConfiguratorsList";
import { IImageConfig } from "../../utils/interfaces-n-types";
import PatternOption from "../PatternOption/PatternOption";
export default function PatternsBrowser({
  setImageConfig,
  setPattern,
  setModalChildren,
  setIsModalEnabled,
}: IPatternsBrowserProps) {
  const patternConfig = new CircleSkirtConfigurator();
  patternConfig.setPosition("waist", 80);
  patternConfig.setPosition("skirtLength", 80);
  patternConfig.setPosition("degrees", 780);
  patternConfig.setPosition("lineWidth", 0.1);
  patternConfig.setSelect("isHalved", true);
  patternConfig.setSelect("shouldRepeat", false);

  const pattern: CircleSkirtPattern = patternConfig.getPattern();
  return (
    <div>
      {...patternsConfiguratorsList.map((configurator) => (
        <PatternOption
          patternConfigurator={configurator}
          setModalChildren={setModalChildren}
          setIsModalEnabled={setIsModalEnabled}
          setImageConfig={setImageConfig}
          setPattern={setPattern}
        />
      ))}
      <button
        onClick={() => {
          setImageConfig({
            height: pattern.getHeight(),
            width: pattern.getWidth(),
            unit: "cm",
            source: pattern.getDataUrl(),
          });
          setPattern("Test");
        }}>
        Set to default
      </button>
    </div>
  );
}

interface IPatternsBrowserProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
