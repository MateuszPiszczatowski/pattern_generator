import { IPatternConfigurator } from "../../utils/interfaces-n-types";

export default function PatternOption({
  patternConfigurator,
}: {
  patternConfigurator: IPatternConfigurator;
}) {
  return (
    <button>
      <figure>
        <img src={patternConfigurator.picture}></img>
        <figcaption>{patternConfigurator.title}</figcaption>
      </figure>
    </button>
  );
}
