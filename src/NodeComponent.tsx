// TODO: REMEMBER THAT EACH NODE CENTERS ITS OWN STUFF.
// So when there is one child, that child's X is 0!
// The line should also go to 0!
// It's only when we have multiple children that we need a negative number for childStartingX.

import EvaluationNode from "LogicParser/EvaluationNode";
import { IMatchable, IMatchableMap } from "LogicParser/Token";
import React from "react";
// import styles from "./App.module.scss";

export const RED = "red";
export const GREEN = "green";
export const BLACK = "black";

interface INodeComponentProps {
  x: number;
  y: number;
  node: EvaluationNode;
  parent: NodeComponent | null;
}

interface INodeComponentState {
  leftOffsets: {
    [key: string]: number;
  };
  expanded: boolean;
  parent: NodeComponent | null;
  childWidths: { [nodeString: string]: number };
  closed: boolean;
}

const NODEWIDTH = 300;
const NODEHEIGHT = 22;
const VERTICAL_DISTANCE = 60;
const GUTTER = 20;

export default class NodeComponent extends React.Component<
  INodeComponentProps,
  INodeComponentState
> {
  public elementref: { [key: string]: SVGTextElement | null } = {};
  public textWidth: number = 0;
  constructor(props: INodeComponentProps) {
    super(props);
    this.state = {
      childWidths: {},
      closed: false,
      expanded: false,
      leftOffsets: {},
      parent: props.parent
    };
  }

  public setChildWidth = (width: number, nodeString: string): void => {
    this.setState(
      ({ childWidths: oldChildWidths }) => ({
        childWidths: { ...oldChildWidths, [nodeString]: width }
      }),
      this.updateMyWidth
    );
  };

  public updateMyWidth = () => {
    const { childWidths, expanded } = this.state;
    const { node, parent } = this.props;

    if (parent) {
      if (expanded) {
        const totalWidths = Object.values(childWidths).reduce(
          (acc, child) => acc + child + GUTTER,
          -GUTTER
        );
        parent.setChildWidth(
          Math.max(this.textWidth, totalWidths),
          node.toString()
        );
      } else {
        parent.setChildWidth(this.textWidth, node.toString());
      }
    }
  };

  public componentDidMount = () => {
    const { node } = this.props;
    this.updateTextWidth();
    // setTimeout(() => {
    // node.checkIfIAmClosed();
    this.setState({ closed: node.closed });
    // }, 100);
  };

  public updateTextWidth = () => {
    // Make a lookup table for the left offsets for each necessity.
    // Since they can be of different widths,
    // the left edge of each should be a different distance from our center.
    const { leftOffsets } = this.state;
    this.textWidth = 0;
    for (const textbox of Object.values(this.elementref)) {
      const width = (textbox as SVGTextElement).getBBox().width;
      leftOffsets[(textbox as SVGTextElement).textContent as string] =
        -width / 2;
      if (width > this.textWidth) {
        this.textWidth = width;
      }
    }

    this.setState(
      {
        leftOffsets
      },
      this.updateMyWidth
    );
  };

  public getColorShowingStateViolation = (necessity: IMatchable): string => {
    // A necessity may mandate a change to state.
    // For example, if a necessity is that "!A" is true,
    // then this necessity places a strict requirement upon our state:
    // {A: false}
    //
    // We'll call these stateDeltas,
    // taking the form of IStateDelta (a simple map of string to boolean),
    // and each node can return them them via getStateDelta().
    const stateDeltasFromNecessity = necessity.getStateDelta();
    if (stateDeltasFromNecessity === null) {
      return BLACK;
    }

    const { node } = this.props;
    for (const varInNecessity of Object.keys(stateDeltasFromNecessity)) {
      // Let's see if that variable is flagged as a violation in our node.
      if (node.stateViolations.hasOwnProperty(varInNecessity)) {
        // overallColor is what determines the color
        // we should use when drawing the line
        // to this node
        node.overallColor = RED;
        return RED;
      }

      if (node.futureStateViolations.hasOwnProperty(varInNecessity)) {
        if (node.overallColor === BLACK) {
          node.overallColor = GREEN;
        }
        return GREEN;
      }
    }
    return BLACK;
  };

  public getTextForNecessity = (necessity: IMatchable, index: number) => {
    const { leftOffsets } = this.state;

    return (
      <text
        key={necessity.toString()}
        fill={this.getColorShowingStateViolation(necessity)}
        transform={`translate(${leftOffsets[necessity.toString()] ||
          0} ${index * NODEHEIGHT})`}
        ref={r => (this.elementref[necessity.toString()] = r)}
      >
        {necessity.toString()}
      </text>
    );
  };

  public toggleExpanded = () => {
    this.setState(
      ({ expanded }) => ({ expanded: !expanded }),
      this.updateMyWidth
    );
  };

  public render() {
    const { node, x, y } = this.props;
    const { expanded, closed } = this.state;

    const necessities: IMatchableMap = node.necessities;
    const totalHeight: number = Object.keys(necessities).length * NODEHEIGHT;
    const myNecessityText = Object.values(necessities).map((n, i) =>
      this.getTextForNecessity(n as IMatchable, i)
    );

    const { childWidths } = this.state;

    return (
      <g transform={`translate(${x} ${y})`} className="node">
        <rect
          x={-5}
          y={totalHeight - 10}
          width={10}
          height={10}
          style={{ stroke: "black", fill: closed ? "black" : "white" }}
        />
        {myNecessityText}
        {node.children.length > 0 && (
          <text y={totalHeight + 18} x="-5" onClick={this.toggleExpanded}>
            +
          </text>
        )}
        {expanded &&
          this.renderNodeChildren(totalHeight + 21, node, childWidths)}
      </g>
    );
  }

  public renderNodeChildren = (
    totalHeight: number,
    node: EvaluationNode,
    childWidths: { [x: string]: number }
  ) => {
    const totalRowWidth = Object.values(childWidths).reduce(
      (acc, child) => acc + child + GUTTER,
      -GUTTER
    );
    let childStartingX = -totalRowWidth * 0.5;

    const kids: React.ReactElement[] = [];
    for (const n of node.children) {
      // Before we place the component, because every component is centered,
      // we don't want its left edge too far left.
      // Add half the component's width,
      // so that its left edge will be aligned with the leftmost point.
      const nodewidth = childWidths[n.toString()] || NODEWIDTH;

      childStartingX += nodewidth / 2;

      kids.push(
        <g key={n.toString()}>
          <line
            x1="0"
            y1={totalHeight + 3}
            x2={childStartingX}
            y2={totalHeight + VERTICAL_DISTANCE - NODEHEIGHT}
            style={{
              stroke: n.overallColor,
              strokeWidth: 2
            }}
          />
          {
            <NodeComponent
              x={childStartingX}
              y={totalHeight + VERTICAL_DISTANCE}
              node={n}
              parent={this}
            />
          }
        </g>
      );
      // And after we place the component, because every component is centered,
      // we want the start of the next component's left edge to be at our right edge.
      // So add half the component's width,
      // and a little bit of gutter.

      childStartingX += nodewidth / 2;
      childStartingX += GUTTER;
    }
    return kids;
  };
}
