Puzzle Solver 
-------------

This a NodeJS application with very simple REST RPC API that can solve simple puzzle with A* algorithm.
The size of the puzzle can be anything, but realisticly biggen than 4x4 would take too much time to solve. 

API:

POST api/puzzle/solve
The payload is a 2 dimensional array with numbers between 0 and the size of the array minus one. Zero indicates the empty place in the puzzle. Each number must be unique.
There's validation against the input to make sure that it's the right array and the content meets the criteria.

Sample Payload for a 4x4 puzzle:
{
"pieces": [[5, 1, 8, 3], [4, 6, 12, 7], [9, 14, 11, 2], [13, 10, 0, 15]]	
}

Sample Result:

HTTP Code 200 
{
    "steps": [
        "D",
        "L",
        "U",
        "R",
        "R",
        "D",
        "L",
        "U",
        "L",
        "D",
        "D",
        "R",
        "R",
        "R",
        "D",
        "L",
        "U",
        "U",
        "L",
        "L",
        "D",
        "D",
        "R",
        "R",
        "U",
        "L",
        "L",
        "D",
        "R",
        "U",
        "U",
        "U",
        "L"
    ],
    "message": "Found solution with the A* algorithm"
}

In case of any error, the HTTP status code is 400 and the response will have the same format, where the message describes the problem.

Limitations
-----------
There's a configurable threshold on the number of iterations the A* algorithm can do. Set the environment variable PUZZLE_SOLVER_ITERATION_THRESHOLD to change the default value wich is 35000.


Technology Stack
----------------
Node JS, Mocha, Chai, etc.