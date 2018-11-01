const SortedObjectCollection = require("./sorted_object_collection");

class SortedNodeCollection extends SortedObjectCollection {
  constructor() {
    super(["totalCost"]);
  }
}

module.exports = SortedNodeCollection;
