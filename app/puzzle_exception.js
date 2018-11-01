class PuzzleException extends Error {
  constructor(message, extra) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = "PuzzleException";
    this.message = message;
    if (extra) {
      this.extra = extra;
    }
    console.log(this.name + ": ", this.message, this.extra ? this.extra : "");
  }
}

module.exports = PuzzleException;
