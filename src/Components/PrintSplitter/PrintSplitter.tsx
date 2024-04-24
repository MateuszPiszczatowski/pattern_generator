import * as paperUtils from "../../utils/paperUtils";
import { IImageConfig, IPaperConfig, IMargin } from "../../utils/interfaces-n-types";
import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CanvasPage from "../CanvasPage/CanvasPage";
import { IWidthAndHeight } from "../../utils/interfaces-n-types";
import HelpingPage from "../HelpingPage/HelpingPage";

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

function getCanvasCountForOneDimension(paperDrawSize: number, imageSize: number): number {
  const count = imageSize / paperDrawSize;
  const roundedCount = Math.round(count);
  return count > roundedCount ? roundedCount + 1 : roundedCount;
}

function getCanvasPagesCount(
  imageConfig: IImageConfig,
  paperConfig: IPaperConfig
): { rows: number; cols: number } {
  const { width: imageWidthInPaperUnits, height: imageHeightInPaperUnits } =
    paperUtils.getIImageSizesInIPaperUnits(imageConfig, paperConfig);
  const { width: drawWidth, height: drawHeight } = getCanvasDrawSizes(paperConfig);
  const pagesColsCount = getCanvasCountForOneDimension(drawWidth, imageWidthInPaperUnits);
  const pagesRowsCount = getCanvasCountForOneDimension(drawHeight, imageHeightInPaperUnits);
  return { rows: pagesRowsCount, cols: pagesColsCount };
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
  setPagesState: Dispatch<SetStateAction<ReactNode[]>>,
  helpingPage?: JSX.Element
): void {
  const canvasPxSizes = extractCanvasPxSizes(canvasHelper);
  const marginInPixels = getMarginInPx(paperConfig, canvasPxSizes);
  const canvasDrawSizes = getCanvasDrawSizes({
    ...canvasPxSizes,
    margin: marginInPixels,
  });
  const imageDrawSizes = getImageDrawSizes(canvasDrawSizes, imageElem);
  const pages: JSX.Element[] = [];
  if (helpingPage) {
    pages.push(helpingPage);
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pages.push(
        <CanvasPage
          {...{
            paperConfig,
            imageSource: imageElem,
            imageDrawSizes,
            imageDrawPosition: { x: imageDrawSizes.width * col, y: imageDrawSizes.height * row },
            marginInPixels,
            canvasDrawSizes,
            pageCount: row * cols + col + 1,
            strongBorder: {
              isBottom: row === rows - 1,
              isLeft: col === 0,
              isRight: col === cols - 1,
              isTop: row === 0,
            },
          }}
        />
      );
      setPagesState(pages);
    }
  }
}

const PrintSplitter = ({
  printGuidePage,
  printSizesTest,
  imageConfig,
  paperConfig,
  helperView,
}: IPrintSplitterProps) => {
  const [pages, setPages] = useState([] as ReactNode[]);

  const imageRef: MutableRefObject<null | HTMLImageElement> = useRef(null);
  const canvasSizingHelper: MutableRefObject<null | HTMLDivElement> = useRef(null);
  const { cols, rows, paperConfigToUse } = useMemo(() => {
    const defaultColsAndRows = getCanvasPagesCount(imageConfig, paperConfig);
    const reorientedColsAndRows = getCanvasPagesCount(
      imageConfig,
      paperConfig.getWithChangedOrientation()
    );
    let cols, rows: number;
    let paperConfigToUse: IPaperConfig;
    if (
      defaultColsAndRows.cols * defaultColsAndRows.rows <=
      reorientedColsAndRows.cols * reorientedColsAndRows.rows
    ) {
      ({ cols, rows } = defaultColsAndRows);
      paperConfigToUse = paperConfig;
    } else {
      ({ cols, rows } = reorientedColsAndRows);
      paperConfigToUse = paperConfig.getWithChangedOrientation();
    }
    return { cols, rows, paperConfigToUse };
  }, [imageConfig, paperConfig]);
  useEffect(() => {
    const imageElem = imageRef.current!;
    const canvasSizingHelperElem = canvasSizingHelper.current!;
    imageElem.onload = () => {
      onImageLoad(
        canvasSizingHelperElem,
        paperConfigToUse,
        imageElem,
        cols,
        rows,
        setPages,
        printGuidePage || printSizesTest ? (
          <HelpingPage
            paperConfig={paperConfigToUse}
            printGuidePage={printGuidePage}
            printSizesTest={printSizesTest}
            imageConfig={imageConfig}
          />
        ) : undefined
      );
    };
    imageElem.src = imageConfig.source;
  }, [cols, imageConfig, paperConfig, paperConfigToUse, printGuidePage, printSizesTest, rows]);
  return (
    <>
      <div
        ref={canvasSizingHelper}
        style={{
          position: "absolute",
          left: `-${paperConfigToUse.width}${paperConfigToUse.unit}`,
          width: `${paperConfigToUse.width}${paperConfigToUse.unit}`,
          height: `${paperConfigToUse.height}${paperConfigToUse.unit}`,
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
      <article
        style={{
          display: "flex",
          flexDirection: helperView ? "row" : "column",
          flexWrap: helperView ? "wrap" : "nowrap",
          width: helperView ? `${cols * paperConfigToUse.width}${paperConfig.unit}` : "100%",
        }}>
        {...pages}
      </article>
    </>
  );
};

interface IPrintSplitterProps {
  printSizesTest: boolean;
  printGuidePage: boolean;
  helperView: boolean;
  imageConfig: IImageConfig;
  paperConfig: IPaperConfig;
}

export default PrintSplitter;
