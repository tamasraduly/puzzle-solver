//import Puzzle from "puzzle";
const Puzzle = require("./puzzle");
const AstarPuzzleSolver = require("./astar_puzzle_solver");
const Response = require("./response");

const express = require("express");
const app = express();

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/api/puzzle/solve", (req, resp) => {
  let pieces = req.body.pieces;
  console.log("Request body", req.body);
  let puzzleSolverResponse;
  try {
    const puzzle = new Puzzle(pieces);
    const astarpuzzlesolver = new AstarPuzzleSolver();
    let steps = astarpuzzlesolver.solve(puzzle);
    puzzleSolverResponse = new Response(steps, "Found a solution using A* algorithm.");
    resp.send(puzzleSolverResponse);
  } catch (e) {
    puzzleSolverResponse = new Response(
      [],
      `Puzzle solve request failed (${e.message})`
    );
    console.log("Failed request", e);
    resp.status(400);
    resp.send(puzzleSolverResponse);
  }
});

const port = process.env.PUZZLE_SOLVER_PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
