import PrintSplitter from "./Components/PrintSplitter/PrintSplitter";
import TestSingle from "./assets/testsingle.svg";
import TestWide from "./assets/testwide.svg";
import TestLong from "./assets/testlong.svg";
import "./App.css";
import * as paperUtils from "./utils/paperUtils";
function App() {
  return (
    <>
      <PrintSplitter
        imageConfig={{
          height: 297,
          width: 210,
          source: TestSingle,
          unit: "mm",
        }}
        paperConfig={{
          unit: "mm",
          width: 148.5,
          height: 210,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        }}
      />
      <PrintSplitter
        imageConfig={{
          height: 297,
          width: 420,
          source: TestWide,
          unit: "mm",
        }}
        paperConfig={{
          ...paperUtils.DefaultSizes.a4,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        }}
      />
      <PrintSplitter
        imageConfig={{
          height: 594,
          width: 210,
          source: TestLong,
          unit: "mm",
        }}
        paperConfig={{
          ...paperUtils.DefaultSizes.a4,
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        }}
      />
    </>
  );
}

export default App;
