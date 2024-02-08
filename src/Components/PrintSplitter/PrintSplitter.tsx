import { MutableRefObject, useEffect, useRef } from "react";

const PrintSplitter = ({ imageSource, imageWidth, imageHeight }: PrintSplitterProps) => {
  const imageRef: MutableRefObject<null | HTMLImageElement> = useRef(null);
  const canvasRef: MutableRefObject<null | HTMLCanvasElement> = useRef(null);
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        if (canvasRef.current) {
          canvasRef.current.width = imageRef.current!.width;
          canvasRef.current.height = imageRef.current!.height;
          const context = canvasRef.current.getContext("2d");
          if (context) {
            context.drawImage(
              imageRef.current!,
              imageRef.current!.naturalWidth / 10,
              imageRef.current!.naturalHeight / 10,
              imageRef.current!.naturalWidth * 0.8,
              imageRef.current!.naturalHeight * 0.8,
              0,
              0,
              imageRef.current!.naturalWidth * 0.8,
              imageRef.current!.naturalHeight * 0.8
            );
          }
        }
      };
    }
  }, []);
  return (
    <>
      <img
        hidden={true}
        ref={imageRef}
        id="print-splitter-hidden-img"
        src={imageSource}
        style={{
          width: `${imageWidth}mm`,
          height: `${imageHeight}mm`,
        }}></img>
      <canvas
        style={{
          width: `${imageWidth}mm`,
          height: `${imageHeight}mm`,
        }}
        ref={canvasRef}
        id="print-splitter"></canvas>
    </>
  );
};

interface PrintSplitterProps {
  imageSource: string;
  imageWidth: number;
  imageHeight: number;
}

export default PrintSplitter;
