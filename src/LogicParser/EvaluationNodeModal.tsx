// TODO: The same way we split branches for possibilities,
// we need to have multiple worlds as children whenever there are possibilities.

// Put more bluntly:
// We need to gather ALL of our SomeWorlds operators,
// and cycle through them, making a new branch for each,
// and push all of those branches onto our children array.

// I can use formula.className for reflection in this. It'll be "SomeWorlds".

// This may be why splitting on SomeWorlds (via a possibleWorlds array)
// is the last thing I should do, chronologically.

import { INecessitiesAndPossibilities, IStateDelta } from "App";
import { BLACK } from "NodeComponent";
import EvaluationNode from "./EvaluationNode";
import { IMatchable, IMatchableMap, IStateInterface } from "./Token";

interface IHashMapOfVariablesToNecessities {
  [varname: string]: IMatchable;
}

export default class EvaluationNodeModal extends EvaluationNode {
  public mapOfVariablesToNecessitiesThatSetThem: IHashMapOfVariablesToNecessities = {};
  public readonly state: IStateInterface;
  public children: EvaluationNodeModal[];
  public variableThatViolatesState?: string;
  public futureStateViolations: IStateDelta = {};
  public stateViolations: IStateDelta = {};
  public overallColor = BLACK;
  public closed: boolean = false;
  public isModal: boolean = true;
  constructor(
    public necessities: IMatchableMap,
    state: IStateInterface,
    public parent?: EvaluationNodeModal,
    public immediateMode: boolean = true,
    public worldNumber = 0
  ) {
    super(necessities, state, parent, immediateMode);

    this.children = [];
    this.state = { ...state };
    if (immediateMode) {
      this.updateStateAndGenerateChildren();
    }
  }

  public toString = () => Object.keys(this.necessities).join();

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
    // Modals are a bit different from propositional EvaluationNodes.

    // They evaluate their necessities in different ways,
    // and include/exclude formulae from children based on the concept of worlds.

    // We do want to start with necessities that don't update state,
    // and with ones that don't contain possibilities. That is the same.

    // We also want to apply Not before we apply modals. That's also true.
    // Let's broaden that to say: non-modals before modals.

    // BUT: Before we apply modals, we first have to see if we can CONVERT
    // any of our existing formulae to modals.

    // !􏰏A becomes <>!A
    // !<>A becomes []!A

    // HERE'S THE DIFFERENCE IN A NUTSHELL:
    // When we use a modal operator to create a child, we are creating a new world!

    // Creating a new world obligates us to process ALL our modals.

    // When creating a new child world, we have to see if any of our Formulae are AllWorlds.
    // If they are, we have to pluck out their guts and add them to our child's necessities.

    // In other words: If one of our necessities is []F, then any child world we create
    // must include F as a necessity.

    // THE BIG DIFFERENCE: There is a difference between creating a new branch
    // and a new World.

    // A new World just means that our modal necessities all need to be processed before being passed on.

    // When do we create a new world? Whenever we have a necessary formula that is SomeWorlds.

    // So we create a new world, and pass into it that one SomeWorlds formula,
    // along with all the necessities we have that are
    // either AllWorlds or non modal.

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
      const allSomeWorldsOperators: IMatchableMap | null = this.findAllSomeWorldsOperators(
        necessitiesThatDoNotDirectlyUpdateState
      );
      if (allSomeWorldsOperators === null) {
        formulaToResolveForMyChildren = Object.values(
          necessitiesThatDoNotDirectlyUpdateState
        )[0] as IMatchable;
      } else {
        alert("We are here obliged to deal with our possible worlds");
        return;
      }
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

    // OK, this is where the rubber hits the road!

    // If this is a modal operator, we need to make a new world.

    let newWorldNumber = this.worldNumber;

    if (formulaToResolveForMyChildren.isModal) {
      alert(
        "Remember: when going to a new world, pluck the guts out of AllWorlds nodes...This is modal!" +
          formulaToResolveForMyChildren.toString()
      );
      newWorldNumber = this.worldNumber + 1;
    }

    // Here's where we do the plucking!
    // getNewWorldVersion() removes the guts from AllWorlds operators
    newNecessitiesAndProbabilitiesForChildren = formulaToResolveForMyChildren.toBeTrue();

    // Now combine the necessities we already had
    // with the ones we got from that child
    let necessitiesForAllChildren = {
      ...necessitiesThatDoNotDirectlyUpdateState,
      ...newNecessitiesAndProbabilitiesForChildren.necessities
    };

    if (newWorldNumber !== this.worldNumber) {
      // Here's where we do the plucking!
      // getNewWorldVersion() removes the guts from AllWorlds operators
      const modalNecessities = {};
      for (const key of Object.keys(necessitiesForAllChildren)) {
        modalNecessities[key] = (necessitiesForAllChildren[
          key
        ] as IMatchable).getNewWorldVersion();
      }
      necessitiesForAllChildren = modalNecessities;
    }

    // If there are no possibilities, then we only need one kid
    if (
      Object.keys(newNecessitiesAndProbabilitiesForChildren.possibilities)
        .length === 0
    ) {
      const newNode = new EvaluationNodeModal(
        necessitiesForAllChildren,
        { ...this.state },
        this,
        false,
        newWorldNumber
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

        const newChildNode = new EvaluationNodeModal(
          necessitiesForThisChild,
          { ...this.state },
          this,
          false,
          newWorldNumber
        );
        this.children.push(newChildNode);
        newChildNode.updateStateAndGenerateChildren();
      }
    }
  }

  public makeNewNecAndProb = (
    necessities: IMatchableMap,
    possibilities: IMatchableMap
  ): INecessitiesAndPossibilities => ({
    necessities,
    possibilities
  });

  public findAllSomeWorldsOperators = (
    necessitiesThatDoNotDirectlyUpdateState: IMatchableMap
  ): IMatchableMap | null => {
    const results: IMatchableMap = {};
    for (const matchable of Object.values(
      necessitiesThatDoNotDirectlyUpdateState
    )) {
      if (matchable.className === "SomeWorlds") {
        results[(matchable as IMatchable).toString()] = matchable;
      }
    }
    if (Object.values(results).length > 0) {
      return results;
    }
    return null;
  };

  public getNecessityWithoutPossibilities = (
    necessitiesThatDoNotDirectlyUpdateState: IMatchableMap
  ): IMatchable | null => {
    for (const matchable of Object.values(
      necessitiesThatDoNotDirectlyUpdateState
    )) {
      // Let's see if there's a map of things that need to be true.
      // For example, a Variable will return a map of necessities containing its name
      // and an empty object for its possibilities.
      //
      // If it has no possibilities, then it's good.
      if (
        Object.keys((matchable as IMatchable).toBeTrue().possibilities)
          .length === 0
      ) {
        if (matchable.className === "SomeWorlds") {
          alert(
            "we have possibilities because it's a SomeWorld:" +
              matchable.toString()
          );
          return null;
        }
        return matchable as IMatchable;
      }
    }
    return null;
  };
}
