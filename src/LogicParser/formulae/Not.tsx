import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { FORMULA, UNARYOPERATOR } from "../Constants";
import { IMatchable, IStateInterface, Token } from "../Token";
import { Formula } from "./Formula";

export class Not extends Formula {
  public static NotToken = new Token("!", UNARYOPERATOR, "Not");
  public static wrapInNot(formula: IMatchable): Not {
    // Here's the funny thing:
    // if we're wrapping a Not object in another Not,
    // we should really just return that Not object's content, no?
    // Well, for now, let it lie.
    return new Not([Not.NotToken, formula], FORMULA, "Not");
  }
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "Not");
  }
  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    return (this.elements[1] as IMatchable).toBeTrue();
  };

  public evaluate = (state: IStateInterface): boolean => {
    return !(this.elements[1] as IMatchable).evaluate(state);
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    return (this.elements[1] as IMatchable).toBeFalse();
  };

  public getStateDelta(): IStateDelta | null {
    const childStateDelta = (this.elements[1] as IMatchable).getStateDelta();

    if (childStateDelta) {
      for (const key of Object.keys(childStateDelta)) {
        childStateDelta[key] = !childStateDelta[key];
      }
    }
    return childStateDelta;
  }
}
