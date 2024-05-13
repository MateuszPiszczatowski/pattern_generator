import { MutableRefObject, useEffect, useRef } from "react";
import { IWidthAndHeight } from "../../utils/interfaces-n-types";
import { IPaperConfig, IMargin } from "../../utils/interfaces-n-types";
import { toRadians } from "../../utils/geometry";

interface ICanvasPageProps {
  paperConfig: IPaperConfig;
  imageSource: CanvasImageSource;
  imageDrawPosition: { x: number; y: number };
  imageDrawSizes: IWidthAndHeight;
  marginInPixels: IMargin;
  canvasDrawSizes: IWidthAndHeight;
  pageCount: number;
  strongBorder: { isLeft?: boolean; isRight?: boolean; isTop?: boolean; isBottom?: boolean };
}

// Single canvas page of splitted pattern
export default function CanvasPage({
  paperConfig,
  imageSource,
  imageDrawSizes,
  imageDrawPosition,
  marginInPixels,
  canvasDrawSizes,
  pageCount,
  strongBorder,
}: ICanvasPageProps) {
  const canvasRef: MutableRefObject<null | HTMLCanvasElement> = useRef(null);
  useEffect(() => {
    const { width, height } = canvasDrawSizes;
    // Set the size of helping border block size to 2% of the smaller size
    const blockSize = (width < height ? width : height) * 0.02;

    function printPageNumber(canvasContext: CanvasRenderingContext2D) {
      const fontSize = (width < height ? width : height) * 0.6;
      canvasContext.font = `${fontSize}px serif`;
      canvasContext.fillStyle = "rgb(0 0 0 / 20%)";
      const textSize = canvasContext.measureText(`${pageCount}`);
      canvasContext.fillText(
        `${pageCount}`,
        marginInPixels.left + width / 2 - textSize.width / 2,
        marginInPixels.top + height / 2 + fontSize / 2.5
      );
    }

    // Print helping corners on the page
    function printCorners(canvasContext: CanvasRenderingContext2D) {
      canvasContext.strokeStyle = "rgb(0 0 0 / 20%)";
      canvasContext.lineWidth = blockSize;
      canvasContext.beginPath();
      const radius = (width < height ? width : height) * 0.05;

      // Left-up helping corner
      canvasContext.arc(marginInPixels.left, marginInPixels.top, radius, 0, toRadians(90));

      // Right-up helping corner
      canvasContext.moveTo(marginInPixels.left + width, marginInPixels.top + radius);
      canvasContext.arc(
        marginInPixels.left + width,
        marginInPixels.top,
        radius,
        toRadians(90),
        toRadians(180)
      );

      // Left-down helping corner
      canvasContext.moveTo(marginInPixels.left, marginInPixels.top + height - radius);
      canvasContext.arc(
        marginInPixels.left,
        marginInPixels.top + height,
        radius,
        toRadians(270),
        toRadians(360)
      );

      // Right-down helping corner
      canvasContext.moveTo(marginInPixels.left + width - radius, marginInPixels.top + height);
      canvasContext.arc(
        marginInPixels.left + width,
        marginInPixels.top + height,
        radius,
        toRadians(180),
        toRadians(270)
      );

      // Draw the corners
      canvasContext.stroke();
    }

    function printBorders(canvasContext: CanvasRenderingContext2D) {
      canvasContext.fillStyle = "rgba(0 0 0 / 20%)";

      /* Calculate the distance so the dashed line blocks are centered
       * The formula logic: the quotient of dividing the width/height by blocksize minus the floored quotient gives us the part of block, that's left.
       * Then, we add one if the floored quotiend of width/height is even, because the loop goes every other block, what if not for that modification would cause empty space of one block width on one side
       * Then the given number is divided by two to get the space needed for one side.
       */
      const widthRest =
        ((width / blockSize -
          Math.floor(width / blockSize) +
          (Math.floor(width / blockSize) % 2 === 0 ? 1 : 0)) /
          2) *
        blockSize;

      const heightRest =
        ((height / blockSize -
          Math.floor(height / blockSize) +
          (Math.floor(height / blockSize) % 2 === 0 ? 1 : 0)) /
          2) *
        blockSize;

      // If there is a strong (solid) border, draw it with a rectangle, if not, draw a dashed border with many rectangles.
      /* For logic in every strongBorder.isX else block
       * Start with i = 1, because corners are drawn separatedly and we don't want to draw them twice
       * Take margin and size (width/height) in consideration
       * Print every OTHER block that can be put in that space
       */
      if (strongBorder.isBottom) {
        canvasContext.fillRect(
          marginInPixels.left + blockSize,
          marginInPixels.top + height - blockSize,
          width - blockSize * 2,
          blockSize
        );
      } else {
        for (let i = 1; i < width / blockSize - 2; i += 2) {
          canvasContext.fillRect(
            widthRest + i * blockSize + marginInPixels.left,
            height + marginInPixels.top - blockSize,
            blockSize,
            blockSize
          );
        }
      }
      if (strongBorder.isLeft) {
        canvasContext.fillRect(
          marginInPixels.left,
          marginInPixels.top + blockSize,
          blockSize,
          height - blockSize * 2
        );
      } else {
        for (let i = 1; i < height / blockSize - 2; i += 2) {
          canvasContext.fillRect(
            marginInPixels.left,
            heightRest + i * blockSize + marginInPixels.top,
            blockSize,
            blockSize
          );
        }
      }

      if (strongBorder.isRight) {
        canvasContext.fillRect(
          marginInPixels.left + width - blockSize,
          marginInPixels.top + blockSize,
          blockSize,
          height - blockSize * 2
        );
      } else {
        for (let i = 1; i < height / blockSize - 2; i += 2) {
          canvasContext.fillRect(
            width + marginInPixels.left - blockSize,
            heightRest + i * blockSize + marginInPixels.top,
            blockSize,
            blockSize
          );
        }
      }
      if (strongBorder.isTop) {
        canvasContext.fillRect(
          marginInPixels.left + blockSize,
          marginInPixels.top,
          width - blockSize * 2,
          blockSize
        );
      } else {
        for (let i = 1; i < width / blockSize - 2; i += 2) {
          canvasContext.fillRect(
            widthRest + i * blockSize + marginInPixels.left,
            marginInPixels.top,
            blockSize,
            blockSize
          );
        }
      }

      // Draw singular blocks in corners
      canvasContext.fillRect(marginInPixels.left, marginInPixels.top, blockSize, blockSize);
      canvasContext.fillRect(
        marginInPixels.left + width - blockSize,
        marginInPixels.top,
        blockSize,
        blockSize
      );
      canvasContext.fillRect(
        marginInPixels.left,
        marginInPixels.top + height - blockSize,
        blockSize,
        blockSize
      );
      canvasContext.fillRect(
        marginInPixels.left + width - blockSize,
        marginInPixels.top + height - blockSize,
        blockSize,
        blockSize
      );
    }
    // Get canvasPage HTMLElement
    const canvasPage = canvasRef.current!;
    // Set canvasPage sizes in pixels
    canvasPage.width = width + marginInPixels.left + marginInPixels.right;
    canvasPage.height = height + marginInPixels.top + marginInPixels.bottom;
    // Set canvasPage style (rendered) size
    canvasPage.style.width = `${paperConfig.width}${paperConfig.unit}`;
    canvasPage.style.height = `${paperConfig.height}${paperConfig.unit}`;
    // Get 2d context to draw
    const context = canvasPage.getContext("2d");
    if (context) {
      // Draw the part of the image
      context.drawImage(
        imageSource,
        imageDrawPosition.x,
        imageDrawPosition.y,
        imageDrawSizes.width,
        imageDrawSizes.height,
        marginInPixels.left,
        marginInPixels.top,
        width,
        height
      );
      // If helping borders should be drawn, use the adequate function to do so
      if (paperConfig.helpingBorders) {
        printBorders(context);
      }
      // If helping corners should be drawn, use the adequate function to do so
      if (paperConfig.helpingCorners) {
        printCorners(context);
      }
      // If page number should be drawn, use the adequate function to do so
      if (paperConfig.pagesCounter) {
        printPageNumber(context);
      }
    }
  }, [
    canvasDrawSizes,
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
    strongBorder.isBottom,
    strongBorder.isLeft,
    strongBorder.isRight,
    strongBorder.isTop,
  ]);
  return <canvas ref={canvasRef}></canvas>;
}
