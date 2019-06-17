import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { FORMULA, UNARYOPERATOR } from "../Constants";
import { IMatchable, IMatchableMap, IStateInterface, Token } from "../Token";
import { ModalOperator } from "./ModalOperator";
import { Not } from "./Not";
import { SomeWorlds } from "./SomeWorlds";

export class AllWorlds extends ModalOperator {
  public static AllWorldsToken = new Token(
    /^\[\]/,
    UNARYOPERATOR,
    "AllWorlds",
    "[]"
  );
  public static wrapInAllWorlds(formula: IMatchable): AllWorlds {
    // Here's the funny thing:
    // if we're wrapping a Not object in another Not,
    // we should really just return that Not object's content, no?
    // Well, for now, let it lie.
    return new AllWorlds(
      [AllWorlds.AllWorldsToken, formula],
      FORMULA,
      "AllWorlds"
    );
  }
  constructor(elements: IMatchable[], syntaxmatch: string, className: string) {
    super(elements, FORMULA, "AllWorlds");
  }
  public toBeFalseImplementation = (): INecessitiesAndPossibilities => {
    // If it is not true that AllWorlds have something,
    // then it must be true that some worlds lack that thing.
    //
    // I.e., ![]A must mean that A is false somewhere, or <>!A
    //
    const necessities: IMatchableMap = {};

    const not = SomeWorlds.wrapInSomeWorlds(
      Not.wrapInNot(this.elements[1] as IMatchable)
    );
    necessities[not.toString()] = not;

    return {
      necessities,
      possibilities: {}
    };
  };

  public getNewWorldVersion = (): IMatchable => this.elements[1];

  public evaluate = (state: IStateInterface): boolean => {
    return !(this.elements[1] as IMatchable).evaluate(state);
  };

  public toBeTrueImplementation = (): INecessitiesAndPossibilities => {
    return (this.elements[1] as IMatchable).toBeTrue();
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
