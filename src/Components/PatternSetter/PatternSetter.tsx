import { ReactNode } from "react";
import PatternsBrowser from "../PatternsBrowser/PatternsBrowser";
import { IImageConfig } from "../../utils/interfaces-n-types";
import css from "./PatternSetter.module.scss";
export default function PatternSetter({ setImageConfig }: IPatternSetterProps) {
  return (
    <section className={css.Section}>
      <div className={css.SectionContent}>
        <h2 className={css.Heading2}>Pattern configuration</h2>
        <PatternsBrowser setImageConfig={setImageConfig}></PatternsBrowser>
      </div>
    </section>
  );
}

interface IPatternSetterProps {
  setImageConfig: React.Dispatch<React.SetStateAction<IImageConfig | null>>;
  setModalChildren: React.Dispatch<React.SetStateAction<ReactNode[] | ReactNode>>;
}
