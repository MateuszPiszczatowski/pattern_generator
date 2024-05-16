import * as paperUtils from "../../utils/paperUtils";
import { IPaperConfig } from "../../utils/interfaces-n-types";
import { MouseEvent as ReactMouseEvent, ReactNode, useReducer } from "react";
import FormatForm from "../FormatForm/FormatForm";
import css from "./FormatSetter.module.scss";
import { nanoid } from "nanoid";
// Component for setting paper format
export default function FormatSetter({
  paperConfig,
  setPaperConfig,
  setIsModalEnabled,
  setModalChildren,
}: IFormatSetterProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  // Display FormatForm in a modal
  function openSetFormatModal() {
    setModalChildren(
      <FormatForm
        currentPaperConfig={paperConfig} // This allows to use custom for small adjustments to the current format
        setPaperConfig={setPaperConfig}
        setIsModalEnabled={setIsModalEnabled}
      />
    );
    setIsModalEnabled(true);
  }
  // Set paperConfig to a predefined format or open modal for setting it to custom
  const setFormat = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    const option = e.currentTarget.value;
    if (option !== "custom") {
      setPaperConfig(paperUtils.DefaultSizes[option]);
    } else {
      openSetFormatModal();
    }
    forceUpdate();
  };

  return (
    <section className={css.Section}>
      <div className={css.SectionContent}>
        <h2 className={css.Heading2}>Paper format section</h2>
        <h3 className={css.Heading3}>Current paper format:</h3>
        <div className={css.TablePositioner}>
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
        </div>
        <label className={css.LabelFormatButtons.concat(" ", css.Label)} htmlFor="paperFormat">
          Select paper format:
          <ul className={css.SizesList}>
            {Object.keys(paperUtils.DefaultSizes).map((key) => {
              return (
                <li key={key.concat(".li.", nanoid())}>
                  <button value={key} key={key.concat(".button.", nanoid())} onClick={setFormat}>
                    {key[0].toUpperCase().concat(key.slice(1))}
                  </button>
                </li>
              );
            })}
            <li key={"custom.li.".concat(nanoid())}>
              <button key={"custom.li.".concat(nanoid())} value="custom" onClick={setFormat}>
                Custom
              </button>
            </li>
          </ul>
        </label>
      </div>
    </section>
  );
}

interface IFormatSetterProps {
  paperConfig: IPaperConfig;
  setPaperConfig: React.Dispatch<React.SetStateAction<IPaperConfig>>;
  setIsModalEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}
