import { IImageConfig, IPaperConfig } from "../../utils/interfaces-n-types";
import { PaperConfig } from "../../utils/paperUtils";
import PrintSplitter from "../PrintSplitter/PrintSplitter";

// A component that draws a square that can be used to check if the pattern will be printed correctly
export default function SizesHelper({ paperConfig }: ISizesHelperProps) {
  // Set sizesFactor in the same way as in patterns
  const sizesFactor = 100;
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Set SVG element sizes and attributes
  const width =
    (paperConfig.width - paperConfig.margin.left - paperConfig.margin.right) * sizesFactor;
  const height =
    (paperConfig.height - paperConfig.margin.top - paperConfig.margin.bottom) * sizesFactor;
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("fill", "transparent");
  svg.setAttribute("stroke", "black");
  svg.setAttribute(
    "stroke-width",
    paperConfig.unit === "mm" ? `${sizesFactor}` : `${0.1 * sizesFactor}`
  );
  let size = paperConfig.unit === "mm" ? 10 * sizesFactor : sizesFactor;
  // Try to fit the square in the avalible space, max width is 5x5
  for (let i = 5; i > 1; i--) {
    if (size * i < width && size * i < height) {
      size = size * i;
      break;
    }
  }
  // Create a text svg element that displayes what are the sizes
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.textContent = `${size / 100}x${size / 100}${paperConfig.unit}`;
  text.setAttribute("font-size", `${size / 5}`);
  text.setAttribute("x", `${width / 2 - size / 2.2}`);
  text.setAttribute("y", `${height / 2}`);
  text.setAttribute("fill", "black");
  text.setAttribute("stroke", "none");
  svg.appendChild(text);
  // Create the svg rectangle
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", `${width / 2 - size / 2}`);
  rect.setAttribute("y", `${height / 2 - size / 2}`);
  rect.setAttribute("width", `${size}`);
  rect.setAttribute("height", `${size}`);
  svg.appendChild(rect);
  // Create dataurl from the SVG element
  const svgString = new XMLSerializer().serializeToString(svg);
  const dataUrl = "data:image/svg+xml," + encodeURIComponent(svgString);
  // Create imageConfig from the data
  const image: IImageConfig = {
    width: width / sizesFactor,
    height: height / sizesFactor,
    unit: paperConfig.unit,
    source: dataUrl,
  };
  // Create the appropiate paper config
  const sizesPaperConfig = new PaperConfig(
    paperConfig.unit,
    width / sizesFactor,
    height / sizesFactor,
    false,
    false,
    false,
    { top: 0, right: 0, bottom: 0, left: 0 }
  );
  // Return the image in the print splitter to ensure, that it is shown in the same way as the pattern would
  return (
    <div
      style={{
        display: "flex",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "center",
        width: `${paperConfig.width}${paperConfig.unit}`,
        height: `${paperConfig.height}${paperConfig.unit}`,
        padding: `${paperConfig.margin.top}${paperConfig.unit} 
        ${paperConfig.margin.right}${paperConfig.unit} 
        ${paperConfig.margin.bottom}${paperConfig.unit} 
        ${paperConfig.margin.left}${paperConfig.unit}`,
      }}>
      <PrintSplitter
        paperConfig={sizesPaperConfig}
        printGuidePage={false}
        printSizesHelper={false}
        helperView={false}
        imageConfig={image}
      />
    </div>
  );
}

interface ISizesHelperProps {
  paperConfig: IPaperConfig;
}
