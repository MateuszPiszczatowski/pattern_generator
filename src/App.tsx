import { Notify } from "notiflix/build/notiflix-notify-aio";
import PrintSplitter from "./Components/PrintSplitter/PrintSplitter";
import css from "./App.module.scss";
import * as paperUtils from "./utils/paperUtils";
import { ReactNode, useEffect, useState } from "react";
import { IImageConfig, IPaperConfig } from "./utils/interfaces-n-types";
import Modal from "./Components/Modal/Modal";
import PatternSetter from "./Components/PatternSetter/PatternSetter";
import FormatSetter from "./Components/FormatSetter/FormatSetter";
import { nanoid } from "nanoid";

function App() {
  Notify.init({ showOnlyTheLastOne: true });
  const modalTabIndex = 1;
  const printingSectionTabIndex = 2;

  const [notifyClass] = useState(nanoid());

  const [paperConfig, setPaperConfig] = useState(paperUtils.DefaultSizes.a4 as IPaperConfig);
  const [imageConfig, setImageConfig] = useState(null as null | IImageConfig);
  const [isPrintingViewEnabled, setIsPrintingViewEnabled] = useState(false);

  const [modalContent, setModalContent] = useState(null as ReactNode);
  const [isModalEnabled, setIsModalEnabled] = useState(false);

  const [isBackgroundColored, setIsBackgroundColored] = useState(true);

  function disablePrintingView() {
    const notify = document.querySelector(`.a${notifyClass}`);
    notify?.parentElement?.removeChild(notify);

    setIsBackgroundColored(true);
    setIsPrintingViewEnabled(false);
  }

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
          className={css.Section}
          hidden={isPrintingViewEnabled}
          style={{ display: isPrintingViewEnabled ? "none" : "flex" }}>
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
                className: css.NoPrint.concat(" a", notifyClass),
              });
              setIsPrintingViewEnabled(true);
              setIsBackgroundColored(false);
            }}>
            Show for printing
          </button>
        </section>
      </main>
      <section
        tabIndex={printingSectionTabIndex}
        onLoad={(e) => {
          e.currentTarget.focus();
        }}
        style={{ display: isPrintingViewEnabled ? "block" : "none" }}
        hidden={!isPrintingViewEnabled}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            disablePrintingView();
          }
        }}>
        {imageConfig && isPrintingViewEnabled && (
          <>
            <button className={css.BackButton} onClick={disablePrintingView}>
              Back
            </button>
            <PrintSplitter
              helperView={false}
              printGuidePage={true}
              printSizesHelper={true}
              imageConfig={imageConfig}
              paperConfig={paperConfig}
            />
          </>
        )}
      </section>

      <Modal isEnabled={isModalEnabled} setIsEnabled={setIsModalEnabled} tabIndex={modalTabIndex}>
        {modalContent}
      </Modal>
    </>
  );
}

export default App;
