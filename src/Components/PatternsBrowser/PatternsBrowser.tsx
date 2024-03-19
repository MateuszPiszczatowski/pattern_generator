import CircleSkirtPattern from "../../SewingPatterns/CircleSkirt";
//import testImage from "../../assets/testsingle.svg";
import { IImageConfig } from "../../utils/interfaces-n-types";
export default function PatternsBrowser({ setImageConfig, setPattern }: IPatternsBrowserProps) {
  const pattern: CircleSkirtPattern = new CircleSkirtPattern({
    waist: 80,
    length: 80,
    degrees: 780,
  });
  return (
    <button
      onClick={() => {
        setImageConfig({
          height: pattern.getHeight(),
          width: pattern.getWidth(),
          unit: "mm",
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
