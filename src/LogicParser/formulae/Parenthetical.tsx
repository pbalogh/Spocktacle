import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { IMatchable, IStateInterface } from "../Token";
import { Formula } from "./Formula";

export class Parenthetical extends Formula {
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, syntaxmatch, "Formula");
  }

  public evaluate = (state: IStateInterface): boolean => {
    return (this.elements[1] as IMatchable).evaluate(state);
  };

  public getVarName = (): string | null => {
    return (this.elements[1] as IMatchable).getVarName();
  };

  public toStringFunction = (): string => {
    return "(" + this.elements[1].toString() + ")";
  };

  public toBeFalseImplementation(): INecessitiesAndPossibilities {
    return (this.elements[1] as IMatchable).toBeFalse();
  }

  public toBeTrueImplementation(): INecessitiesAndPossibilities {
    return (this.elements[1] as IMatchable).toBeTrue();
  }

  public getStateDelta(): IStateDelta | null {
    return (this.elements[1] as IMatchable).getStateDelta();
  }
}
