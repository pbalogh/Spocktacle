// tslint:disable-next-line: no-var-requires
import * as React from "react";
import styles from "./App.module.scss";

import Draggable from "Draggable";
import EvaluationNode from "LogicParser/EvaluationNode";
import { Not } from "LogicParser/formulae/Not";
import LogicParser from "LogicParser/LogicParser";
import NodeComponent from "NodeComponent";
import { IMatchable, IMatchableMap } from "./LogicParser/Token";
import { SentenceInput } from "./SentenceInput";
// import {
//   testEvaluationNode,
//   testJsonTypes,
//   testParserAndOperators
// } from "./tests";
const stringify = require("json-stable-stringify");

(window as any).stringify = stringify;

// TODO: When Using Not.wrapInNot, if it's a complex formula (i.e., not a Variable or a Not), then use parentheses!!

// TODO: When a node wants to see if it is closed, its children array hasn't had all the child nodes pushed on it yet --
// because the child node is evaluating itself before it is pushed onto the array!
// And because of that, it is cascading upward.

export interface IStateDelta {
  [key: string]: boolean;
}

export interface INecessitiesAndPossibilities {
  necessities: IMatchableMap;
  possibilities: IMatchableMap;
}

export interface IJSONofIMatchable {
  elements: string | Array<IJSONofIMatchable | IMatchable>;
  syntaxmatch: string;
  className?: string;
}

interface IAppState {
  sentence: string;
  stateValues: IStateDelta;
  node?: EvaluationNode | null;
}

class App extends React.Component<object, IAppState> {
  public sentences = [
    "(a||!b)&&(!a||b)&&(!a||!b)&&(a||!c)",
    "((A<->B)||B||A)",
    "((p->q)||(r->q))->((p||r)->q)",
    "((A||B)->C)->((A->C)||(B->C))",
    "((A->B)||(C->D))->((A->D)||(C->B))",
    "(!(A->B))->(A)",
    "((A && B) -> C )->( (A -> C) || (B -> C))",
    "((p<->!!q)&&(!q->(r&&!s))&&(s->(p||q)))->((s&&q)->p)"
  ];
  public readonly state = {
    node: null,
    sentence: "((p->q)||(r->q))->((p||r)->q)",
    stateValues: {}
  };

  public componentDidMount() {
    // testJsonTypes();
    // testParserAndOperators();
    // testEvaluationNode();
  }

  public evaluate = (
    sentence: string,
    stateValues: IStateDelta,
    negateIt: boolean = true
  ) => {
    // First we'll set our node to null,
    // to flush out our previous NodeComponent.
    window.scrollTo(0, 0);
    this.setState({ node: null }, () => {
      const root = new LogicParser(sentence, stateValues).getRoot();
      let nodeToActuallyEvaluate = root;
      if (negateIt) {
        nodeToActuallyEvaluate = Not.wrapInNot(root);
      }
      const node = new EvaluationNode(
        { [nodeToActuallyEvaluate.toString()]: nodeToActuallyEvaluate },
        stateValues,
        undefined,
        false
      );
      node.updateStateAndGenerateChildren();
      this.setState({ sentence, stateValues, node });
    });
  };

  public render() {
    const { sentence, stateValues, node } = this.state;
    return (
      <div className={styles.main}>
        <Draggable>
          {node && (
            <NodeComponent
              x={window.innerWidth / 2}
              y={120}
              node={node}
              parent={null}
            />
          )}
        </Draggable>

        <SentenceInput
          sentences={this.sentences}
          evaluate={this.evaluate}
          stateValues={stateValues}
          sentence={sentence}
        />
      </div>
    );
  }
}

export default App;
