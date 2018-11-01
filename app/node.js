class Node {
  constructor(puzzleStep, parent, cost, heuristicalEstimate, uniqueState) {
    this.puzzleStep = puzzleStep;
    this.parent = parent;
    this.cost = cost;
    this.heuristicalEstimate = heuristicalEstimate;
    // using field instead of function, so cloning will not miss anything
    this.totalCost = cost + heuristicalEstimate;
    this.uniqueState = uniqueState;
  }
}

module.exports = Node;
