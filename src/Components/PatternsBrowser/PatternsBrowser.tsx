import CircleSkirtPattern from "../../SewingPatterns/CircleSkirt";
import CircleSkirtConfigurator from "../../SewingPatternsConfigurators/CircleSkirtConfigurator";
//import testImage from "../../assets/testsingle.svg";
import { IImageConfig } from "../../utils/interfaces-n-types";
export default function PatternsBrowser({ setImageConfig, setPattern }: IPatternsBrowserProps) {
  const patternConfig = new CircleSkirtConfigurator();
  patternConfig.setPosition("waist", 80);
  patternConfig.setPosition("skirtLength", 80);
  patternConfig.setPosition("degrees", 780);
  patternConfig.setPosition("lineWidth", 0.1);
  patternConfig.setSelect("isHalved", true);
  patternConfig.setSelect("shouldRepeat", false);

  const pattern: CircleSkirtPattern = patternConfig.getPattern();
  return (
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
  );
}

interface IPatternsBrowserProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setPattern: React.Dispatch<React.SetStateAction<string>>;
}
