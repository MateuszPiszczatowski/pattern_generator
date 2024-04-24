import { PaperUnit } from "../../utils/interfaces-n-types";
import css from "./SizesHelper.module.scss";

export default function SizesHelper({
  lineSplitSize,
  lineWidth,
  lineUnit: lineUnit,
  elemWidth,
}: ISizesHelperProps) {
  return (
    <div
      className={css.Container}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "aliceblue",
        width: `${elemWidth}${lineUnit}`,
        height: `${lineWidth * 3 + lineSplitSize * 4}${lineUnit}`,
      }}>
      <p
        style={{
          height: `${lineSplitSize}${lineUnit}`,
          fontSize: `${lineSplitSize * 0.7}${lineUnit}`,
          lineHeight: `${lineSplitSize * 0.9}${lineUnit}`,
          textAlign: "end",
        }}>
        10 mm
      </p>
      <div
        style={{
          height: `${lineWidth}${lineUnit}`,
          width: "10mm",
          backgroundColor: "black",
        }}></div>
      <p
        style={{
          height: `${lineSplitSize}${lineUnit}`,
          fontSize: `${lineSplitSize * 0.7}${lineUnit}`,
          lineHeight: `${lineSplitSize * 0.9}${lineUnit}`,
          textAlign: "end",
        }}>
        {" "}
        5 cm
      </p>
      <div
        style={{
          height: `${lineWidth}${lineUnit}`,
          width: "5cm",
          backgroundColor: "black",
        }}></div>
      <p
        style={{
          height: `${lineSplitSize}${lineUnit}`,
          fontSize: `${lineSplitSize * 0.7}${lineUnit}`,
          lineHeight: `${lineSplitSize * 0.9}${lineUnit}`,
          textAlign: "end",
        }}>
        {" "}
        1 in
      </p>
      <div
        style={{
          height: `${lineWidth}${lineUnit}`,
          width: "1in",
          backgroundColor: "black",
        }}></div>
      <p></p>
    </div>
  );
}

interface ISizesHelperProps {
  elemWidth: number;
  lineSplitSize: number;
  lineWidth: number;
  lineUnit: PaperUnit;
}
