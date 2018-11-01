class PuzzleSolverException extends Error {
  constructor(message, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = "PuzzleSolverException";
    this.message = message;
    if (extra) {
      this.extra = extra;
    }
    console.log(this.name + ": ", this.message, this.extra ? this.extra : "");
  }
}

module.exports = PuzzleSolverException;
