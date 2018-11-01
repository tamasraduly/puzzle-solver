require("./step_constants");
const PuzzleException = require("./puzzle_exception");
const equal = require("deep-equal");
const MAX_BIT = 28;

class Puzzle {
  constructor(pieces) {
    this.size = this.verifyPieces(pieces);
    const { rows, cols } = this.size;

    //this.bitsPerPiece = (rows * cols - 1).toString(2).length;
    this.bitsPerPiece = Math.trunc(Math.log2(rows * cols - 1)) + 1;
    this.numberOfStatePartitionsNeeded =
      Math.trunc((this.bitsPerPiece * (rows * cols)) / MAX_BIT) + 1;

    // console.log(
    //   "bitsPerPiece",
    //   this.bitsPerPiece,
    //   "this.numberOfStatePartitionsNeeded",
    //   this.numberOfStatePartitionsNeeded
    // );

    this.state = this.getState(pieces);
    // build the solvedState too
    //const solvedPieces = [...pieces];
    let counter = 1;
    const solvedPieces = [...pieces].map(row =>
      row.map(p => counter++ % (rows * cols))
    );
    this.solvedState = this.getState(solvedPieces);
    // console.log(
    //   "Solved pieces",
    //   solvedPieces,
    //   "solved state",
    //   this.solvedState
    // );
    // for(let i=0; i < solvedPieces.) {

    // }
  }

  verifyPieces(pieces) {
    if (!pieces || !pieces.length || !pieces[0].length || !pieces.forEach) {
      throw new PuzzleException(
        "Expected a 2 dimensional array with numbers!",
        pieces
      );
    }
    const size = {
      rows: pieces.length,
      cols: pieces[0].length
    };
    const { rows, cols } = size;
    const numbersSet = new Set();
    // check the content of the array
    let index = 0;
    pieces.forEach(row => {
      row.forEach(element => {
        if (typeof element != "number") {
          throw new PuzzleException(
            "Unexpected element: " +
              element +
              " in the array. It must contain numbers!",
            pieces
          );
        }
        if (element < 0 || element >= rows * cols) {
          throw new PuzzleException(
            "Number out of range: " +
              element +
              " in the array. It should be between 0 and " +
              (rows * cols - 1),
            pieces
          );
        }
        numbersSet.add(element);
        if (numbersSet.size < ++index) {
          throw new PuzzleException(
            "Each number in the array must be unique! This number is a duplicate: " +
              element +
              ".",
            pieces
          );
        }
      });
    });
    return size;
  }

  getPiecesArr(stateParam) {
    const state = stateParam ? stateParam : this.state;

    const result = [];
    let statePortionCount = 0;
    let currentPos = 0;
    const { rows, cols } = this.size;
    const baseMask = Math.pow(2, this.bitsPerPiece) - 1;
    for (let i = 0; i < rows; i++) {
      result[i] = [];
      for (let j = 0; j < cols; j++) {
        let shift = currentPos * this.bitsPerPiece;
        if (shift > MAX_BIT - this.bitsPerPiece) {
          statePortionCount++;
          currentPos = 0;
          shift = 0;
        }
        let mask = baseMask << shift;
        let num = (state[statePortionCount] & mask) >> shift;
        result[i][j] = num;
        currentPos++;
      }
    }
    return result;
  }

  getState(pieces) {
    const result = new Array();
    let currentStatePartition = 0;
    let currentPos = 0;
    for (let i = 0; i < pieces.length; i++) {
      for (let j = 0; j < pieces.length; j++) {
        let shift = currentPos * this.bitsPerPiece;
        if (shift > MAX_BIT - this.bitsPerPiece) {
          result.push(currentStatePartition);
          currentPos = 0;
          currentStatePartition = 0;
          shift = 0;
        }
        currentStatePartition = currentStatePartition | (pieces[i][j] << shift);
        // console.log(
        //   "currentStatePartition",
        //   currentStatePartition.toString(2),
        //   "shift",
        //   shift,
        //   "pieces[i][j]",
        //   pieces[i][j]
        // );
        currentPos++;
      }
    }
    if (result.length < this.numberOfStatePartitionsNeeded) {
      result.push(currentStatePartition);
    }
    //console.log("getState for ", pieces, " state: ", result);
    return result;
  }

  getManhattanDistanceSum(state) {
    // console.log(
    //   "getManhattanDistanceSum, state:",
    //   state,
    //   ", solvedState",
    //   this.solvedState
    // );
    let totalDist = 0;
    let statePortionCount = 0;
    let currentPos = 0;
    const { rows, cols } = this.size;
    const baseMask = Math.pow(2, this.bitsPerPiece) - 1;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let shift = currentPos * this.bitsPerPiece;
        if (shift > MAX_BIT - this.bitsPerPiece) {
          statePortionCount++;
          currentPos = 0;
          shift = 0;
        }
        let mask = baseMask << shift;
        let num1 = (state[statePortionCount] & mask) >> shift;
        if (num1 != 0) {
          totalDist += this.getManhattanDistance(
            num1,
            (this.solvedState[statePortionCount] & mask) >> shift
          );
        }

        currentPos++;
      }
    }
    // console.log(
    //   "Manhattan distance for ",
    //   this.getPiecesArr(state),
    //   " is ",
    //   totalDist
    // );
    return totalDist;
  }

  getManhattanDistance(num1, num2) {
    //console.log("getManhattanDistance", num1, num2);

    const c1 = this.getCoordinates(num1);
    const c2 = this.getCoordinates(num2);
    return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]);
  }

  getCoordinates(num) {
    const { rows, cols } = this.size;
    if (num == 0) {
      return [this.size.rows - 1, this.size.cols - 1];
    }
    return [Math.trunc((num - 1) / rows), (num - 1) % cols];
  }

  isSolvedState(stateParam) {
    return stateParam == this.solvedState;
  }

  getNextPossiblePuzzleSteps(stateParam) {
    // Find out where the empty piece is and add calculate the next steps based on its coordinates
    // The direction for the step refers to the adjacent piece that will move toward the step
    const state = stateParam ? stateParam : this.state;
    const emptyPieceLocation = this.getEmptyPieceCoordinates(state);

    const steps = new Array();
    if (emptyPieceLocation[0] > 0) {
      steps.push(DOWN);
    }
    if (emptyPieceLocation[0] < this.size.rows - 1) {
      steps.push(UP);
    }
    if (emptyPieceLocation[1] > 0) {
      steps.push(RIGHT);
    }
    if (emptyPieceLocation[1] < this.size.cols - 1) {
      steps.push(LEFT);
    }
    //    console.log("Next possible steps for ", this.getPiecesArr(state), steps);
    return steps;
  }

  getEmptyPieceCoordinates(stateParam) {
    // Find out where the empty piece is and add calculate the next steps based on its coordinates
    const state = stateParam ? stateParam : this.state;
    let statePortionCount = 0;
    let currentPos = 0;
    const { rows, cols } = this.size;
    const baseMask = Math.pow(2, this.bitsPerPiece) - 1;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let shift = currentPos * this.bitsPerPiece;
        if (shift > MAX_BIT - this.bitsPerPiece) {
          statePortionCount++;
          currentPos = 0;
          shift = 0;
        }
        let mask = baseMask << shift;
        let num = (state[statePortionCount] & mask) >> shift;
        if (num === 0) {
          return [i, j];
        }
        currentPos++;
      }
    }
    console.error(
      "Couldn't find the empty piece!",
      state,
      this.getPiecesArr(state)
    );
    throw "Couldn't find the empty piece!";
  }

  move(step) {
    let epc = this.getEmptyPieceCoordinates(this.state);
    // adjacent piece's coordinates
    let apc;
    if (step === UP) {
      apc = [epc[0] + 1, epc[1]];
    } else if (step === DOWN) {
      apc = [epc[0] - 1, epc[1]];
    } else if (step === LEFT) {
      apc = [epc[0], epc[1] + 1];
    } else if (step === RIGHT) {
      apc = [epc[0], epc[1] - 1];
    }

    //console.log("Before move", step, this.state, this.getPiecesArr());
    this.setNumAtPos(epc, this.getNumAtPos(apc));
    this.setNumAtPos(apc, 0);
    // console.log(
    //   "After move",
    //   step,
    //   this.state,
    //   this.getPiecesArr(),
    //   "epc",
    //   epc,
    //   "apc",
    //   apc
    // );
  }

  getNumAtPos(coordinates) {
    const { rows } = this.size;
    const pos = coordinates[0] * rows + coordinates[1];
    const shift = (pos * this.bitsPerPiece) % MAX_BIT;
    const statePortionCount = Math.trunc((pos * this.bitsPerPiece) / MAX_BIT);
    const baseMask = Math.pow(2, this.bitsPerPiece) - 1;
    let mask = baseMask << shift;
    let num = (this.state[statePortionCount] & mask) >> shift;
    // console.log(
    //   "getNumAtPos(",
    //   coordinates,
    //   "):  ",
    //   num,
    //   " for state: ",
    //   this.state
    // );
    return num;
  }

  setNumAtPos(coordinates, num) {
    const { rows } = this.size;
    const pos = coordinates[0] * rows + coordinates[1];
    const shift = (pos * this.bitsPerPiece) % MAX_BIT;
    const statePortionCount = Math.trunc((pos * this.bitsPerPiece) / MAX_BIT);
    const baseMask = Math.pow(2, this.bitsPerPiece) - 1;
    let mask = baseMask << shift;
    // console.log(
    //   "setNumAtPos(",
    //   coordinates,
    //   ",",
    //   num,
    //   ")",
    //   "coord",
    //   coordinates,
    //   "pos",
    //   pos,
    //   "statePortionCount",
    //   statePortionCount,
    //   "shift",
    //   shift,
    //   "mask",
    //   mask.toString(2),
    //   "this.state[statePortionCount] & ~mask)",
    //   (this.state[statePortionCount] & ~mask).toString(2),
    //   "(num << shift)",
    //   (num << shift).toString(2)
    // );
    this.state[statePortionCount] =
      (this.state[statePortionCount] & ~mask) | (num << shift);
  }

  isSolvedByState(stateParam) {
    // console.log(
    //   "isSolvedByState ",
    //   stateParam,
    //   this.solvedState,
    //   equal(stateParam, this.solvedState)
    // );

    return equal(stateParam, this.solvedState);
  }
}

module.exports = Puzzle;
