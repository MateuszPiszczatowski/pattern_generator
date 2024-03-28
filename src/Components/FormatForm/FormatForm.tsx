import { FormEvent, useRef } from "react";
import { IPaperConfig, PaperUnit } from "../../utils/interfaces-n-types";
import LabeledUnitSelect from "../UnitSelect/LabeledUnitSelect";

export default function FormatForm({ setPaperConfig, setIsModalEnabled }: IFormatFormProps) {
  const formRef = useRef(null as null | HTMLFormElement);
  const onCancel = () => {
    formRef.current!.reset();
    setIsModalEnabled(false);
  };
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = e.currentTarget.elements;
    const paperConfig: IPaperConfig = {
      height: Number((values.namedItem("height") as HTMLInputElement).value),
      width: Number((values.namedItem("width") as HTMLInputElement).value),
      unit: (values.namedItem("unit") as HTMLSelectElement).value as PaperUnit,
      helpingBorders: (values.namedItem("helpingBorders") as HTMLInputElement).checked,
      helpingCorners: (values.namedItem("helpingCorners") as HTMLInputElement).checked,
      margin: {
        top: Number((values.namedItem("top") as HTMLInputElement).value),
        bottom: Number((values.namedItem("bottom") as HTMLInputElement).value),
        left: Number((values.namedItem("left") as HTMLInputElement).value),
        right: Number((values.namedItem("right") as HTMLInputElement).value),
      },
    };
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
    <form ref={formRef} onSubmit={onSubmit}>
      <LabeledUnitSelect />
      <label htmlFor="width">
        Width: <input name="width" type="number" defaultValue={10} />
      </label>
      <label htmlFor="height">
        Height: <input name="height" type="number" defaultValue={10} />
      </label>
      <label>
        Should print helping borders:
        <input name="helpingBorders" type="checkbox" defaultChecked={true} />
      </label>
      <label>
        Should print helping cornes:
        <input name="helpingCorners" type="checkbox" defaultChecked={true} />
      </label>
      <label></label>
      <h6>Margins:</h6>
      <section>
        <label htmlFor="top">
          Top: <input name="top" type="number" defaultValue={1} />
        </label>
        <label htmlFor="right">
          Right: <input name="right" type="number" defaultValue={1} />
        </label>
        <label htmlFor="bottom">
          Bottom: <input name="bottom" type="number" defaultValue={1} />
        </label>
        <label htmlFor="left">
          Left: <input name="left" type="number" defaultValue={1} />
        </label>
      </section>
      <div>
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
