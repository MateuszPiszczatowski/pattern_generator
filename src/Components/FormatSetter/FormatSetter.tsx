import * as paperUtils from "../../utils/paperUtils";
import { IPaperConfig } from "../../utils/interfaces-n-types";
import { ReactNode } from "react";
import FormatForm from "../FormatForm/FormatForm";
export default function FormatSetter({
  paperConfig,
  setPaperConfig,
  setIsModalEnabled,
  setModalChildren,
}: IFormatSetterProps) {
  return (
    <>
      <h6>Current paper format:</h6>
      <table>
        <thead>
          <th>Unit</th>
          <th>Width</th>
          <th>Height</th>
          <th>Margin-top</th>
          <th>Margin-right</th>
          <th>Margin-bottom</th>
          <th>Margin-left</th>
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
      <label htmlFor="paperFormat">Select paper format</label>
      <select
        name="paperFormat"
        onChange={(e) => {
          const option = e.currentTarget.value;
          if (option !== "custom") {
            setPaperConfig(paperUtils.DefaultSizes[option]);
          } else {
            setModalChildren([<FormatForm />]);
            setIsModalEnabled(true);
          }
        }}>
        {Object.keys(paperUtils.DefaultSizes).map((key) => {
          return <option value={key}>{key[0].toUpperCase().concat(key.slice(1))}</option>;
        })}
        <option value="custom">Custom</option>
      </select>
    </>
  );
}

interface IFormatSetterProps {
  paperConfig: IPaperConfig;
  setPaperConfig: React.Dispatch<React.SetStateAction<IPaperConfig>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}
