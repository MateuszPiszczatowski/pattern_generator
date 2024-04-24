import { IImageConfig, IPaperConfig, PaperUnit } from "../../utils/interfaces-n-types";
import { PaperConfig, changeUnit, getIImageSizesInIPaperUnits } from "../../utils/paperUtils";
import PrintSplitter from "../PrintSplitter/PrintSplitter";
import SizesHelper from "../SizesHelper/SizesHelper";

export default function HelpingPage({
  paperConfig,
  printGuidePage,
  printSizesTest,
  imageConfig,
}: IHelpingPageProps) {
  const imageSizesInPaperUnits = getIImageSizesInIPaperUnits(imageConfig, paperConfig);
  const drawingHeight = paperConfig.height - (paperConfig.margin.top + paperConfig.margin.bottom);
  const drawingWidth = paperConfig.width - paperConfig.margin.left - paperConfig.margin.right;
  let lineSplitSize;
  let lineWidth;
  let lineUnit;
  let unitCheck;
  let spaceForLines;
  if (printSizesTest) {
    lineSplitSize = 0.5;
    lineWidth = 0.2;
    lineUnit = "cm" as PaperUnit;
    unitCheck = paperConfig.unit === lineUnit;
    spaceForLines =
      4 * (unitCheck ? lineSplitSize : changeUnit(lineSplitSize, lineUnit, paperConfig.unit)) +
      3 * (unitCheck ? lineWidth : changeUnit(lineWidth, lineUnit, paperConfig.unit));
  }

  let multiplier;
  let adjustedMargin;
  let adjustedImageConfig;
  let adjustedPaperConfig;
  if (printGuidePage) {
    multiplier =
      1.01 *
      Math.max(
        (imageSizesInPaperUnits.height +
          Math.ceil(imageSizesInPaperUnits.height / drawingHeight) *
            (paperConfig.margin.bottom + paperConfig.margin.top)) /
          (drawingHeight - (spaceForLines ? spaceForLines : 0)),
        (imageSizesInPaperUnits.width +
          Math.ceil(imageSizesInPaperUnits.width / drawingWidth) *
            (paperConfig.margin.left + paperConfig.margin.right)) /
          drawingWidth
      );
    adjustedMargin = {
      top: paperConfig.margin.top / multiplier,
      bottom: paperConfig.margin.bottom / multiplier,
      left: paperConfig.margin.left / multiplier,
      right: paperConfig.margin.right / multiplier,
    };
    adjustedImageConfig = {
      height: imageConfig.height / multiplier,
      width: imageConfig.width / multiplier,
      unit: imageConfig.unit,
      source: imageConfig.source,
    } as IImageConfig;

    adjustedPaperConfig = new PaperConfig(
      paperConfig.unit,
      paperConfig.width / multiplier!,
      paperConfig.height / multiplier!,
      paperConfig.helpingBorders,
      paperConfig.helpingCorners,
      paperConfig.pagesCounter,
      adjustedMargin
    ) as IPaperConfig;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: `${drawingWidth}${paperConfig.unit}`,
        height: `${drawingHeight}${paperConfig.unit}`,
        padding: `${paperConfig.margin.top}${paperConfig.unit} 
        ${paperConfig.margin.right}${paperConfig.unit} 
        ${paperConfig.margin.bottom}${paperConfig.unit} 
        ${paperConfig.margin.left}${paperConfig.unit}`,
      }}>
      {printSizesTest && (
        <SizesHelper
          elemWidth={
            unitCheck ? drawingWidth : changeUnit(drawingWidth, paperConfig.unit, lineUnit!)
          }
          lineSplitSize={lineSplitSize!}
          lineWidth={lineWidth!}
          lineUnit={lineUnit!}
        />
      )}
      {printGuidePage && (
        <PrintSplitter
          imageConfig={adjustedImageConfig!}
          paperConfig={adjustedPaperConfig!}
          printGuidePage={false}
          printSizesTest={false}
          helperView={true}
        />
      )}
    </div>
  );
}

interface IHelpingPageProps {
  paperConfig: IPaperConfig;
  printGuidePage: boolean;
  printSizesTest: boolean;
  imageConfig: IImageConfig;
}
