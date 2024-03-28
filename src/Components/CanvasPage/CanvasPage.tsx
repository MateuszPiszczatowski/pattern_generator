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
}

export default function CanvasPage({
  paperConfig,
  imageSource,
  imageDrawSizes,
  imageDrawPosition,
  marginInPixels,
  canvasDrawSizes,
}: ICanvasPageProps) {
  const canvasRef: MutableRefObject<null | HTMLCanvasElement> = useRef(null);
  useEffect(() => {
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
        console.log("should print borders"); // TODO: Implement helping borders
      }
      if (paperConfig.helpingCorners) {
        console.log("should print corners"); // TODO: Implement helping corners
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
    paperConfig.height,
    paperConfig.helpingBorders,
    paperConfig.helpingCorners,
    paperConfig.unit,
    paperConfig.width,
  ]);
  return <canvas ref={canvasRef}></canvas>;
}
