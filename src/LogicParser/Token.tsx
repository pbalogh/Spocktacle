import {
  IJSONofIMatchable,
  INecessitiesAndPossibilities,
  IStateDelta
} from "App";
import {
  BINARYOPERATOR,
  CLOSEPARENS,
  OPENPARENS,
  UNARYOPERATOR
} from "./Constants";

export interface IMatchable {
  className: string;
  elements: string | IMatchable[];
  syntaxmatch: string;
  toString(): string;
  getVarName(): string | null;
  evaluate(state: object): boolean;
  toBeFalse(): INecessitiesAndPossibilities;
  toBeTrue(): INecessitiesAndPossibilities;
  getStateDelta(): IStateDelta | null;
}

export interface IMatchableMap {
  [key: string]: IMatchable | IJSONofIMatchable;
}

export type MatchableArgs = [IMatchable[], string, any];

export interface IStateInterface {
  [key: string]: boolean;
}

export class Token implements IMatchable {
  public elements: string;
  public syntaxmatch: string;
  public className: any;
  constructor(elements: string, syntaxmatch: string, className: any) {
    this.elements = elements;
    this.syntaxmatch = syntaxmatch;
    this.className = className;
  }

  public evaluate = (state: IStateInterface) => false;

  public getVarName = (): string | null => {
    return this.elements;
  };

  public toString = (): string => {
    return this.elements;
  };

  public toBeFalse(): INecessitiesAndPossibilities {
    throw new Error("We're in the non-overridden toBeFalseFunc");
  }

  public toBeTrue(): INecessitiesAndPossibilities {
    throw new Error("We're in the non-overridden toBeTrueFunc");
  }

  public getStateDelta() {
    return null;
  }
}

export const allKnownTokens: Token[] = [
  new Token("->", BINARYOPERATOR, "Then"),
  new Token("<->", BINARYOPERATOR, "Iff"),
  new Token("(", OPENPARENS, "Formula"),
  new Token(")", CLOSEPARENS, "Formula"),
  new Token("!", UNARYOPERATOR, "Not"),
  new Token("AND", BINARYOPERATOR, "And"),
  new Token("&&", BINARYOPERATOR, "And"),
  new Token("OR", BINARYOPERATOR, "Or"),
  new Token("||", BINARYOPERATOR, "Or")
];
