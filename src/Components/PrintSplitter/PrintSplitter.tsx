import * as paperUtils from "../../utils/paperUtils";
import { IImageConfig, IPaperConfig, IMargin } from "../../utils/interfaces-n-types";
import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import CanvasPage from "../CanvasPage/CanvasPage";
import { IWidthAndHeight } from "../../utils/interfaces-n-types";

function getImageSizesInPaperUnits(
  imageConfig: IImageConfig,
  paperConfig: IPaperConfig
): IWidthAndHeight {
  const imageWidthInPaperUnits = paperUtils.changeUnit(
    imageConfig.width,
    imageConfig.unit,
    paperConfig.unit
  );
  const imageHeightInPaperUnits = paperUtils.changeUnit(
    imageConfig.height,
    imageConfig.unit,
    paperConfig.unit
  );
  return { width: imageWidthInPaperUnits, height: imageHeightInPaperUnits };
}

function getCanvasRowsCount(paperHeightWithoutMargin: number, imageHeight: number): number {
  let rowsCount = imageHeight / paperHeightWithoutMargin;
  rowsCount = rowsCount > Math.round(rowsCount) ? Math.round(rowsCount) + 1 : Math.round(rowsCount);
  return rowsCount;
}

function getCanvasColsCount(paperWidthWithoutMargin: number, imageWidth: number): number {
  let colsCount = imageWidth / paperWidthWithoutMargin;
  colsCount = colsCount > Math.round(colsCount) ? Math.round(colsCount) + 1 : Math.round(colsCount);
  return colsCount;
}

function getCanvasPages(
  imageConfig: IImageConfig,
  paperConfig: IPaperConfig
): { rows: number; cols: number } {
  const { width: imageWidthInPaperUnits, height: imageHeightInPaperUnits } =
    getImageSizesInPaperUnits(imageConfig, paperConfig);
  const { width: drawWidth, height: drawHeight } = getCanvasDrawSizes(paperConfig);
  const pagesColsCount = getCanvasColsCount(drawWidth, imageWidthInPaperUnits);
  const pagesRowsCount = getCanvasRowsCount(drawHeight, imageHeightInPaperUnits);
  return { rows: pagesRowsCount, cols: pagesColsCount };
}

function getCanvasDrawWidth(height: number, margin: IMargin): number {
  return height - (margin.left + margin.right);
}

function getCanvasDrawHeight(width: number, margin: IMargin): number {
  return width - (margin.top + margin.bottom);
}

function getCanvasDrawSizes(canvasConfig: {
  width: number;
  height: number;
  margin: IMargin;
}): IWidthAndHeight {
  return {
    width: getCanvasDrawWidth(canvasConfig.width, canvasConfig.margin),
    height: getCanvasDrawHeight(canvasConfig.height, canvasConfig.margin),
  };
}

function extractCanvasPxSizes(sourceElem: HTMLDivElement): IWidthAndHeight {
  return { width: sourceElem.offsetWidth, height: sourceElem.offsetHeight };
}

function getMarginInPx(paperConfig: IPaperConfig, canvasPxSizes: IWidthAndHeight): IMargin {
  return {
    top: (paperConfig.margin.top / paperConfig.height) * canvasPxSizes.height,
    right: (paperConfig.margin.right / paperConfig.width) * canvasPxSizes.width,
    bottom: (paperConfig.margin.bottom / paperConfig.height) * canvasPxSizes.height,
    left: (paperConfig.margin.left / paperConfig.width) * canvasPxSizes.width,
  };
}

function getImageDrawSizes(
  canvasDrawSizes: IWidthAndHeight,
  imageElem: HTMLImageElement
): IWidthAndHeight {
  return {
    width: canvasDrawSizes.width * (imageElem.naturalWidth / imageElem.width),
    height: canvasDrawSizes.height * (imageElem.naturalHeight / imageElem.height),
  };
}

function onImageLoad(
  canvasHelper: HTMLDivElement,
  paperConfig: IPaperConfig,
  imageElem: HTMLImageElement,
  cols: number,
  rows: number,
  setPagesState: Dispatch<SetStateAction<ReactNode[]>>
): void {
  const canvasPxSizes = extractCanvasPxSizes(canvasHelper);
  const marginInPixels = getMarginInPx(paperConfig, canvasPxSizes);
  const canvasDrawSizes = getCanvasDrawSizes({
    ...canvasPxSizes,
    margin: marginInPixels,
  });
  const imageDrawSizes = getImageDrawSizes(canvasDrawSizes, imageElem);
  const canvases: JSX.Element[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      canvases.push(
        <CanvasPage
          {...{
            paperConfig,
            imageSource: imageElem,
            imageDrawSizes,
            imageDrawPosition: { x: imageDrawSizes.width * col, y: imageDrawSizes.height * row },
            marginInPixels,
            canvasDrawSizes,
          }}
        />
      );
      setPagesState(canvases);
    }
  }
}

const PrintSplitter = ({ imageConfig, paperConfig }: IPrintSplitterProps) => {
  const [pages, setPages] = useState([] as ReactNode[]);
  const imageRef: MutableRefObject<null | HTMLImageElement> = useRef(null);
  const canvasSizingHelper: MutableRefObject<null | HTMLDivElement> = useRef(null);
  useEffect(() => {
    const { cols, rows } = getCanvasPages(imageConfig, paperConfig);
    const imageElem = imageRef.current!;
    const canvasSizingHelperElem = canvasSizingHelper.current!;
    imageElem.onload = () => {
      onImageLoad(canvasSizingHelperElem, paperConfig, imageElem, cols, rows, setPages);
    };
    imageElem.src = imageConfig.source;
  }, [imageConfig, paperConfig]);
  return (
    <>
      <div
        ref={canvasSizingHelper}
        style={{
          position: "absolute",
          left: `-${paperConfig.width}${paperConfig.unit}`,
          width: `${paperConfig.width}${paperConfig.unit}`,
          height: `${paperConfig.height}${paperConfig.unit}`,
        }}
      />
      <img
        ref={imageRef}
        style={{
          position: "absolute",
          left: `-${imageConfig.width}${imageConfig.unit}`,
          width: `${imageConfig.width}${imageConfig.unit}`,
          height: `${imageConfig.height}${imageConfig.unit}`,
        }}></img>
      <article style={{ border: "1px solid black" }}>{...pages}</article>
    </>
  );
};

interface IPrintSplitterProps {
  imageConfig: IImageConfig;
  paperConfig: IPaperConfig;
}

export default PrintSplitter;
