import { ChangeEvent, ReactNode, useState } from "react";
import patternsConfiguratorsList from "../../SewingPatternsConfigurators/patternsConfiguratorsList";
import { IImageConfig } from "../../utils/interfaces-n-types";
import PatternOption from "../PatternOption/PatternOption";
import css from "./PatternBrowser.module.scss";
import { nanoid } from "nanoid";

export default function PatternsBrowser({ setImageConfig }: IPatternsBrowserProps) {
  const [filter, setFilter] = useState("");
  const [patternName, setPatternName] = useState("");
  const [formElement, setFormElement] = useState(null as ReactNode | ReactNode[]);
  function onFilterChange(e: ChangeEvent<HTMLInputElement>) {
    setFilter(e.currentTarget.value);
  }
  return (
    <>
      <label className={css.Filter}>
        Filter by name:
        <input type="text" onChange={onFilterChange} />
      </label>
      <div className={css.Container}>
        {...patternsConfiguratorsList
          .filter((configurator) =>
            configurator.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          )
          .map((configurator) => (
            <PatternOption
              patternConfigurator={configurator}
              setFormElement={setFormElement}
              setImageConfig={setImageConfig}
              setPattern={setPatternName}
              key={nanoid()}
            />
          ))}
      </div>
      {formElement && (
        <>
          <h3 className={css.Heading3}>Current pattern: {patternName}</h3>
          {formElement}
        </>
      )}
    </>
  );
}

interface IPatternsBrowserProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
}
