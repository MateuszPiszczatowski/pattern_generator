import * as paperUtils from "../../utils/paperUtils";
import * as imageUtils from "../../utils/imageConfig";
import { MutableRefObject, useEffect, useRef } from "react";

interface IWidthAndHeight {
  width: number;
  height: number;
}

function getImageSizesInPaperUnits(
  imageConfig: imageUtils.IImageConfig,
  paperConfig: paperUtils.IPaperConfig
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
  imageConfig: imageUtils.IImageConfig,
  paperConfig: paperUtils.IPaperConfig
): { rows: number; cols: number } {
  const { width: imageWidthInPaperUnits, height: imageHeightInPaperUnits } =
    getImageSizesInPaperUnits(imageConfig, paperConfig);
  const { width: drawWidth, height: drawHeight } = getCanvasDrawSizes(paperConfig);
  const pagesColsCount = getCanvasColsCount(drawWidth, imageWidthInPaperUnits);
  const pagesRowsCount = getCanvasRowsCount(drawHeight, imageHeightInPaperUnits);
  return { rows: pagesRowsCount, cols: pagesColsCount };
}

function getCanvasDrawWidth(height: number, margin: paperUtils.IPaperMargin): number {
  return height - (margin.left + margin.right);
}

function getCanvasDrawHeight(width: number, margin: paperUtils.IPaperMargin): number {
  return width - (margin.top + margin.bottom);
}

function getCanvasDrawSizes(canvasConfig: {
  width: number;
  height: number;
  margin: paperUtils.IPaperMargin;
}): IWidthAndHeight {
  return {
    width: getCanvasDrawWidth(canvasConfig.width, canvasConfig.margin),
    height: getCanvasDrawHeight(canvasConfig.height, canvasConfig.margin),
  };
}

function extractCanvasPxSizes(sourceElem: HTMLDivElement): IWidthAndHeight {
  return { width: sourceElem.offsetWidth, height: sourceElem.offsetHeight };
}

function getMarginInPx(
  paperConfig: paperUtils.IPaperConfig,
  canvasPxSizes: IWidthAndHeight
): paperUtils.IPaperMargin {
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
  canvasParent: HTMLDivElement,
  paperConfig: paperUtils.IPaperConfig,
  imageElem: HTMLImageElement,
  cols: number,
  rows: number
): void {
  const canvasPxSizes = extractCanvasPxSizes(canvasHelper);
  const marginInPixels = getMarginInPx(paperConfig, canvasPxSizes);
  const canvasDrawSizes = getCanvasDrawSizes({
    ...canvasPxSizes,
    margin: marginInPixels,
  });
  const imageDrawSizes = getImageDrawSizes(canvasDrawSizes, imageElem);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const canvasPage = document.createElement("canvas");
      canvasPage.width = canvasPxSizes.width;
      canvasPage.height = canvasPxSizes.height;
      canvasPage.style.width = `${paperConfig.width}${paperConfig.unit}`;
      canvasPage.style.height = `${paperConfig.height}${paperConfig.unit}`;
      canvasParent.appendChild(canvasPage);
      const context = canvasPage.getContext("2d");
      if (context) {
        context.drawImage(
          imageElem,
          imageDrawSizes.width * col,
          imageDrawSizes.height * row,
          imageDrawSizes.width,
          imageDrawSizes.height,
          marginInPixels.left,
          marginInPixels.top,
          canvasDrawSizes.width,
          canvasDrawSizes.height
        );
      }
    }
  }
  imageElem.hidden = true;
  canvasHelper.hidden = true;
}

const PrintSplitter = ({ imageConfig, paperConfig }: PrintSplitterProps) => {
  const imageRef: MutableRefObject<null | HTMLImageElement> = useRef(null);
  const canvasParentRef: MutableRefObject<null | HTMLDivElement> = useRef(null);
  const canvasSizingHelper: MutableRefObject<null | HTMLDivElement> = useRef(null);
  useEffect(() => {
    const { cols, rows } = getCanvasPages(imageConfig, paperConfig);
    const imageElem = imageRef.current!;
    const canvasParentElem = canvasParentRef.current!;
    const canvasSizingHelperElem = canvasSizingHelper.current!;
    imageElem.onload = () => {
      onImageLoad(canvasSizingHelperElem, canvasParentElem, paperConfig, imageElem, cols, rows);
    };
    imageElem.src = imageConfig.source;
  }, [imageConfig, paperConfig]);
  return (
    <>
      <div
        ref={canvasSizingHelper}
        style={{
          width: `${paperConfig.width}${paperConfig.unit}`,
          height: `${paperConfig.height}${paperConfig.unit}`,
        }}
      />
      <img
        ref={imageRef}
        id="print-splitter-hidden-img"
        style={{
          width: `${imageConfig.width}${imageConfig.unit}`,
          height: `${imageConfig.height}${imageConfig.unit}`,
        }}></img>
      <div ref={canvasParentRef} id="print-splitter" style={{ border: "1px solid black" }}></div>
    </>
  );
};

interface PrintSplitterProps {
  imageConfig: imageUtils.IImageConfig;
  paperConfig: paperUtils.IPaperConfig;
}

export default PrintSplitter;
