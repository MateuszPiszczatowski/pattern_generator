import * as paperUtils from "../../utils/paperUtils";
import { IPaperConfig } from "../../utils/interfaces-n-types";
import { ChangeEvent, ReactNode, useRef } from "react";
import FormatForm from "../FormatForm/FormatForm";
import css from "./FormatSetter.module.scss";

export default function FormatSetter({
  paperConfig,
  setPaperConfig,
  setIsModalEnabled,
  setModalChildren,
}: IFormatSetterProps) {
  function openCustomMarginEdit() {
    setModalChildren([
      <FormatForm setPaperConfig={setPaperConfig} setIsModalEnabled={setIsModalEnabled} />,
    ]);
    setIsModalEnabled(true);
  }
  const formatSelectRef = useRef(null as null | HTMLSelectElement);
  const customMargins = (e: ChangeEvent<HTMLSelectElement>) => {
    const option = e.currentTarget.value;
    if (option !== "custom") {
      setPaperConfig(paperUtils.DefaultSizes[option]);
    } else {
      openCustomMarginEdit();
    }
  };

  return (
    <div>
      <h6 className={css.Header}>Current paper format:</h6>
      <table className={css.InfoTable}>
        <thead>
          <tr>
            <th>Unit</th>
            <th>Width</th>
            <th>Height</th>
            <th>Margin-top</th>
            <th>Margin-right</th>
            <th>Margin-bottom</th>
            <th>Margin-left</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{paperConfig.unit}</td>
            <td>{paperConfig.width}</td>
            <td>{paperConfig.height}</td>
            <td>{paperConfig.margin.top}</td>
            <td>{paperConfig.margin.right}</td>
            <td>{paperConfig.margin.bottom}</td>
            <td>{paperConfig.margin.left}</td>
          </tr>
        </tbody>
      </table>
      <label className={css.Label} htmlFor="paperFormat">
        Select paper format:
        <select ref={formatSelectRef} onChange={customMargins}>
          {Object.keys(paperUtils.DefaultSizes).map((key) => {
            return (
              <option value={key} key={key}>
                {key[0].toUpperCase().concat(key.slice(1))}
              </option>
            );
          })}
          <option value="custom">Custom</option>
        </select>
      </label>
      {formatSelectRef.current?.value === "custom" && (
        <button onClick={openCustomMarginEdit}>Edit</button>
      )}
    </div>
  );
}

interface IFormatSetterProps {
  paperConfig: IPaperConfig;
  setPaperConfig: React.Dispatch<React.SetStateAction<IPaperConfig>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}