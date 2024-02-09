import * as paperUtils from "../../utils/paperUtils";
import * as imageUtils from "../../utils/imageConfig";
import { MutableRefObject, useEffect, useRef } from "react";

function getImageSizesInPaperUnits(
  imageConfig: imageUtils.IImageConfig,
  paperConfig: paperUtils.IPaperConfig
): { width: number; height: number } {
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

function getCanvasPages(
  imageConfig: imageUtils.IImageConfig,
  paperConfig: paperUtils.IPaperConfig
): { rows: number; cols: number } {
  const { width: imageWidthInPaperUnits, height: imageHeightInPaperUnits } =
    getImageSizesInPaperUnits(imageConfig, paperConfig);
  const widthPerPage = paperConfig.width - (paperConfig.margin.left + paperConfig.margin.right);
  const heightPerPage = paperConfig.height - (paperConfig.margin.top + paperConfig.margin.bottom);
  let pagesColsCount = imageWidthInPaperUnits / widthPerPage;
  pagesColsCount =
    pagesColsCount > Math.round(pagesColsCount)
      ? Math.round(pagesColsCount) + 1
      : Math.round(pagesColsCount);
  let pagesRowsCount = imageHeightInPaperUnits / heightPerPage;
  pagesRowsCount =
    pagesRowsCount > Math.round(pagesRowsCount)
      ? Math.round(pagesRowsCount) + 1
      : Math.round(pagesRowsCount);
  return { rows: pagesRowsCount, cols: pagesColsCount };
}

const PrintSplitter = ({ imageConfig, paperConfig }: PrintSplitterProps) => {
  const imageRef: MutableRefObject<null | HTMLImageElement> = useRef(null);
  const divRef: MutableRefObject<null | HTMLDivElement> = useRef(null);
  const canvasSizingHelper: MutableRefObject<null | HTMLDivElement> = useRef(null);
  useEffect(() => {
    const { cols, rows } = getCanvasPages(imageConfig, paperConfig);
    const imageElem = imageRef.current!;
    const divElem = divRef.current!;
    const canvasSizingHelperElem = canvasSizingHelper.current!;
    imageElem.onload = () => {
      console.log({ naturals: { width: imageElem.naturalWidth, height: imageElem.naturalHeight } });
      console.log({ elem: { width: imageElem.width, height: imageElem.height } });
      const canvasPageWidth = canvasSizingHelperElem.offsetWidth;
      const canvasPageHeight = canvasSizingHelperElem.offsetHeight;
      const marginsInPixels = {
        top: (paperConfig.margin.top / paperConfig.height) * canvasPageHeight,
        right: (paperConfig.margin.right / paperConfig.width) * canvasPageWidth,
        bottom: (paperConfig.margin.bottom / paperConfig.height) * canvasPageHeight,
        left: (paperConfig.margin.left / paperConfig.width) * canvasPageWidth,
      };
      const canvasDrawWidth = canvasPageWidth - (marginsInPixels.left + marginsInPixels.right);
      const canvasDrawHeight = canvasPageHeight - (marginsInPixels.top + marginsInPixels.bottom);
      const imageDrawWidth = (canvasDrawWidth * imageElem.naturalWidth) / imageElem.width;
      const imageDrawHeight = canvasDrawHeight * (imageElem.naturalHeight / imageElem.height);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const canvasPage = document.createElement("canvas");
          canvasPage.width = canvasPageWidth;
          canvasPage.height = canvasPageHeight;
          canvasPage.style.width = `${paperConfig.width}${paperConfig.unit}`;
          canvasPage.style.height = `${paperConfig.height}${paperConfig.unit}`;
          divElem.appendChild(canvasPage);
          const context = canvasPage.getContext("2d");
          if (context) {
            context.drawImage(
              imageElem,
              imageDrawWidth * col,
              imageDrawHeight * row,
              imageDrawWidth,
              imageDrawHeight,
              marginsInPixels.left,
              marginsInPixels.top,
              canvasDrawWidth,
              canvasDrawHeight
            );
          }
        }
      }
      imageElem.hidden = true;
      canvasSizingHelperElem.hidden = true;
    };
    imageElem.src = imageConfig.source;
  }, [imageConfig, paperConfig, divRef, imageRef]);
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
      <div ref={divRef} id="print-splitter" style={{ border: "1px solid black" }}></div>
    </>
  );
};

interface PrintSplitterProps {
  imageConfig: imageUtils.IImageConfig;
  paperConfig: paperUtils.IPaperConfig;
}

export default PrintSplitter;
