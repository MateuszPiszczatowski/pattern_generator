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
  // Create tab indexes so that it's possible to focus on the elements
  const modalTabIndex = 1;
  const printingSectionTabIndex = 2;

  // State to create a class for notify pop up
  const [notifyClass] = useState(nanoid());

  // State for printing, paper format and image configuration
  const [paperConfig, setPaperConfig] = useState(paperUtils.DefaultSizes.a4 as IPaperConfig);
  const [imageConfig, setImageConfig] = useState(null as null | IImageConfig);
  const [isPrintingViewEnabled, setIsPrintingViewEnabled] = useState(false);

  // State for handling modal
  const [modalContent, setModalContent] = useState(null as ReactNode);
  const [isModalEnabled, setIsModalEnabled] = useState(false);

  // Background color is switched when printing view is enabled/disabled
  const [isBackgroundColored, setIsBackgroundColored] = useState(true);

  function disablePrintingView() {
    // Find and remove the notify pop up if exists
    const notify = document.querySelector(`.a${notifyClass}`);
    notify?.parentElement?.removeChild(notify);

    // Restore background color and disable printing view
    setIsBackgroundColored(true);
    setIsPrintingViewEnabled(false);
  }

  // Update component when background color is changed
  useEffect(() => {
    const bodyElem = document.querySelector("body");
    if (bodyElem)
      if (isBackgroundColored) bodyElem.style.removeProperty("background-color");
      else bodyElem.style.backgroundColor = "#fff";
  }, [isBackgroundColored]);

  return (
    <>
      <header className={css.Header}>
        <h1
          className={css.Title}
          /* Show/hide if printing view is enabled */
          hidden={isPrintingViewEnabled}>
          PolTailorEx
        </h1>
      </header>
      <main>
        <section
          className={css.Section}
          /* Show/hide if printing view is enabled */
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
            /* Disable the button if there is no imageConfig ready */
            disabled={!imageConfig}
            /* Show notification that the printing view can be exited with an ESC key and enable printing view */
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
        /* Focus on the section when loaded so it can be exited with ESC key */
        tabIndex={printingSectionTabIndex}
        onLoad={(e) => {
          e.currentTarget.focus();
        }}
        /* Show/hide the printing view */
        style={{ display: isPrintingViewEnabled ? "block" : "none" }}
        hidden={!isPrintingViewEnabled}
        /* Close the printing view when ESC key is pressed */
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            disablePrintingView();
          }
        }}>
        {/* Show the printing view and printing view exit button when imageConfig is ready and printing view is enabled */}
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
