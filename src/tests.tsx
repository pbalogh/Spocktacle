import {
  IJSONofIMatchable,
  INecessitiesAndPossibilities,
  IStateDelta
} from "./App";
import EvaluationNode from "./LogicParser/EvaluationNode";
import LogicParser from "./LogicParser/LogicParser";
// tslint:disable-next-line: no-var-requires
const stringify = require("json-stable-stringify");

export const testEvaluationNode = () => {
  const root = new LogicParser("!(A->B)&&B").getRoot();
  const state = { A: true, B: false };
  const node = new EvaluationNode({ [root.toString()]: root }, state);
  console.log("node is ", node);
};

export const testJsonTypes = () => {
  const typetest = (thing: IJSONofIMatchable[]) => {
    console.log("typetest worked");
  };

  typetest([
    {
      className: "Variable",
      elements: [
        {
          elements: "A",
          syntaxmatch: "VARIABLE"
        }
      ],
      syntaxmatch: "FORMULA"
    }
  ]);
};
export const testParserAndOperators = () => {
  const test = (
    sentence: string,
    returnValue: boolean,
    toBeFalseValue: INecessitiesAndPossibilities,
    toBeTrueValue: INecessitiesAndPossibilities,
    stateDelta: IStateDelta | null
  ) => {
    //   logicParser = new LogicParser(sentence, returnValue);
    //   const root = logicParser.formulae[0];
    const root = new LogicParser(sentence).getRoot();
    const state = { A: true, B: false };
    console.assert(
      root.evaluate(state) === returnValue,
      "root.evaluate(state) should be " +
        returnValue +
        " but is " +
        root.evaluate(state)
    );
    console.log("sentence is ", sentence);
    console.log("toBeFalseValue is ", stringify(toBeFalseValue));
    console.log("root.toBeFalse() is ", root.toBeFalse());
    console.log("root.toBeFalse() is ", stringify(root.toBeFalse()));
    console.assert(
      stringify(root.toBeFalse()) === stringify(toBeFalseValue),

      "Negation of " +
        root.toString() +
        " should be " +
        stringify(toBeFalseValue) +
        " but it is " +
        stringify(root.toBeFalse())
    );

    console.assert(
      stringify(root.toBeTrue()) === stringify(toBeTrueValue),

      "Affirmation of " +
        root.toString() +
        " should be " +
        stringify(toBeTrueValue) +
        " but it is " +
        stringify(root.toBeTrue())
    );
    console.assert(
      root.toString() === sentence,

      "root.toString() should be " + sentence + " but is " + root.toString()
    );
    console.assert(
      stringify(root.getStateDelta()) === stringify(stateDelta),

      "root.getStateDelta() should have been " +
        stringify(stateDelta) +
        " but was " +
        stringify(root.getStateDelta())
    );
  };

  test(
    "A",
    true,
    {
      necessities: {
        "!A": {
          className: "Not",
          elements: [
            { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
            {
              className: "Variable",
              elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
              syntaxmatch: "FORMULA"
            }
          ],
          syntaxmatch: "FORMULA"
        }
      },
      possibilities: {}
    },
    {
      necessities: {
        A: {
          className: "Variable",
          elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
          syntaxmatch: "FORMULA"
        }
      },
      possibilities: {}
    },
    { A: true }
  );
  /*
        test(
          "!A",
          false,
          {
            necessities: [
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          { A: false }
        );
    
        test(
          "!!A",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          { A: true }
        );
    
        test(
          "B",
          false,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [
              {
                className: "Variable",
                elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
    
          { B: true }
        );
    
        test(
          "!B",
          true,
          {
            necessities: [
              {
                className: "Variable",
                elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          { B: false }
        );
    
        test(
          "A||B",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "B",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "(A||B)",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "B",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "(A)||B",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Formula",
                    elements: [
                      {
                        className: "Formula",
                        elements: "(",
                        syntaxmatch: "OPENPARENS"
                      },
                      {
                        className: "Variable",
                        elements: [
                          {
                            elements: "A",
                            syntaxmatch: "VARIABLE"
                          }
                        ],
                        syntaxmatch: "FORMULA"
                      },
                      {
                        className: "Formula",
                        elements: ")",
                        syntaxmatch: "CLOSEPARENS"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "B",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Formula",
                elements: [
                  {
                    className: "Formula",
                    elements: "(",
                    syntaxmatch: "OPENPARENS"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "Formula",
                    elements: ")",
                    syntaxmatch: "CLOSEPARENS"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [
                  {
                    elements: "B",
                    syntaxmatch: "VARIABLE"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "A||(B)",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Formula",
                    elements: [
                      {
                        className: "Formula",
                        elements: "(",
                        syntaxmatch: "OPENPARENS"
                      },
                      {
                        className: "Variable",
                        elements: [
                          {
                            elements: "B",
                            syntaxmatch: "VARIABLE"
                          }
                        ],
                        syntaxmatch: "FORMULA"
                      },
                      {
                        className: "Formula",
                        elements: ")",
                        syntaxmatch: "CLOSEPARENS"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Variable",
                elements: [
                  {
                    elements: "A",
                    syntaxmatch: "VARIABLE"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Formula",
                elements: [
                  {
                    className: "Formula",
                    elements: "(",
                    syntaxmatch: "OPENPARENS"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "B",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "Formula",
                    elements: ")",
                    syntaxmatch: "CLOSEPARENS"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "A&&B",
          false,
          {
            necessities: [],
            possibilities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "B",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          {
            necessities: [
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          null
        );
    
        test(
          "A&&B&&A",
          false,
          {
            necessities: [],
            possibilities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "And",
                    elements: [
                      {
                        className: "Variable",
                        elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      },
                      {
                        className: "And",
                        elements: "&&",
                        syntaxmatch: "BINARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          {
            necessities: [
              {
                className: "And",
                elements: [
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "And",
                    elements: "&&",
                    syntaxmatch: "BINARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          null
        );
    
        // Test our Then operator
    
        test(
          "A->B",
          false,
          {
            necessities: [
              {
                className: "Variable",
                elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "!A->B",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "B",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [
                          {
                            elements: "A",
                            syntaxmatch: "VARIABLE"
                          }
                        ],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Variable",
                elements: [
                  {
                    elements: "B",
                    syntaxmatch: "VARIABLE"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "A->!B",
          true,
          {
            necessities: [
              {
                className: "Variable",
                elements: [
                  {
                    elements: "A",
                    syntaxmatch: "VARIABLE"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [
                          {
                            elements: "B",
                            syntaxmatch: "VARIABLE"
                          }
                        ],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        test(
          "!A->!B",
          true,
          {
            necessities: [
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [
                      {
                        elements: "A",
                        syntaxmatch: "VARIABLE"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  {
                    className: "Not",
                    elements: "!",
                    syntaxmatch: "UNARYOPERATOR"
                  },
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [
                          {
                            elements: "B",
                            syntaxmatch: "VARIABLE"
                          }
                        ],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ],
            possibilities: []
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "Not",
                elements: [
                  { className: "Not", elements: "!", syntaxmatch: "UNARYOPERATOR" },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    
        // Test our Iff operator
    
        test(
          "A<->B",
          false,
          {
            necessities: [],
            // either A is true and B is false
            // or A is false and B is true
            possibilities: [
              {
                className: "And",
                elements: [
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "And",
                    elements: "&&",
                    syntaxmatch: "BINARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "And",
                elements: [
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "And",
                    elements: "&&",
                    syntaxmatch: "BINARYOPERATOR"
                  },
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          {
            necessities: [],
            possibilities: [
              {
                className: "And",
                elements: [
                  {
                    className: "Variable",
                    elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "And",
                    elements: "&&",
                    syntaxmatch: "BINARYOPERATOR"
                  },
                  {
                    className: "Variable",
                    elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              },
              {
                className: "And",
                elements: [
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [{ elements: "A", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  },
                  {
                    className: "And",
                    elements: "&&",
                    syntaxmatch: "BINARYOPERATOR"
                  },
                  {
                    className: "Not",
                    elements: [
                      {
                        className: "Not",
                        elements: "!",
                        syntaxmatch: "UNARYOPERATOR"
                      },
                      {
                        className: "Variable",
                        elements: [{ elements: "B", syntaxmatch: "VARIABLE" }],
                        syntaxmatch: "FORMULA"
                      }
                    ],
                    syntaxmatch: "FORMULA"
                  }
                ],
                syntaxmatch: "FORMULA"
              }
            ]
          },
          null
        );
    */
};
