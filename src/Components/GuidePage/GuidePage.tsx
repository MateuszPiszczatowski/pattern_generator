import { IImageConfig, IPaperConfig } from "../../utils/interfaces-n-types";
import { PaperConfig, getIImageSizesInIPaperUnits } from "../../utils/paperUtils";
import PrintSplitter from "../PrintSplitter/PrintSplitter";

// Component that shows the whole splitted pattern on a one page (a preview)
export default function GuidePage({ paperConfig, imageConfig }: IGuidePageProps) {
  const imageSizesInPaperUnits = getIImageSizesInIPaperUnits(imageConfig, paperConfig);
  const drawingHeight = paperConfig.height - (paperConfig.margin.top + paperConfig.margin.bottom);
  const drawingWidth = paperConfig.width - paperConfig.margin.left - paperConfig.margin.right;
  // Ratio if the page is not rotated
  const flatRatio = Math.max(
    (Math.ceil(imageSizesInPaperUnits.height / drawingHeight) * paperConfig.height) / drawingHeight,
    (Math.ceil(imageSizesInPaperUnits.width / drawingWidth) * paperConfig.width) / drawingWidth
  );
  // Ratio if the page is rotated
  const rotatedRatio = Math.max(
    (Math.ceil(imageSizesInPaperUnits.height / drawingHeight) * paperConfig.height) / drawingWidth,
    (Math.ceil(imageSizesInPaperUnits.width / drawingWidth) * paperConfig.width) / drawingHeight
  );
  // Rotate if rotation allows for generating a bigger preview
  const shouldRotate = rotatedRatio < flatRatio;

  const ratio = shouldRotate ? rotatedRatio : flatRatio;

  // Margins divided by ratio
  const adjustedMargin = {
    top: paperConfig.margin.top / ratio,
    bottom: paperConfig.margin.bottom / ratio,
    left: paperConfig.margin.left / ratio,
    right: paperConfig.margin.right / ratio,
  };

  // Image sizes divided by ratio
  const adjustedImageConfig = {
    height: imageConfig.height / ratio,
    width: imageConfig.width / ratio,
    unit: imageConfig.unit,
    source: imageConfig.source,
  } as IImageConfig;

  // Paper sizes divided by ratio
  const adjustedPaperConfig = new PaperConfig(
    paperConfig.unit,
    paperConfig.width / ratio!,
    paperConfig.height / ratio!,
    paperConfig.helpingBorders,
    paperConfig.helpingCorners,
    paperConfig.pagesCounter,
    adjustedMargin
  ) as IPaperConfig;

  return (
    <div
      style={{
        display: "flex",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center",
        width: `${paperConfig.width}${paperConfig.unit}`,
        height: `${paperConfig.height}${paperConfig.unit}`,
        padding: `${paperConfig.margin.top}${paperConfig.unit} 
        ${paperConfig.margin.right}${paperConfig.unit} 
        ${paperConfig.margin.bottom}${paperConfig.unit} 
        ${paperConfig.margin.left}${paperConfig.unit}`,
      }}>
      <div
        style={{
          rotate: shouldRotate ? "90deg" : "0deg",
        }}>
        <PrintSplitter
          imageConfig={adjustedImageConfig!}
          paperConfig={adjustedPaperConfig!}
          printGuidePage={false}
          printSizesHelper={false}
          helperView={true}
        />
      </div>
    </div>
  );
}

interface IGuidePageProps {
  paperConfig: IPaperConfig;
  imageConfig: IImageConfig;
}
