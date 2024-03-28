import { MutableRefObject, useEffect, useRef } from "react";
import { IWidthAndHeight } from "../../utils/interfaces-n-types";
import { IPaperConfig, IMargin } from "../../utils/interfaces-n-types";

interface ICanvasPageProps {
  paperConfig: IPaperConfig;
  imageSource: CanvasImageSource;
  imageDrawPosition: { x: number; y: number };
  imageDrawSizes: IWidthAndHeight;
  marginInPixels: IMargin;
  canvasDrawSizes: IWidthAndHeight;
  pageCount: number;
}

export default function CanvasPage({
  paperConfig,
  imageSource,
  imageDrawSizes,
  imageDrawPosition,
  marginInPixels,
  canvasDrawSizes,
  pageCount,
}: ICanvasPageProps) {
  const canvasRef: MutableRefObject<null | HTMLCanvasElement> = useRef(null);
  useEffect(() => {
    function printPageNumber(canvasContext: CanvasRenderingContext2D) {
      console.log(pageCount);
      canvasContext;
    }
    function printCorners(canvasContext: CanvasRenderingContext2D) {
      console.log("should print corners");
      canvasContext;
    } // TODO: Implement helping corners}
    function printBorders(canvasContext: CanvasRenderingContext2D) {
      const width = canvasDrawSizes.width;
      const height = canvasDrawSizes.height;
      const blockSize = (width < height ? width : height) * 0.02;
      canvasContext.fillStyle = "rgba(0 0 0 / 30%)";
      canvasContext.fillRect(marginInPixels.left, marginInPixels.top, blockSize, blockSize);
      canvasContext.fillRect(
        marginInPixels.left + canvasDrawSizes.width - blockSize,
        marginInPixels.top,
        blockSize,
        blockSize
      );
      canvasContext.fillRect(
        marginInPixels.left,
        marginInPixels.top + canvasDrawSizes.height - blockSize,
        blockSize,
        blockSize
      );
      canvasContext.fillRect(
        marginInPixels.left + canvasDrawSizes.width - blockSize,
        marginInPixels.top + canvasDrawSizes.height - blockSize,
        blockSize,
        blockSize
      );
      const widthRest =
        ((width / blockSize -
          Math.floor(width / blockSize) +
          (Math.floor(width / blockSize) % 2 === 0 ? 1 : 0)) /
          2) *
        blockSize;
      for (let i = 1; i < width / blockSize - 2; i += 2) {
        canvasContext.fillRect(
          widthRest + i * blockSize + marginInPixels.left,
          marginInPixels.top,
          blockSize,
          blockSize
        );
        canvasContext.fillRect(
          widthRest + i * blockSize + marginInPixels.left,
          canvasDrawSizes.height + marginInPixels.top - blockSize,
          blockSize,
          blockSize
        );
      }
      const heightRest =
        ((height / blockSize -
          Math.floor(height / blockSize) +
          (Math.floor(height / blockSize) % 2 === 0 ? 1 : 0)) /
          2) *
        blockSize;
      for (let i = 1; i < height / blockSize - 2; i += 2) {
        canvasContext.fillRect(
          marginInPixels.left,
          heightRest + i * blockSize + marginInPixels.top,
          blockSize,
          blockSize
        );
        canvasContext.fillRect(
          canvasDrawSizes.width + marginInPixels.left - blockSize,
          heightRest + i * blockSize + marginInPixels.top,
          blockSize,
          blockSize
        );
      }
    }
    const canvasPage = canvasRef.current!;
    canvasPage.width = canvasDrawSizes.width + marginInPixels.left + marginInPixels.right;
    canvasPage.height = canvasDrawSizes.height + marginInPixels.top + marginInPixels.bottom;
    canvasPage.style.width = `${paperConfig.width}${paperConfig.unit}`;
    canvasPage.style.height = `${paperConfig.height}${paperConfig.unit}`;
    const context = canvasPage.getContext("2d");
    if (context) {
      context.drawImage(
        imageSource,
        imageDrawPosition.x,
        imageDrawPosition.y,
        imageDrawSizes.width,
        imageDrawSizes.height,
        marginInPixels.left,
        marginInPixels.top,
        canvasDrawSizes.width,
        canvasDrawSizes.height
      );
      if (paperConfig.helpingBorders) {
        printBorders(context);
      }
      if (paperConfig.helpingCorners) {
        printCorners(context);
      }
      if (paperConfig.pagesCounter) {
        printPageNumber(context);
      }
    }
  }, [
    canvasDrawSizes.height,
    canvasDrawSizes.width,
    imageDrawPosition.x,
    imageDrawPosition.y,
    imageDrawSizes.height,
    imageDrawSizes.width,
    imageSource,
    marginInPixels.bottom,
    marginInPixels.left,
    marginInPixels.right,
    marginInPixels.top,
    pageCount,
    paperConfig.height,
    paperConfig.helpingBorders,
    paperConfig.helpingCorners,
    paperConfig.pagesCounter,
    paperConfig.unit,
    paperConfig.width,
  ]);
  return <canvas ref={canvasRef}></canvas>;
}
