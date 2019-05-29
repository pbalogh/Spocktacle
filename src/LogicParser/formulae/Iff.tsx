import { INecessitiesAndPossibilities } from "App";
import { FORMULA } from "../Constants";
import { IMatchable, IStateInterface } from "../Token";
import { And } from "./And";
import { Formula } from "./Formula";
import { Not } from "./Not";

export class Iff extends Formula {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "Iff");
  }

  public evaluate = (state: IStateInterface): boolean => {
    return (
      (this.elements[0] as IMatchable).evaluate(state) ===
      (this.elements[2] as IMatchable).evaluate(state)
    );
  };

  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    // For an iff A<->B to be false,
    // there are two possibilities:
    // either the antecedent is true and the consequent is false
    // OR the antecedent is false and the consequent is true
    const firstFalseSecondTrue = And.wrapInAnd(
      Not.wrapInNot(this.elements[0] as IMatchable),
      this.elements[2] as IMatchable
    );

    const firstTrueSecondFalse = And.wrapInAnd(
      this.elements[0] as IMatchable,
      Not.wrapInNot(this.elements[2] as IMatchable)
    );
    return {
      necessities: {},
      possibilities: {
        [firstFalseSecondTrue.toString()]: firstFalseSecondTrue,
        [firstTrueSecondFalse.toString()]: firstTrueSecondFalse
      }
    };
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    // For an iff A<->B to be true,
    // there are two possibilities:
    // either the antecedent and consequent are both false
    // OR they are both true.
    const bothTrue = And.wrapInAnd(
      this.elements[0] as IMatchable,
      this.elements[2] as IMatchable
    );

    const bothFalse = And.wrapInAnd(
      Not.wrapInNot(this.elements[0] as IMatchable),
      Not.wrapInNot(this.elements[2] as IMatchable)
    );

    return {
      necessities: {},
      possibilities: {
        [bothTrue.toString()]: bothTrue,
        [bothFalse.toString()]: bothFalse
      }
    };
  };
}
