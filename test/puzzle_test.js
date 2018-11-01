const assert = require("chai").assert;
const Puzzle = require("../app/puzzle");
const PuzzleException = require("../app/puzzle_exception");
const equal = require("deep-equal");
require("../app/step_constants");

describe("Puzzle", () => {
  it("Verifying input validation in the constructor ", function() {
    const badInputArray = [null, "x", 111, new Object(), { a: "aa", b: "bb" }];
    badInputArray.forEach(input => {
      assert.throws(
        () => {
          new Puzzle(input);
        },
        PuzzleException,
        "Expected a 2 dimensional array with numbers!"
      );
    });
    let badPieces = [[1, 2, 3], [4, -1, 6], [7, 8, 0]];
    assert.throws(
      () => {
        new Puzzle(badPieces);
      },
      PuzzleException,
      "Number out of range: -1 in the array. It should be between 0 and 8"
    );
    badPieces = [[1, 2, 3], [4, 15, 6], [7, 8, 0]];
    assert.throws(
      () => {
        new Puzzle(badPieces);
      },
      PuzzleException,
      "Number out of range: 15 in the array. It should be between 0 and 8"
    );

    badPieces = [[1, 2, "a"], [4, 15, 6], [7, 8, 0]];
    assert.throws(
      () => {
        new Puzzle(badPieces);
      },
      PuzzleException,
      "Unexpected element: a in the array. It must contain numbers!"
    );

    badPieces = [[1, 2, 3], [4, 5, 6], [7, 3, 0]];
    assert.throws(
      () => {
        new Puzzle(badPieces);
      },
      PuzzleException,
      "Each number in the array must be unique! This number is a duplicate: 3."
    );
  });

  it("Verifying state consistency on creation ", function() {
    let pieces = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    let puzzle = new Puzzle(pieces);
    let piecesFromPuzzle = puzzle.getPiecesArr();
    assert.isTrue(
      equal(piecesFromPuzzle, pieces, "The pieces array is incorrect!")
    );
  });

  it("Moving 3x3", () => {
    let pieces = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    let puzzle = new Puzzle(pieces);
    puzzle.move(RIGHT);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3], [4, 5, 6], [7, 0, 8]],
      "Incorrect state after moving right. "
    );
    puzzle.move(DOWN);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3], [4, 0, 6], [7, 5, 8]],
      "Incorrect state after moving down. "
    );
    puzzle.move(LEFT);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3], [4, 6, 0], [7, 5, 8]],
      "Incorrect state after moving left. "
    );
    puzzle.move(UP);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3], [4, 6, 8], [7, 5, 0]],
      "Incorrect state after moving up. "
    );
  });

  it("Moving 4x4", () => {
    let pieces = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
    let puzzle = new Puzzle(pieces);
    puzzle.move(RIGHT);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 0, 15]],
      "Incorrect state after moving right. "
    );
    puzzle.move(DOWN);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 0, 12], [13, 14, 11, 15]],
      "Incorrect state after moving down. "
    );
    puzzle.move(LEFT);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 12, 0], [13, 14, 11, 15]],
      "Incorrect state after moving left. "
    );
    puzzle.move(UP);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 12, 15], [13, 14, 11, 0]],
      "Incorrect state after moving up. "
    );
  });

  it("Finding empty piece in 3x3", () => {
    let pieces = [[1, 2, 3], [5, 6, 0], [4, 7, 8]];
    let puzzle = new Puzzle(pieces);
    let epc = puzzle.getEmptyPieceCoordinates();
    assert.deepStrictEqual(epc, [1, 2], "Empty piece coordinate is incorrect!");
  });

  it("Setting a number of a piece in 3x3", () => {
    let pieces = [[1, 2, 3], [4, 5, 6], [7, 0, 8]];
    let puzzle = new Puzzle(pieces);
    const num = 9;
    puzzle.setNumAtPos([2, 2], num);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3], [4, 5, 6], [7, 0, num]],
      "Incorrect status after setting a piece"
    );
  });

  it("Setting a number of a piece in 4x4", () => {
    let pieces = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
    let puzzle = new Puzzle(pieces);
    const num = 15;
    puzzle.setNumAtPos([3, 3], num);
    assert.deepStrictEqual(
      puzzle.getPiecesArr(),
      [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, num]],
      "Incorrect status after setting a piece"
    );
  });

  it("Getting a number of a piece in 3x3", () => {
    getNumCheck([[1, 2, 3], [4, 5, 6], [7, 0, 8]]);
  });

  it("Getting a number of a piece in 4x4", () => {
    getNumCheck([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]]);
  });

  it("Manhattan distance sum in 3x3", () => {
    let pieces = [[1, 2, 3], [4, 5, 6], [0, 7, 8]];
    let puzzle = new Puzzle(pieces);
    const mds = puzzle.getManhattanDistanceSum(puzzle.state);
    assert.equal(mds, 2, "Wrong Manhattan distance");
  });

  it("Manhattan distance sum in 4x4", () => {
    let pieces = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 0, 14, 15]];
    let puzzle = new Puzzle(pieces);
    puzzle.getManhattanDistanceSum(puzzle.state);
    const mds = puzzle.getManhattanDistanceSum(puzzle.state);
    assert.equal(mds, 2, "Wrong Manhattan distance");
  });
});

function getNumCheck(pieces) {
  let puzzle = new Puzzle(pieces);
  for (let i = 0; i < pieces.length; i++) {
    for (let j = 0; j < pieces[i].length; j++) {
      let coord = [i, j];
      let num = puzzle.getNumAtPos([i, j]);
      assert.equal(
        puzzle.getNumAtPos([i, j]),
        pieces[i][j],
        `Getting incorrect number at [${i},${j}] `
      );
    }
  }
}
