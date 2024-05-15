import { FormEvent, useRef } from "react";
import { IPaperConfig, PaperUnit } from "../../utils/interfaces-n-types";
import LabeledUnitSelect from "../UnitSelect/LabeledUnitSelect";
import { PaperConfig } from "../../utils/paperUtils";
import css from "./FormatForm.module.scss";
import { nanoid } from "nanoid";
// Component for setting custom paper format.
export default function FormatForm({
  currentPaperConfig,
  setPaperConfig,
  setIsModalEnabled,
}: IPaperFormProps) {
  const formRef = useRef(null as null | HTMLFormElement);
  // On cancel reset the form and hide modal.
  const onCancel = () => {
    formRef.current!.reset();
    setIsModalEnabled(false);
  };
  // On submit create a proper paper configuration
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = e.currentTarget.elements;
    const paperConfig: IPaperConfig = new PaperConfig(
      (values.namedItem("unit") as HTMLSelectElement).value as PaperUnit,
      Number((values.namedItem("width") as HTMLInputElement).value),
      Number((values.namedItem("height") as HTMLInputElement).value),
      (values.namedItem("helpingBorders") as HTMLInputElement).checked,
      (values.namedItem("helpingCorners") as HTMLInputElement).checked,
      (values.namedItem("pagesCounter") as HTMLInputElement).checked,
      {
        top: Number((values.namedItem("top") as HTMLInputElement).value),
        bottom: Number((values.namedItem("bottom") as HTMLInputElement).value),
        left: Number((values.namedItem("left") as HTMLInputElement).value),
        right: Number((values.namedItem("right") as HTMLInputElement).value),
      }
    );
    // If user used negative numbers notify them that they can't do so
    if (
      paperConfig.height < 0 ||
      paperConfig.width < 0 ||
      paperConfig.margin.top < 0 ||
      paperConfig.margin.bottom < 0 ||
      paperConfig.margin.left < 0 ||
      paperConfig.margin.right < 0
    ) {
      window.alert("Sizes cannot be negative.");
      return;
    }
    // If user used margins that are not smaller than the whole page, notify them that they can't do so
    if (
      paperConfig.height < paperConfig.margin.top + paperConfig.margin.bottom ||
      paperConfig.width < paperConfig.margin.left + paperConfig.margin.right
    ) {
      window.alert("Margin must be less than height and width.");
      return;
    }
    setPaperConfig(paperConfig);
    setIsModalEnabled(false);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className={css.Form}>
      <LabeledUnitSelect defaultUnit={currentPaperConfig?.unit ?? "cm"} />
      <label htmlFor="width" className={css.Label}>
        Width:{" "}
        <input
          name="width"
          type="number"
          step={0.01}
          min={0}
          key={nanoid()}
          defaultValue={currentPaperConfig?.width ?? 10}
        />
      </label>
      <label htmlFor="height" className={css.Label}>
        Height:{" "}
        <input
          name="height"
          type="number"
          min={0}
          step={0.01}
          key={nanoid()}
          defaultValue={currentPaperConfig?.height ?? 10}
        />
      </label>
      <label className={css.Label}>
        Should print helping borders:
        <input
          name="helpingBorders"
          type="checkbox"
          key={nanoid()}
          defaultChecked={currentPaperConfig?.helpingBorders ?? true}
        />
      </label>
      <label className={css.Label}>
        Should print helping cornes:
        <input
          name="helpingCorners"
          type="checkbox"
          key={nanoid()}
          defaultChecked={currentPaperConfig?.helpingCorners ?? true}
        />
      </label>
      <label className={css.Label}>
        Should print page number:
        <input
          name="pagesCounter"
          type="checkbox"
          key={nanoid()}
          defaultChecked={currentPaperConfig?.pagesCounter ?? true}
        />
      </label>
      <h3 className={css.Header}>Margins:</h3>
      <section className={css.MarginSection}>
        <label htmlFor="top" className={css.Label}>
          Top:{" "}
          <input
            name="top"
            type="number"
            min={0}
            step={0.01}
            key={nanoid()}
            defaultValue={currentPaperConfig?.margin.top ?? 1}
          />
        </label>
        <label htmlFor="right" className={css.Label}>
          Right:{" "}
          <input
            name="right"
            type="number"
            min={0}
            step={0.01}
            key={nanoid()}
            defaultValue={currentPaperConfig?.margin.right ?? 1}
          />
        </label>
        <label htmlFor="bottom" className={css.Label}>
          Bottom:{" "}
          <input
            name="bottom"
            type="number"
            min={0}
            step={0.01}
            key={nanoid()}
            defaultValue={currentPaperConfig?.margin.bottom ?? 1}
          />
        </label>
        <label htmlFor="left" className={css.Label}>
          Left:{" "}
          <input
            name="left"
            type="number"
            min={0}
            step={0.01}
            key={nanoid()}
            defaultValue={currentPaperConfig?.margin.left ?? 1}
          />
        </label>
      </section>
      <div className={css.ButtonsContainer}>
        <input type="submit" value="Save" />
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

interface IPaperFormProps {
  currentPaperConfig: IPaperConfig;
  setPaperConfig: React.Dispatch<React.SetStateAction<IPaperConfig>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
