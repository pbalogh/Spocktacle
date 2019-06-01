import { INecessitiesAndPossibilities } from "App";
import { FORMULA, UNARYOPERATOR } from "../Constants";
import { IMatchable, IMatchableMap, IStateInterface, Token } from "../Token";
import { AllWorlds } from "./AllWorlds";
import { ModalOperator } from "./ModalOperator";
import { Not } from "./Not";

export class SomeWorlds extends ModalOperator {
  public static SomeWorldsToken = new Token("<>", UNARYOPERATOR, "SomeWorlds");
  public static wrapInSomeWorlds(formula: IMatchable): SomeWorlds {
    // Here's the funny thing:
    // if we're wrapping a Not object in another Not,
    // we should really just return that Not object's content, no?
    // Well, for now, let it lie.
    return new SomeWorlds(
      [SomeWorlds.SomeWorldsToken, formula],
      FORMULA,
      "SomeWorlds"
    );
  }
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "SomeWorlds");
  }
  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    // If it is not true that SomeWorlds have something,
    // then it must be true that AllWorlds lack that thing.
    //
    // I.e., !<>A must mean that A is false everywhere, or []!A
    //
    const necessities: IMatchableMap = {};

    const not = AllWorlds.wrapInAllWorlds(
      Not.wrapInNot(this.elements[1] as IMatchable)
    );
    necessities[not.toString()] = not;

    return {
      necessities,
      possibilities: {}
    };
  };

  public evaluate = (state: IStateInterface): boolean => {
    return !(this.elements[1] as IMatchable).evaluate(state);
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    return (this.elements[1] as IMatchable).toBeTrue();
  };
}
