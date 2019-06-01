import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { BLACK, GREEN, RED } from "NodeComponent";
import { IMatchable, IMatchableMap, IStateInterface } from "./Token";

interface IHashMapOfVariablesToNecessities {
  [varname: string]: IMatchable;
}

export default class EvaluationNode {
  public mapOfVariablesToNecessitiesThatSetThem: IHashMapOfVariablesToNecessities = {};
  public readonly state: IStateInterface;
  public children: EvaluationNode[];
  public variableThatViolatesState?: string;
  public futureStateViolations: IStateDelta = {};
  public stateViolations: IStateDelta = {};
  public overallColor = BLACK;
  public closed: boolean = false;
  public isModal: boolean = false;
  public worldNumber: number = 0;
  constructor(
    public necessities: IMatchableMap,
    state: IStateInterface,
    public parent?: EvaluationNode,
    public immediateMode: boolean = true
  ) {
    this.children = [];
    this.state = { ...state };
    if (immediateMode) {
      this.updateStateAndGenerateChildren();
    }
  }

  public toString = () => Object.keys(this.necessities).join();

  public respondToStateViolation(variableName: string) {
    this.stateViolations[variableName] = true;
    this.overallColor = RED;
    this.closed = true;
    this.checkIfIAmClosed();
    // Tell our parent that one of their state requirements
    // will be violated by a descendent.
    // (This way, they can highlight it so that the user can see where the problem started.)
    if (this.parent) {
      this.parent.respondToFutureStateViolation(variableName);
    }
  }

  public checkIfIAmClosed = () => {
    // Now let's see if our node is closed.

    if (this.children.length > 0) {
      this.closed = true;
      for (const child of this.children) {
        if (!child.closed) {
          this.closed = false;
          break;
        }
      }
    }
    if (this.parent) {
      this.parent.checkIfIAmClosed();
    }
  };

  public respondToFutureStateViolation(variableName: string) {
    this.futureStateViolations[variableName] = true;
    this.overallColor = GREEN;
    this.checkIfIAmClosed();
    if (this.parent) {
      this.parent.respondToFutureStateViolation(variableName);
    }
  }

  public checkForStateViolation = (stateDelta: IStateDelta): string | null => {
    for (const key of Object.keys(stateDelta)) {
      if (this.state.hasOwnProperty(key)) {
        if (stateDelta[key] !== this.state[key]) {
          this.respondToStateViolation(key);
          return key;
        }
      } else {
        // Our current state doesn't know or care about this variable.
        // But we should now set it so that it DOES.
        this.state[key] = stateDelta[key];
      }
    }
    this.checkIfIAmClosed();
    return null;
  };

  public rememberWhichNecessitySetWhichVariables(
    stateDelta: IStateDelta,
    necessity: IMatchable
  ) {
    for (const key of Object.keys(stateDelta)) {
      this.mapOfVariablesToNecessitiesThatSetThem[key] = necessity;
    }
  }

  public getNecessitiesThatDoNotDirectlyUpdateState = (): IMatchableMap => {
    const necessitiesThatDoNotDirectlyUpdateState: IMatchableMap = {};
    for (const matchable of Object.values(this.necessities)) {
      const necessitatedStateDelta: IStateDelta | null = (matchable as IMatchable).getStateDelta();
      if (necessitatedStateDelta !== null) {
        const variableThatViolatesState = this.checkForStateViolation(
          necessitatedStateDelta
        );
        if (variableThatViolatesState) {
          this.variableThatViolatesState = variableThatViolatesState;
          return {};
        }
      } else {
        necessitiesThatDoNotDirectlyUpdateState[
          matchable.toString()
        ] = matchable;
      }
    }
    return necessitiesThatDoNotDirectlyUpdateState;
  };

  public updateStateAndGenerateChildren() {
    // Necessities that update state directly are
    // different from those that don't, in fundamental ways.
    // We want to use them to update our state,
    // while checking to see if they violate EXISTING state.
    //
    // And we don't want to pass them down to our children as necessities,
    // since after all, they're really embodied in the state we'll pass on.
    //

    const necessitiesThatDoNotDirectlyUpdateState = this.getNecessitiesThatDoNotDirectlyUpdateState();

    if (Object.keys(necessitiesThatDoNotDirectlyUpdateState).length === 0) {
      console.warn(
        "There are no more necessities left to prove and this.variableThatViolatesState is " +
          this.variableThatViolatesState
      );
      return;
    }

    // Now I want to pick a necessity to break down into ITS necessities and probabilities.
    // Ideally, one without any probabilities would be best!

    let formulaToResolveForMyChildren: IMatchable;

    // First see if there's a nice, simple one that gives us only necessities.
    // Since possibilities require us to make multiple branches, each with a child,
    // it's easiest to deal with necessity-only formulae first.

    const formulaWithoutPossibilities = this.getNecessityWithoutPossibilities(
      necessitiesThatDoNotDirectlyUpdateState
    );

    if (formulaWithoutPossibilities !== null) {
      formulaToResolveForMyChildren = formulaWithoutPossibilities;
    } else {
      formulaToResolveForMyChildren = Object.values(
        necessitiesThatDoNotDirectlyUpdateState
      )[0] as IMatchable;
    }

    // Whichever formula we plucked,
    // delete it from the payload we're passing on,
    // because we're going to break it down into its OWN necessities and probabilities
    // and use those to generate new sets of necessities for each of our children
    //
    delete necessitiesThatDoNotDirectlyUpdateState[
      formulaToResolveForMyChildren.toString()
    ];

    let newNecessitiesAndProbabilitiesForChildren: INecessitiesAndPossibilities;

    newNecessitiesAndProbabilitiesForChildren = formulaToResolveForMyChildren.toBeTrue();

    // Now combine the necessities we already had
    // with the ones we got from that child
    const necessitiesForAllChildren = {
      ...necessitiesThatDoNotDirectlyUpdateState,
      ...newNecessitiesAndProbabilitiesForChildren.necessities
    };

    // If there are no possibilities, then we only need one kid
    if (
      Object.keys(newNecessitiesAndProbabilitiesForChildren.possibilities)
        .length === 0
    ) {
      const newNode = new EvaluationNode(
        necessitiesForAllChildren,
        { ...this.state },
        this,
        false
      );
      this.children = [newNode];
      newNode.updateStateAndGenerateChildren();
    } else {
      // Because there are possibilities, we need multiple children.
      // Our tableau must branch.
      // So cycle through our possibilities,
      // and give each one to a child
      // (by adding it to the mandatory necessities, and then passing that set to a new child as its necessities)
      this.children = [];

      for (const matchable of Object.values(
        newNecessitiesAndProbabilitiesForChildren.possibilities
      )) {
        const necessitiesForThisChild = {
          ...necessitiesForAllChildren,
          [matchable.toString()]: matchable
        };

        const newChildNode = new EvaluationNode(
          necessitiesForThisChild,
          { ...this.state },
          this,
          false
        );
        this.children.push(newChildNode);
        newChildNode.updateStateAndGenerateChildren();
      }
    }
  }

  public howManyNodesWideIAm = (): number => {
    if (this.children.length === 0) {
      return 1;
    }
    return this.children.reduce(
      (acc, child) => acc + child.howManyNodesWideIAm(),
      0
    );
  };

  public makeNewNecAndProb = (
    necessities: IMatchableMap,
    possibilities: IMatchableMap
  ): INecessitiesAndPossibilities => ({
    necessities,
    possibilities
  });

  public getNecessityWithoutPossibilities = (
    necessitiesThatDoNotDirectlyUpdateState: IMatchableMap
  ): IMatchable | null => {
    for (const matchable of Object.values(
      necessitiesThatDoNotDirectlyUpdateState
    )) {
      if (
        Object.keys((matchable as IMatchable).toBeTrue().possibilities)
          .length === 0
      ) {
        return matchable as IMatchable;
      }
    }
    return null;
  };
}

/*

May 23, ride to work

Realize that I should be memoizing my toBeFalse and toBeTrue results for each Formula.
This was a good part of having a toBeFalse() and toBeTrue() parent class method
that calls the implementation-specific toBeFalseImplementation and toBeTrueImplementation

Unfortunately, that creates a problem!

If your toBeFalse() list of Formulae (necessities and probabilities) is now
one of your properties,
It's possible that one of the Formulae contained in there is, well, you.

And stringify will barf on the circular reference.

It's Variable that's the culprit! A lot of "this" in its necessities...

May 22, ride home

Did parentheses, Then, and Iff. Started creating EvaluationNode.

Discovered that I had the wrong syntaxmatch for And and Then nodes -- should present themselves
as FORMULA, but they were still persisting in thinking of themselves as BINARYOPERATORS.













May 22, noon

So I've gotten to the point where I can get the necessities and possibilities for anything to be true.

TODO: Implement and test parentheses!

TODO: Implement and test Then.

TODO: Implement and test Iff.

TODO: Get this going with the rules for the material conditional (if->then)!

TODO: Also do material equivalence! ≡ or iff!

Note that in the case of ≡ (iff) you'll have two possibilities,
each of which will have multiple necessities!

To handle this: create wrapInAnd(), so that I can mandate the truth of them.

So A≡B creates two possibilities:

A AND B         !A AND !B

each of which will yield necessities:

A, B                !A, !B

And then, when I cycle through necessities, I will catch the proposed state changes.



CYCLING THROUGH NECESSITIES

Whenever I ask a formulae to give me the sentence(s) that will make it true,
there is the possibility that the sentence(s) will entail the definition of a variable in my state.

For example, if a sentence(s) requires that "!A" is true,
then I know I must setState({A:false}).

So what's good about this is that:

I can always just cycle through my necessities,
call getDeltaState() on each one,
and if I get a non-null response,
I know I can apply it to my current state to get my next state!

(The one I'll pass on to my branches.)

And when "applying" those deltaStates to my current state,
I will check for conflicts.

That will allow me to flag any necessity that violates my state's definitions!


HOW THESE GET USED TO DO PROOFS.

So I guess I need an EvaluationNode.
It receives an initial state and an array of necessities.

(Of course, to find contradictions, my very FIRST EvaluationNode should receive one sentence wrapped in a NOT!)

So if my sentence is A->B, what my first EvaluationNode will get is [!(A->B)],

and toBeTrue() on that will give me A->B.toBeFalse(),

which will give me the two necessities:

A and !B.

The EvaluationNode is the class that receives a state and an array of necessities,
calls getDeltaState() on all those necessities (to update state and detect contradictions),
pops off the first necessity,
calls toBeTrue() on it to get MORE necessities and possibilities,
and then, if all is good,

1. No possibilities. Creates a new EvaluationNode with the old necessities array (minus that popped-first-one)
+ the new necessities that the popped-first-one created.

2. Possibilities. Pop them, and for each, make a new necessities array by adding that "possibility" to a clone of
our old necessities array (minus that popped-first-one). Then make a new EvaluationNode with that array.

Always, when making a child node, pass down a clone of your current state.




ONE IMPORTANT NOTE ON CYCLING THROUGH NECESSITIES:

I should first filter them by whether or not getDeltaState() returns anything useful!
Because those I can act on immediately, put them in my state, and don't pass them on.

Secondarily, I should sort them so that the ones without possibilities are first.

OK, so each EvaluationNode really doesn't "cycle through" necessities.

It DOES cycle through all the ones that yield a real getDeltaState(), so it can remove them.

Then it pops off the first necessity and gets ITS toBeTrue() data.



The EvaluationNodes' ctor should receive a flag telling it if we're in immediateMode or not.

If so, call evaluate() once you're made.

If not, then wait for a GUI action to call evaluate() on you.




May 22, AM

I'll put a getStateDelta() function on Formula, and it'll default to returning an empty set.

Very simple!

Except, what if I'm asking an AND what its necessities are to be true?

I guess it returns its element 0 and element 2.

What about toBeFalse?

Its possibilities are... a new NOT Formula wrapped around element 0, and a new NOT Formula wrapped around element 2?

OK... this works, at least. We're not descending through a series of toBeFalse() calls and toBeTrue() calls.

And my getStateDelta() implementation on NOT will allow me to recognize when it's asking for a stateDelta!

So here's an interesting dilemma.

.toBeFalse() means "Give me the formula that would be true if this sentence were false."

*/
