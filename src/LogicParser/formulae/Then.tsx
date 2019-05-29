import { INecessitiesAndPossibilities } from "App";
import { FORMULA } from "../Constants";
import { IMatchable, IMatchableMap, IStateInterface } from "../Token";
import { Formula } from "./Formula";
import { Not } from "./Not";

export class Then extends Formula {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "Then");
  }

  public evaluate = (state: IStateInterface): boolean => {
    return (
      !(this.elements[0] as IMatchable).evaluate(state) ||
      (this.elements[2] as IMatchable).evaluate(state)
    );
  };

  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    // For an if->then to be false,
    // the antecedent must be true and the consequent must be false.
    const necessities: IMatchableMap = {};
    necessities[this.elements[0].toString()] = this.elements[0] as IMatchable;
    const notTwo = Not.wrapInNot(this.elements[2] as IMatchable);
    necessities[notTwo.toString()] = notTwo;

    return {
      necessities,
      possibilities: {}
    };
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    // For an if->then to be false,
    // EITHER the antecedent must be false OR the consequent must be true.
    const possibilities: IMatchableMap = {};
    const notOne = Not.wrapInNot(this.elements[0] as IMatchable);
    possibilities[notOne.toString()] = notOne;
    possibilities[this.elements[2].toString()] = this.elements[2] as IMatchable;

    return {
      necessities: {},
      possibilities
    };
  };
}
