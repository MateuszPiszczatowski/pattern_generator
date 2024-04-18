import { FormEvent, useRef } from "react";
import { IPaperConfig, PaperUnit } from "../../utils/interfaces-n-types";
import LabeledUnitSelect from "../UnitSelect/LabeledUnitSelect";
import { PaperConfig } from "../../utils/paperUtils";
import css from "./FormatForm.module.scss";

export default function FormatForm({ setPaperConfig, setIsModalEnabled }: IFormatFormProps) {
  const formRef = useRef(null as null | HTMLFormElement);
  const onCancel = () => {
    formRef.current!.reset();
    setIsModalEnabled(false);
  };
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
    if (
      paperConfig.height > paperConfig.margin.top + paperConfig.margin.bottom &&
      paperConfig.width > paperConfig.margin.left + paperConfig.margin.right
    ) {
      setPaperConfig(paperConfig);
      setIsModalEnabled(false);
    } else {
      window.alert("Margins can`t be bigger than the whole page itself!");
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className={css.Form}>
      <LabeledUnitSelect />
      <label htmlFor="width" className={css.Label}>
        Width: <input name="width" type="number" defaultValue={10} />
      </label>
      <label htmlFor="height" className={css.Label}>
        Height: <input name="height" type="number" defaultValue={10} />
      </label>
      <label className={css.Label}>
        Should print helping borders:
        <input name="helpingBorders" type="checkbox" defaultChecked={true} />
      </label>
      <label className={css.Label}>
        Should print helping cornes:
        <input name="helpingCorners" type="checkbox" defaultChecked={true} />
      </label>
      <label className={css.Label}>
        Should print page number:
        <input name="pagesCounter" type="checkbox" defaultChecked={true} />
      </label>
      <label></label>
      <h3 className={css.Header}>Margins:</h3>
      <section className={css.MarginSection}>
        <label htmlFor="top" className={css.Label}>
          Top: <input name="top" type="number" defaultValue={1} />
        </label>
        <label htmlFor="right" className={css.Label}>
          Right: <input name="right" type="number" defaultValue={1} />
        </label>
        <label htmlFor="bottom" className={css.Label}>
          Bottom: <input name="bottom" type="number" defaultValue={1} />
        </label>
        <label htmlFor="left" className={css.Label}>
          Left: <input name="left" type="number" defaultValue={1} />
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

interface IFormatFormProps {
  setPaperConfig: React.Dispatch<React.SetStateAction<IPaperConfig>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
