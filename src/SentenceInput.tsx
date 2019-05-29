import { IStateDelta } from "App";
import * as React from "react";
import styles from "./App.module.scss";

interface ISentenceInputState {
  sentence: string;
  sentences: string[];
  stateValues: IStateDelta;
}

interface ISentenceProps {
  sentences: string[];
  sentence: string;
  stateValues: IStateDelta;
  evaluate(
    sentence: string,
    stateValues: IStateDelta,
    negateIt?: boolean
  ): void;
}

export class SentenceInput extends React.Component<
  ISentenceProps,
  ISentenceInputState
> {
  public trueref: HTMLInputElement | null = null;
  public falseref: HTMLInputElement | null = null;
  constructor(props: ISentenceProps) {
    super(props);
    const { sentence, sentences, stateValues } = props;
    this.state = { sentence, sentences, stateValues };
  }
  public submitSentence = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { sentence, stateValues } = this.state;
    const { evaluate } = this.props;
    evaluate(sentence, stateValues, false);
    (e.target as HTMLButtonElement).blur();
  };

  public submitSentenceNegated = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { sentence, stateValues } = this.state;
    const { evaluate } = this.props;
    evaluate(sentence, stateValues);
    (e.target as HTMLButtonElement).blur();
  };

  public onSentenceChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({ sentence: e.target.value });
  };

  public onBooleansChange = (trueOrFalse: boolean) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { stateValues } = this.state;

    let newVars;
    if (trueOrFalse) {
      newVars = (this.trueref as HTMLInputElement).value.split("");
    } else {
      newVars = (this.falseref as HTMLInputElement).value.split("");
    }

    const newSetOfVars = newVars.reduce((acc, v) => {
      acc[v] = trueOrFalse;
      return acc;
    }, {});
    const newStateValues = { ...stateValues, ...newSetOfVars };
    this.setState({ stateValues: newStateValues });
  };

  public render() {
    const { sentence, sentences, stateValues } = this.state;
    const trues = [];
    const falses = [];
    for (const varname of Object.keys(stateValues)) {
      if (stateValues[varname]) {
        trues.push(varname);
      } else {
        falses.push(varname);
      }
    }

    return (
      <div className={styles.inputsection}>
        <div className={styles.centered}>
          <select onChange={this.onSentenceChange} value={sentence}>
            {sentences.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          The formula you want to test:
          <textarea
            cols={40}
            rows={10}
            onChange={this.onSentenceChange}
            value={sentence}
          />
        </div>
        <div className={styles.buttons}>
          <button onClick={this.submitSentenceNegated}>
            Evaluate the Negation (to make tableau)
          </button>
          <button onClick={this.submitSentence}>Evaluate (for 2SAT)</button>
        </div>
      </div>
    );
  }
}
