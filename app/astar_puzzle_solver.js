const Node = require("./node");
const SortedStateSet = require("./sorted_state_set");
const SortedNodeCollection = require("./sorted_node_collection");
const PuzzleSolverException = require("./puzzle_solver_exception");

class AstarPuzzleSolver {
  solve(puzzle) {
    const iterationThreshold = process.env.PUZZLE_SOLVER_ITERATION_THRESHOLD
      ? process.env.PUZZLE_SOLVER_ITERATION_THRESHOLD
      : 35000;

    console.log(
      `-- Solving ${puzzle.size.rows}x${
        puzzle.size.cols
      } puzzle, iteration threshold is ${iterationThreshold} --`
    );

    let counter = 0;
    let currentNode = new Node(
      [],
      null,
      0,
      this.getHeuristicalEstimate(puzzle),
      puzzle.state
    );
    let closedStateSet = new SortedStateSet();
    let openStateSet = new SortedStateSet();
    let openNodeCollection = new SortedNodeCollection();
    // Maintaining 2 collection for open items. One for the node info, one for the states. It is for performance reasons to be able to do binary search.
    openNodeCollection.add(currentNode);
    openStateSet.add(currentNode.uniqueState);
    while (openNodeCollection.size() > 0 && counter++ < iterationThreshold) {
      // get the best node and remove from collection
      currentNode = openNodeCollection.pop();
      openStateSet.delete(currentNode.uniqueState);
      // console.log(
      //   counter + ". Getting best node, cost=",
      //   currentNode.cost,
      //   ", heuristicalEstimate=",
      //   currentNode.heuristicalEstimate,
      //   puzzle.getPiecesArr(currentNode.uniqueState)
      // );

      if (puzzle.isSolvedByState(currentNode.uniqueState)) {
        return this.generateResult(currentNode);
      }
      // This is for testin only!!! Remove it to avoid performance bottleneck
      // try {
      //   puzzle.verifyPieces(puzzle.getPiecesArr());
      // } catch (e) {
      //   console.error("Failure at " + counter, e);
      //   throw e;
      // }

      closedStateSet.add({ ...currentNode.uniqueState });

      let nextPossiblePuzzleSteps = puzzle.getNextPossiblePuzzleSteps(
        currentNode.uniqueState
      );
      //console.log("nextPossiblePuzzleSteps", nextPossiblePuzzleSteps);

      for (
        let stepIndex = 0;
        stepIndex < nextPossiblePuzzleSteps.length;
        stepIndex++
      ) {
        let puzzleStep = nextPossiblePuzzleSteps[stepIndex];
        puzzle.state = { ...currentNode.uniqueState };
        puzzle.move(puzzleStep);

        if (closedStateSet.contains(puzzle.state)) {
          continue;
        }
        let tentativeGScore = currentNode.cost + 1;
        if (!openStateSet.contains(puzzle.state)) {
          const childNode = new Node(
            puzzleStep,
            currentNode,
            tentativeGScore,
            this.getHeuristicalEstimate(puzzle),
            puzzle.state
          );
          openNodeCollection.add(childNode);
          openStateSet.add(puzzle.state);
        }
        // console.log(
        //   "Moved node to " + puzzleStep + ", puzzle.state=",
        //   puzzle.state
        // );
        //console.log("closedStateSet", closedStateSet);
      }
      if (counter % 10000 === 0) {
        console.log(
          counter + ". iteration, openNodeCollection size",
          openNodeCollection.size() + ", closedStateSet size ",
          closedStateSet.size(),
          "  Last estimated number of steps was " +
            currentNode.cost +
            " + " +
            currentNode.heuristicalEstimate +
            " = " +
            currentNode.totalCost
        );
      }
    }
    console.log("openNodeCollection.size()", openNodeCollection.size);
    throw new PuzzleSolverException(
      "Failed to solve the puzzle in " +
        counter +
        " steps. Last estimated number of steps was " +
        currentNode.totalCost +
        " (g=" +
        currentNode.cost +
        ", h=" +
        currentNode.heuristicalEstimate +
        ")",
      puzzle.getPiecesArr()
    );
  }

  generateResult(node) {
    //    console.log("!!! generateResult", node);

    let puzzleStepsArr = [];
    while (node.parent != null) {
      puzzleStepsArr = [node.puzzleStep, ...puzzleStepsArr];
      node = node.parent;
    }
    //console.log("Solution is: ", puzzleStepsArr);
    return puzzleStepsArr;
  }

  /** Calculate the sum of Manhattan distances for each puzzle piece. */
  getHeuristicalEstimate(puzzle) {
    return puzzle.getManhattanDistanceSum(puzzle.state);
  }
}

module.exports = AstarPuzzleSolver;
