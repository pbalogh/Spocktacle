import { INecessitiesAndPossibilities } from "App";
import { BINARYOPERATOR, FORMULA } from "../Constants";
import { IMatchable, IMatchableMap, IStateInterface, Token } from "../Token";
import { Formula } from "./Formula";
import { Not } from "./Not";

export class And extends Formula {
  public static AndToken = new Token("&&", BINARYOPERATOR, "And");
  public static wrapInAnd(formula1: IMatchable, formula2: IMatchable): And {
    return new And([formula1, And.AndToken, formula2], FORMULA, "And");
  }
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "And");
  }

  public evaluate = (state: IStateInterface): boolean => {
    return (
      (this.elements[0] as IMatchable).evaluate(state) &&
      (this.elements[2] as IMatchable).evaluate(state)
    );
  };

  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    const possibilities: IMatchableMap = {};

    const notOne = Not.wrapInNot(this.elements[0] as IMatchable);
    const notTwo = Not.wrapInNot(this.elements[2] as IMatchable);
    possibilities[notOne.toString()] = notOne;
    possibilities[notTwo.toString()] = notTwo;

    return {
      necessities: {},
      possibilities
    };
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    const necessities: IMatchableMap = {};

    necessities[this.elements[0].toString()] = this.elements[0] as IMatchable;
    necessities[this.elements[2].toString()] = this.elements[2] as IMatchable;

    return {
      necessities,
      possibilities: {}
    };
  };
}
