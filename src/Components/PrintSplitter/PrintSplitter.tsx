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
import GuidePage from "../GuidePage/GuidePage";
import { nanoid } from "nanoid";
import SizesHelper from "../SizesHelper/SizesHelper";

// Get width of the space that can be drawn on
function getCanvasDrawWidth(height: number, margin: IMargin): number {
  return height - (margin.left + margin.right);
}

// Get height of the space that can be drawn on
function getCanvasDrawHeight(width: number, margin: IMargin): number {
  return width - (margin.top + margin.bottom);
}

// Get width and height of the space that can be drawn on
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

// Get how many pages are needed for one dimension
function getCanvasCountForOneDimension(paperDrawSize: number, imageSize: number): number {
  const count = imageSize / paperDrawSize;
  const roundedCount = Math.ceil(count);
  return roundedCount;
}

// Get how many pages are needed to show the image in rows and cols
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

/* Get the size of the canvas in pixels from the source element. It's really just taking size from an element,
 * but it's named that way so it is easy to understand what it's for, when reading the code where it's used. */
function extractCanvasPxSizes(sourceElem: HTMLDivElement): IWidthAndHeight {
  return { width: sourceElem.offsetWidth, height: sourceElem.offsetHeight };
}

// Convert margin sizes to pixels
function getMarginInPx(paperConfig: IPaperConfig, canvasPxSizes: IWidthAndHeight): IMargin {
  return {
    top: (paperConfig.margin.top / paperConfig.height) * canvasPxSizes.height,
    right: (paperConfig.margin.right / paperConfig.width) * canvasPxSizes.width,
    bottom: (paperConfig.margin.bottom / paperConfig.height) * canvasPxSizes.height,
    left: (paperConfig.margin.left / paperConfig.width) * canvasPxSizes.width,
  };
}

// Get the sizes to traverse when interating over the picture
function getImageDrawSizes(
  canvasDrawSizes: IWidthAndHeight,
  imageElem: HTMLImageElement
): IWidthAndHeight {
  return {
    width: canvasDrawSizes.width * (imageElem.naturalWidth / imageElem.width),
    height: canvasDrawSizes.height * (imageElem.naturalHeight / imageElem.height),
  };
}

// On Load event handler
function onImageLoad(
  canvasHelper: HTMLDivElement,
  paperConfig: IPaperConfig,
  imageElem: HTMLImageElement,
  cols: number,
  rows: number,
  setPagesState: Dispatch<SetStateAction<ReactNode[]>>,
  helpingPage?: JSX.Element,
  sizingPage?: JSX.Element
): void {
  // Get sizes in pixels
  const canvasPxSizes = extractCanvasPxSizes(canvasHelper);
  const marginInPixels = getMarginInPx(paperConfig, canvasPxSizes);
  // Get draw sizes
  const canvasDrawSizes = getCanvasDrawSizes({
    ...canvasPxSizes,
    margin: marginInPixels,
  });
  const imageDrawSizes = getImageDrawSizes(canvasDrawSizes, imageElem);
  // An array for all the pages
  const pages: JSX.Element[] = [];
  // If sizing page should be printed, push apropiate element to the array of pages
  if (sizingPage) {
    pages.push(sizingPage);
  }
  // If helping page should be printed, push apropiate element to the array of pages
  if (helpingPage) {
    pages.push(helpingPage);
  }
  // For all the rows and cols, add a page with part of the picture drawn
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
          key={nanoid()}
        />
      );
      setPagesState(pages);
    }
  }
}

// A component that displays an image from imageConfig splitted in a way, that it is possible to print it on a paper format described in paperConfig.
const PrintSplitter = ({
  printGuidePage,
  printSizesHelper,
  imageConfig,
  paperConfig,
  helperView,
}: IPrintSplitterProps) => {
  // State for pages
  const [pages, setPages] = useState([] as ReactNode[]);
  // Refs for image element and canvas sizing element
  const imageRef: MutableRefObject<null | HTMLImageElement> = useRef(null);
  const canvasSizingHelper: MutableRefObject<null | HTMLDivElement> = useRef(null);
  // Determine if the format should be rotated to save paper and how many cols and rows are there. Use memo to not call it unless base variables changed.
  // It was Copilot (Microsoft AI based on chatgpt) that reminded me of useMemo when I used it to help me find a reason why the component enters an infinite loop of rerendering. 
  // The mention above is to comply with Academic Honesty rules of CS50.
  const { cols, rows, paperConfigToUse } = useMemo(() => {
    // Get rows and cols for non-rotated and rotated format
    const defaultColsAndRows = getCanvasPagesCount(imageConfig, paperConfig);
    const reorientedColsAndRows = getCanvasPagesCount(
      imageConfig,
      paperConfig.getWithChangedOrientation()
    );
    let cols, rows: number;
    let paperConfigToUse: IPaperConfig;
    // Set cols and rows to these, that end in less cells, if it's rotated, rotate the paper format.
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
  // When component mounted or updated
  useEffect(() => {
    const imageElem = imageRef.current!;
    const canvasSizingHelperElem = canvasSizingHelper.current!;
    // Assign onload to the imageElem
    imageElem.addEventListener("load", function () {
      // Call the main functionality
      onImageLoad(
        canvasSizingHelperElem,
        paperConfigToUse,
        imageElem,
        cols,
        rows,
        setPages,
        printGuidePage ? (
          <GuidePage paperConfig={paperConfigToUse} imageConfig={imageConfig} key={nanoid()} />
        ) : undefined,
        printSizesHelper ? <SizesHelper paperConfig={paperConfigToUse} key={nanoid()} /> : undefined
      );
      // Hide the image element element
      imageElem.style.visibility = "hidden";
      imageElem.style.opacity = "0";
    });
    // Load the image to the element. It has to be after the onload assignment.
    imageElem.src = imageConfig.source;
  }, [cols, imageConfig, paperConfig, paperConfigToUse, printGuidePage, printSizesHelper, rows]);
  return (
    <>
      <div
        ref={canvasSizingHelper}
        style={{
          position: "absolute",
          left: `-${100 * (paperConfigToUse.width + imageConfig.width)}${paperConfigToUse.unit}`,
          width: `${paperConfigToUse.width}${paperConfigToUse.unit}`,
          height: `${paperConfigToUse.height}${paperConfigToUse.unit}`,
        }}
      />

      <img
        ref={imageRef}
        style={{
          position: "absolute",
          left: `-${100 * (imageConfig.width + paperConfigToUse.width)}${imageConfig.unit}`,
          width: `${imageConfig.width}${imageConfig.unit}`,
          height: `${imageConfig.height}${imageConfig.unit}`,
        }}></img>

      <article
        style={{
          display: "flex",
          flexDirection: helperView ? "row" : "column",
          flexWrap: helperView ? "wrap" : "nowrap",
          width: helperView ? `${1.01 * cols * paperConfigToUse.width}${paperConfig.unit}` : "100%",
        }}>
        {pages}
      </article>
    </>
  );
};

interface IPrintSplitterProps {
  printSizesHelper: boolean;
  printGuidePage: boolean;
  helperView: boolean;
  imageConfig: IImageConfig;
  paperConfig: IPaperConfig;
}

export default PrintSplitter;
