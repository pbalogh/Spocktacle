import { IMatchable } from "./Token";

export default class Pattern {
  constructor(
    public elements: string[],
    public syntaxmatch: string,
    public classreffunction: any
  ) {}

  public getClassName = (elements: IMatchable[]): string => {
    return this.classreffunction(elements);
  };
}
