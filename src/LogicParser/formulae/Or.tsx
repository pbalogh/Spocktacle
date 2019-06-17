import { INecessitiesAndPossibilities } from "App";
import { BINARYOPERATOR, FORMULA } from "../Constants";
import { IMatchable, IMatchableMap, IStateInterface, Token } from "../Token";
import { Formula } from "./Formula";
import { Not } from "./Not";

export class Or extends Formula {
  public static OrToken = new Token(/^\|\|/, BINARYOPERATOR, "Or", "||");
  public static wrapInOr(formula1: IMatchable, formula2: IMatchable): Or {
    return new Or([formula1, Or.OrToken, formula2], FORMULA, "Or");
  }
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "Or");
  }

  public evaluate = (state: IStateInterface): boolean => {
    return (
      (this.elements[0] as IMatchable).evaluate(state) ||
      (this.elements[2] as IMatchable).evaluate(state)
    );
  };

  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    const necessities: IMatchableMap = {};

    const notOne = Not.wrapInNot(this.elements[0] as IMatchable);
    const notTwo = Not.wrapInNot(this.elements[2] as IMatchable);
    necessities[notOne.toString()] = notOne;
    necessities[notTwo.toString()] = notTwo;

    return {
      necessities,
      possibilities: {}
    };
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    const possibilities: IMatchableMap = {};

    possibilities[this.elements[0].toString()] = this.elements[0] as IMatchable;
    possibilities[this.elements[2].toString()] = this.elements[2] as IMatchable;

    return {
      necessities: {},
      possibilities
    };
  };
}
