import { IStateDelta } from "App";
import * as classRepository from "./classRepository";
import {
  BINARYOPERATOR,
  CLOSEPARENS,
  FORMULA,
  OPENPARENS,
  UNARYOPERATOR,
  VARIABLE
} from "./Constants";
import { Variable } from "./formulae/Variable";
import Pattern from "./Pattern";
import { allKnownTokens, IMatchable, Token } from "./Token";

// TODO: "And" has an interesting thing with toBeFalse().
// I need to be careful, because elements[0] might set up a stateDelta.
// And so might elements 2.

// TODO: Pattern is NOT THE SAME AS A TOKEN!
// It doesn't extend Token, and it doesn't need to!

// Give it different CTOR arguments,
// and give it a getClassName method instead of a classref property.

// Yes, that getClassName method will *return* a classref,
// but it'll (usually) extract it from the matchedTokens.

// TODO: Negation is too big to do in a single recursive pass.
// I really need two things.
// 1. When negating a Formula, what do I get back?
// A scope object for the variables in that Formula?
// Or, sometimes, NOT that. Sometimes I get a new Formula.
// In negating !(A -> B) I would get (A -> B).

// TODO: Shortcut when negating a UNARYOPERATOR Formula!
// If it's a negation operator, just return elements[0]!

// It's in the last pass of negating a specific Formula
// that we would see if it is *capable* of setting variables in scope.

// negating !A would obviously set { A: true }.
// Why? Because for a UNARYOPERATOR, negating it returns a VARIABLE Formula,
// and when you're returning a VARIABLE Formula,
// that in fact gives you vars.
// But, again,

// TODO: Create a negate() function, like value(),
// and have each Pattern define each Pattern's negation function --
// a function that describes what must be true
// for the negation to be true.
//
// For example, starting simply,
// if there's a Variable Formula with a Token whose elements are "A",
// then the negation function should return a state object
// in which that variable is given a false value.

// Or, better, make a setInScope function
// in the logicParser.

// See, a Node in a Tableaux has its own small scope.
// It contains a list of things that must be true,
// some of which are formulae, and some of which are variables.
// !A, B, C -> D, etc.

// It has to be able to create branches from its formulae,
// one by one,
// so it needs an array of Formulae and an internal array of branchedFormulae,
// so that each time it branches a formula it pushes that formula onto branchedFormulae
// to keep track of what work it has already done.

// Each time it creates a branch, it gives that branch a copy of its local state.
// See, that state defines a bunch of variables as true or false.
// And each branch will lead to a new node,
// which will do its own job of creating values for variables in its local state.

// As soon as each node is made, and is told by the function creation it
// what is true and what isn't,
// it has to go through its (revised) local state and compare it to its parent.

// So if the parent had a formula !A,
// then that parent would have set "A" to false in its local state.
// But if that parent also had a formula !(A->B),
// then our new branch node will need to be created with the values {A, !B}

// (Side note: Get negative scope for a material conditional
// means getting an affirmation of the first argument
// and a negation of the second argument.

// Getting the negation of a Variable Formula
// means simply getting an object in which that Variable's name is false.

// Getting the affirmation of a Variable Formula
// means simply getting an object in which that Variable's name is true.

// For any Formula other than a Variable,
// to get the negation or affirmation,
// we return a Union of the key-value pairs of its arguments' scopes
// (either negation or affirmation of each).

// So negation(A->B) would return { "A": false, "B": true }
// by returning union(negate(element[0]), affirm(element[2])).

// (Element 1 is the operator itself.)

/*jslint es6 */

/*
    Once you've got a parse tree, you need a way to evaluate it.
    I.e., know if it is true or false.

    Best way to do this is to define a value() function
    (really a function that maintains, and allows access to,
    a global state lookup table,
    where you create entries for everything that has a known value),
    and pass this in to the top component in your parse tree.

    (This will be of type Formula.)

    Most often, a Formula comprises other elements.
    And most often, each of those elements will be a Formula.

    This means each Formula needs a way to take that state-based value function
    and use it to return its own value.

    In other words: each Formula needs its own function,
    that takes v() as an argument,
    and uses v() to return its own value.

    If a Formula is wrapped around a Variable named "x",
    then its valueFunc would be (v) => v(x).

    In other words: what's my value?
    Well, it's whatever your state function says the value of "x" is,
    since that's my variable.

    ValueFuncs make things a bit confusing.
    A formula needs to know which of its elements is the operator
    and which elements are the arguments to it (if any).

    The pattern is what does this, on a high level.

    But specific operators need to define what their actual function is.
    That has to happen on the Symbol level.
    Right now, I'm using Tokens interchangeably with Symbols
    because there's so little complexity to the logic syntax,
    and by convention the variables have single-character names,
    so it seems overwrought to do an entire pass to tokenize
    and then another pass to create symbols.

    Anyway, for this reason, Tokens are defining their own evaluation function.

    In a nutshell:

    1. A Pattern has a func that takes v() and uses it knowing 
    what the operator is and what the arguments are.

    2. A Token defines a specific value func to be used by any Formula made out of it.


    OK, so here's my dilemma.
    I've got a Formula. To get its value, I need to get the value of each of its elements.

    Base case: it's a Variable, which just returns value(varname).

    Otherwise: elements[0].valueFunc(v),
*/

const patterns = [
  // Since we're a formula, each element in elements[] is a token or formula.
  // The global valuation function v() will handle that.
  new Pattern([VARIABLE], FORMULA, (matches: IMatchable[]) => "Variable"),
  new Pattern(
    [UNARYOPERATOR, FORMULA],
    UNARYOPERATOR,
    (matches: IMatchable[]) => matches[0].className
  ),
  new Pattern(
    [FORMULA, BINARYOPERATOR, FORMULA],
    BINARYOPERATOR,
    (matches: IMatchable[]) => matches[1].className
  ),
  new Pattern(
    [OPENPARENS, FORMULA, CLOSEPARENS],
    FORMULA,
    (matches: IMatchable[]) => "Parenthetical"
  )
];

const defaultState = {
  A: true,
  B: false
};

export default class LogicParser {
  public formulae: IMatchable[];
  public foundAMatch: boolean = false;
  constructor(public sentence: string, state: IStateDelta = defaultState) {
    const cleanSentence = sentence.toUpperCase().replace(/\s/g, "");
    const tokens = this.tokenizeSentence(cleanSentence);
    console.log("Done, and tokens is ", tokens);
    console.log("-------------------");
    this.formulae = this.parseTokensAndFormulae(tokens);
    console.log("this.formulae are ", this.formulae);

    console.log(
      ">>>>>> this.formulae[0].evaluate() is ",
      this.formulae[0].evaluate(state)
    );
  }

  public getRoot() {
    if (this.formulae.length > 1) {
      const explanation = "Couldn't parse sentence " + this.sentence;
      throw new Error(explanation);
    }
    return this.formulae[0];
  }

  /**
   * We want to get either true or false from this Formula,
   * in order to build a tableau.
   * There are various rules.
   *
   * For A AND B to be false, there are two possibly-true axioms:
   * either A is false, or B is false.
   * (We would use those to make branches.)
   *
   * For A AND B to be true, there are NO possibilities
   * and two necessarily true axioms:
   * A is true, B is true.
   *
   * What does it mean to say we have an axiom that A must be false?
   * I guess it means a NOT Formula wrapped around A.
   *
   * And I'm thinking once we have our necessities and possibilities,
   * we need to do a pass to look at them and see what they mean:
   * necessities *can* set the scope in the existing node.
   * NOT-A, if A is a Variable Formula, does set "A":false in the scope
   * of the *current* Evaluation Node.
   *
   * NOTE: Whenever we set the value of a variable in the Evaluation Node's scope,
   * we must *first* check for contradictions with *existing* variables in the scope.
   * If there's a contradiction, then this Evaluation Node is CLOSED.
   * We can stop right then and there.
   *
   * If there are no contradictions, then we prepare for the next level of Evaluation Nodes.
   * We'll be handing down to each of them an array of Necessities.
   *
   * Here's the kicker: if there are possibilities, we hand one to each of our child Nodes.
   * It is handed down as a Necessity.
   * We also hand a copy of our scope to each child node.
   *
   * Now the child node has to go through the array of necessities
   * and figure out what *new* necessities and possibilities they entail.
   *
   * So: An EvaluationNode takes a scope and an array of necessarily true formualae.
   * First: it clones its scope, to give to its kids.
   * Then it cycles through its necessities, one by one.
   * For each, it gets an array of necessities and possibilities.
   * It checks each of these child-necessities to see if it evaluates to a terminal.
   * If so, it checks to see if any of those terminals violate its scope values.
   *
   * If so: TERMINATE. Closed. Finito. And you know the reason why.
   *
   * If not: add it to the scope you've cloned for your kids.
   *
   * If a given necessity doesn't violate scope, or isn't a terminal,
   * then push it onto your next-gen necessity.
   *
   */

  public parseTokensAndFormulae(tokens: Token[]) {
    if (tokens.length === 0) {
      return [];
    }

    let remainingTokens = [...tokens];

    do {
      this.foundAMatch = false;
      for (const pattern of patterns) {
        // We want to keep applying the pattern
        // for as long as it is fruitful.

        remainingTokens = this.substitutePatternInSentence(
          pattern,
          remainingTokens
        );
      }
    } while (this.foundAMatch && remainingTokens.length > 1);

    return remainingTokens;
  }

  /**
   *
   * @param {tokens}
   * This function takes an array of tokens-or-formulae,
   * and returns an array of tokens-or-formulae.
   * When successful, it should replace at least one token with at least one formula.
   * (Some formulae encompass more than one token-or-formula object,
   * so you might replace 3 token-or-formula objects
   * with a single new formula object.)
   *
   * NOTE: Not every pattern will be found in every possible sentence of tokens, of course.
   */
  public substitutePatternInSentence(
    pattern: Pattern,
    tokens: Token[]
  ): Token[] {
    // The design here is that we recurse.
    // It's straight out of The Little Schemer.
    // We return the match on the first character concat
    // with the match on the *rest* of the characters.
    if (tokens.length === 0) {
      return [];
    }
    const matchedTokens = [];
    let matchedPattern;
    for (let i = 0; i < pattern.elements.length; i++) {
      // what if the pattern happens to be longer than the sentence of tokens??
      // It's literally impossible for this pattern to match.
      if (i >= tokens.length) {
        return tokens;
      }
      // If we hit a tokenOrFormula that doesn't match our pattern,
      // we know this isn't a match.
      // So we'll make a return-array with the first token at its lead,
      // and append to it an attempted match with the *rest* of our sentence.
      if (tokens[i].syntaxmatch !== pattern.elements[i]) {
        return [
          tokens[0],
          ...this.substitutePatternInSentence(pattern, tokens.slice(1))
        ];
      } else {
        matchedPattern = pattern;
        matchedTokens.push(tokens[i]);
      }
    }

    // Still here? Then congrats! We matched the whole pattern!
    this.foundAMatch = true;
    // elements, syntaxmatch, valueFunc
    // TODO: We need to get the classname from our token here.
    // And make sure it gets passed into our formula,
    // so that "!!A" does make Not -> Not ->

    if (!matchedPattern) {
      return [];
    }

    // A Pattern's classref is a function,
    // because the class for a pattern is different depending on which pattern it is.
    // !A is UNARYOPERATOR, FORMULA -- so it needs to get the classref from the first object.
    const className: string = matchedPattern.getClassName(matchedTokens);

    console.log("className is ", className);

    const formula = new classRepository[className](
      matchedTokens,
      matchedPattern.syntaxmatch,
      className
    );

    const remainingTokensFromMatch = tokens.slice(matchedTokens.length);

    return [
      formula,
      ...this.substitutePatternInSentence(pattern, remainingTokensFromMatch)
    ];
  }

  public tokenizeSentence(sentence: string): Token[] {
    // Again, the design here is that we recurse.
    // It's straight out of The Little Schemer.
    // We return the match on the first character
    // at the front of our array,
    // and the rest of the array
    // is the match on the *rest* of the characters.

    // Recursion needs a base case.
    // Here, if we're done (the sentence is empty), don't recurse any more!
    if (sentence.length < 1) {
      return [];
    }
    console.log("In tokenizeSentence, sentence is ", sentence);

    let matchedToken: Token;
    let restOfSentence: string;

    for (const token of allKnownTokens) {
      // We only care if we're matching the front of the sentence.
      const stringToMatch: string =
        typeof token.elements === "string" ? token.elements : "#";
      if (sentence.indexOf(stringToMatch) === 0) {
        matchedToken = new Token(
          sentence.slice(0, token.elements.length),
          token.syntaxmatch,
          token.className
        );
        restOfSentence = sentence.substring(token.elements.length);
        // Here it is: one array, with our (known) match up front
        // and our (unknown) future matches following.
        return [matchedToken, ...this.tokenizeSentence(restOfSentence)];
      }
    }
    // This is an interesting thing -- we didn't match any of our tokens.
    // Since our convention is that a variable name can only be one character long,
    // we can safely make the assumption
    // that the unmatchable character at the front of our sentence
    // was a variable name.

    matchedToken = new Token(sentence.charAt(0), VARIABLE, Variable);
    restOfSentence = sentence.substring(1);
    // Here it is: one array, with our (known) match up front
    // and our (unknown) future matches following.
    return [matchedToken, ...this.tokenizeSentence(restOfSentence)];
  }
}
