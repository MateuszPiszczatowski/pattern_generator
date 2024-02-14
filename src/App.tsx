import PrintSplitter from "./Components/PrintSplitter/PrintSplitter";
import "./App.css";
import * as paperUtils from "./utils/paperUtils";
import { ReactNode, useRef, useState } from "react";
import { IImageConfig, IPaperConfig } from "./utils/interfaces-n-types";
import Modal from "./Components/Modal/Modal";
import PatternSetter from "./Components/PatternSetter/PatternSetter";
import FormatSetter from "./Components/FormatSetter/FormatSetter";
function App() {
  const modalTabIndex = 1;
  const printingSectionTabIndex = 2;
  const printingSectionRef = useRef(null as null | HTMLDivElement);
  const [paperConfig, setPaperConfig] = useState(paperUtils.DefaultSizes.a4 as IPaperConfig);
  const [imageConfig, setImageConfig] = useState(null as null | IImageConfig);
  const [isPrintingViewEnabled, setIsPrintingViewEnabled] = useState(false);
  const [modalContent, setModalContent] = useState([] as ReactNode[] | ReactNode);
  const [isModalEnabled, setIsModalEnabled] = useState(false);
  return (
    <>
      <section hidden={isPrintingViewEnabled}>
        <PatternSetter
          setImageConfig={setImageConfig}
          setIsModalEnabled={setIsModalEnabled}
          setModalChildren={setModalContent}
        />
        <FormatSetter
          paperConfig={paperConfig}
          setIsModalEnabled={setIsModalEnabled}
          setModalChildren={setModalContent}
          setPaperConfig={setPaperConfig}
        />
        <button disabled={!imageConfig} onClick={() => setIsPrintingViewEnabled(true)}>
          Show for printing
        </button>
      </section>

      {/* Section for printing*/}

      <section
        onLoad={(e) => {
          e.currentTarget.focus();
        }}
        tabIndex={printingSectionTabIndex}
        ref={printingSectionRef}
        hidden={!isPrintingViewEnabled}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsPrintingViewEnabled(false);
        }}>
        {imageConfig && isPrintingViewEnabled && (
          <PrintSplitter imageConfig={imageConfig} paperConfig={paperConfig} />
        )}
      </section>

      <Modal isEnabled={isModalEnabled} setIsEnabled={setIsModalEnabled} tabIndex={modalTabIndex}>
        {modalContent}
      </Modal>
    </>
  );
}

export default App;
