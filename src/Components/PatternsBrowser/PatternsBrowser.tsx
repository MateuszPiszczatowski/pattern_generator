import testImage from "../../assets/testsingle.svg";
import { IImageConfig } from "../../utils/interfaces-n-types";
export default function PatternsBrowser({ setImageConfig, setPattern }: IPatternsBrowserProps) {
  return (
    <button
      onClick={() => {
        setImageConfig({
          height: 297,
          width: 210,
          unit: "mm",
          source: testImage,
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
