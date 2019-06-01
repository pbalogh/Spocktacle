import { Formula } from "./Formula";

// I'm defining this just so I can easily tell
// if an operator is modal or not!

export class ModalOperator extends Formula {
  public isModal: boolean = true;
}
