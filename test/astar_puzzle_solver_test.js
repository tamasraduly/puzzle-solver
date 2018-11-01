const Puzzle = require("../app/puzzle");
const assert = require("chai").assert;
const AstarPuzzleSolver = require("../app/astar_puzzle_solver");
const PuzzleSolverException = require("../app/puzzle_solver_exception");
require("../app/step_constants");

const testData = [
  {
    description: "2 step shuffled 3x3",
    pieces: [[1, 2, 3], [4, 5, 6], [0, 7, 8]],
    expectedStepCount: 2,
    expectedSteps: [LEFT, LEFT]
  },
  {
    description: "Properly shuffled 3x3",
    pieces: [[4, 2, 7], [5, 0, 6], [8, 1, 3]],
    expectedStepCount: 24
  },
  {
    description: "3 step shuffled 4x4",
    pieces: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [0, 13, 14, 15]],
    expectedStepCount: 3,
    expectedSteps: [LEFT, LEFT, LEFT]
  },
  {
    description: "100 steps shuffled 4x4",
    pieces: [[3, 5, 4, 7], [1, 11, 9, 0], [15, 2, 8, 6], [10, 13, 14, 12]],
    expectedStepCount: 34
  },
  // {
  //   description: "300 steps shuffled 4x4",
  //   pieces: [[ 15, 6, 0, 11 ], [ 10, 8, 4, 12 ], [ 14, 9, 3, 7 ], [ 2, 1, 4, 13 ]],
  //   expectedStepCount: 34
  // },
  {
    description:
      "Last node from solution attempt stopped at 10000 iteration from 300 steps shuffled 4x4",
    pieces: [[5, 12, 1, 3], [9, 11, 14, 8], [6, 13, 2, 7], [4, 0, 10, 15]],
    expectedStepCount: 34,
    timeout: 600000 // 10 minutes
  },
  {
    description:
      "Last node from solution attempt of 4x4 stopped at 100000 iteration where steps were  22 + 20 = 42 ",
    pieces: [[5, 1, 8, 3], [4, 6, 12, 7], [9, 14, 11, 2], [13, 10, 0, 15]],
    expectedStepCount: 33,
    timeout: 600000 // 10 minutes
  }
];

describe("Testing AStarPuzzleSolver", () => {
  it("Error handling on exceeding threshold", () => {
    assert.throws(
      () => {
        let pieces = [
          [3, 5, 4, 7],
          [1, 11, 9, 0],
          [15, 2, 8, 6],
          [10, 13, 14, 12]
        ];
        let puzzle = new Puzzle(pieces);
        let alreadySetEnvVarForThreshold = process.env
          .PUZZLE_SOLVER_ITERATION_THRESHOLD
          ? process.env.PUZZLE_SOLVER_ITERATION_THRESHOLD
          : "";

        process.env["PUZZLE_SOLVER_ITERATION_THRESHOLD"] = 1;
        try {
          const astarpuzzlesolver = new AstarPuzzleSolver();
          astarpuzzlesolver.solve(puzzle);
        } finally {
          process.env[
            "PUZZLE_SOLVER_ITERATION_THRESHOLD"
          ] = alreadySetEnvVarForThreshold;
        }
      },
      PuzzleSolverException,
      "Failed to solve the puzzle in 2 steps."
    );
  });

  testData.forEach(data => {
    it("Solving " + data.description, () => {
      let pieces = data.pieces;
      let puzzle = new Puzzle(pieces);
      const astarpuzzlesolver = new AstarPuzzleSolver();

      let steps = astarpuzzlesolver.solve(puzzle);
      assert.equal(
        steps.length,
        data.expectedStepCount,
        "Incorrect number of steps!"
      );
      if (data.expectedSteps) {
        assert.deepEqual(steps, data.expectedSteps, "Incorrect solution");
      }
    }).timeout(data.timeout ? data.timeout : 2000);
  });
});
