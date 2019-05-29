import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { IMatchable, IStateInterface, Token } from "../Token";
import { Formula } from "./Formula";
import { Not } from "./Not";

export class Variable extends Formula {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, syntaxmatch, "Variable");
  }

  public getVarName = () => {
    return (this.elements[0] as Token).getVarName();
  };

  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    const notMe = Not.wrapInNot(this);
    return { necessities: { [notMe.toString()]: notMe }, possibilities: {} };
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    return { necessities: { [this.toString()]: this }, possibilities: {} };
  };

  public evaluate = (state: IStateInterface): boolean => {
    return state[this.elements[0].toString()];
  };

  public getStateDelta(): IStateDelta {
    return { [this.elements[0].toString()]: true };
  }
}
