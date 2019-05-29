import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { IMatchable, IStateInterface } from "../Token";

export class Formula implements IMatchable {
  public elements: IMatchable[];
  public syntaxmatch: string;
  public className: any;
  public myString?: string;
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    this.elements = elements;
    this.syntaxmatch = syntaxmatch;
    this.className = className;
  }

  public evaluate = (state: IStateInterface): boolean => {
    return true;
  };

  public getVarName = (): string | null => {
    return null;
  };

  public toStringFunction = (): string => {
    return this.elements.reduce(
      (acc: string, element) => acc + element.toString(),
      ""
    );
  };

  public toBeFalse(): INecessitiesAndPossibilities {
    return this.toBeFalseImplementation();
  }

  public toBeFalseImplementation(): INecessitiesAndPossibilities {
    throw new Error("We're in the non-overridden toBeFalseFunc");
  }

  public toBeTrue(): INecessitiesAndPossibilities {
    return this.toBeTrueImplementation();
  }

  public toBeTrueImplementation(): INecessitiesAndPossibilities {
    throw new Error("We're in the non-overridden toBeFalseFunc");
  }

  public getStateDelta(): IStateDelta | null {
    return null;
  }

  public toString = (): string => {
    // We'll memoize our string
    if (!this.myString) {
      this.myString = this.toStringFunction();
    }
    return this.myString;
  };
}
