import { MutableRefObject, useEffect, useRef } from "react";
import { IWidthAndHeight } from "../../utils/interfaces-n-types";
import { IPaperConfig, IPaperMargin } from "../../utils/interfaces-n-types";

interface ICanvasPageProps {
  paperConfig: IPaperConfig;
  imageSource: CanvasImageSource;
  imageDrawPosition: { x: number; y: number };
  imageDrawSizes: IWidthAndHeight;
  marginInPixels: IPaperMargin;
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
  console.log("I've been here");
  useEffect(() => {
    const canvasPage = canvasRef.current!;
    canvasPage.width = canvasDrawSizes.width;
    canvasPage.height = canvasDrawSizes.height;
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
    }
  }, [
    canvasDrawSizes.height,
    canvasDrawSizes.width,
    imageDrawPosition.x,
    imageDrawPosition.y,
    imageDrawSizes.height,
    imageDrawSizes.width,
    imageSource,
    marginInPixels.left,
    marginInPixels.top,
    paperConfig.height,
    paperConfig.unit,
    paperConfig.width,
  ]);
  return <canvas ref={canvasRef}></canvas>;
}
