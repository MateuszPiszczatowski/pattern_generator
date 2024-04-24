import { Notify } from "notiflix/build/notiflix-notify-aio";
import PrintSplitter from "./Components/PrintSplitter/PrintSplitter";
import css from "./App.module.scss";
import * as paperUtils from "./utils/paperUtils";
import { ReactNode, useEffect, useRef, useState } from "react";
import { IImageConfig, IPaperConfig } from "./utils/interfaces-n-types";
import Modal from "./Components/Modal/Modal";
import PatternSetter from "./Components/PatternSetter/PatternSetter";
import FormatSetter from "./Components/FormatSetter/FormatSetter";
import { nanoid } from "nanoid";

function App() {
  Notify.init({ showOnlyTheLastOne: true });
  const [notifyClass] = useState(nanoid());
  const modalTabIndex = 1;
  const printingSectionTabIndex = 2;
  const printingSectionRef = useRef(null as null | HTMLDivElement);
  const [paperConfig, setPaperConfig] = useState(paperUtils.DefaultSizes.a4 as IPaperConfig);
  const [imageConfig, setImageConfig] = useState(null as null | IImageConfig);
  const [isPrintingViewEnabled, setIsPrintingViewEnabled] = useState(false);
  const [modalContent, setModalContent] = useState(null as ReactNode);
  const [isModalEnabled, setIsModalEnabled] = useState(false);
  const [isBackgroundColored, setIsBackgroundColored] = useState(true);
  useEffect(() => {
    const bodyElem = document.querySelector("body");
    if (bodyElem)
      if (isBackgroundColored) bodyElem.style.removeProperty("background-color");
      else bodyElem.style.backgroundColor = "#fff";
  }, [isBackgroundColored]);
  return (
    <>
      <header className={css.Header}>
        <h1 className={css.Title} hidden={isPrintingViewEnabled}>
          PolTailorEx
        </h1>
      </header>
      <main>
        <section
          hidden={isPrintingViewEnabled}
          style={{ display: isPrintingViewEnabled ? "none" : "flex" }}
          className={css.Section}>
          <PatternSetter setImageConfig={setImageConfig} setModalChildren={setModalContent} />
          <FormatSetter
            paperConfig={paperConfig}
            setIsModalEnabled={setIsModalEnabled}
            setModalChildren={setModalContent}
            setPaperConfig={setPaperConfig}
          />
          <button
            disabled={!imageConfig}
            onClick={() => {
              Notify.info("Press ESC to exit printing view.", {
                timeout: 5000,
                className: css.NoPrint.concat(" ", notifyClass),
              });
              setIsPrintingViewEnabled(true);
              setIsBackgroundColored(false);
            }}>
            Show for printing
          </button>
        </section>
      </main>
      <section
        onLoad={(e) => {
          e.currentTarget.focus();
        }}
        tabIndex={printingSectionTabIndex}
        ref={printingSectionRef}
        hidden={!isPrintingViewEnabled}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            const notify = document.querySelector(`.${notifyClass}`);
            notify?.parentElement?.removeChild(notify);
            setIsBackgroundColored(true);
            setIsPrintingViewEnabled(false);
          }
        }}>
        {imageConfig && isPrintingViewEnabled && (
          <PrintSplitter
            printGuidePage={true}
            printSizesTest={true}
            imageConfig={imageConfig}
            paperConfig={paperConfig}
          />
        )}
      </section>

      <Modal isEnabled={isModalEnabled} setIsEnabled={setIsModalEnabled} tabIndex={modalTabIndex}>
        {modalContent}
      </Modal>
    </>
  );
}

export default App;
