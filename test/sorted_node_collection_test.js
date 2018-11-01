const assert = require("chai").assert;
const SortedNodeCollection = require("../app/sorted_node_collection");
const Node = require("../app/node");
const nodes = [
  new Node(null, null, 3, 2, [11, 22]),
  new Node(null, null, 1, 2, [11, 23]),
  new Node(null, null, 1, 7, [10, 20])
];
const expectedOrder = [1, 0, 2];

describe("Testing SortedNodeCollection ", () => {
  it("Testing add, size methods", () => {
    const collection = new SortedNodeCollection();
    let expectedSize = 0;
    assert.equal(collection.size(), expectedSize, "Wrong collection size!");
    nodes.forEach(n => {
      collection.add(n);
      assert.equal(collection.size(), ++expectedSize, "Wrong collection size!");
    });
  });

  it("Testing pop method", () => {
    const collection = new SortedNodeCollection();
    nodes.forEach(n => {
      collection.add(n);
    });

    let index = 0;
    let size = nodes.length;
    nodes.forEach(n => {
      let best = collection.pop();
      assert.equal(
        best,
        nodes[expectedOrder[index]],
        "Wrong object was popped at " + index + "!"
      );
      index++;
      assert.equal(collection.size(), --size, "Wrong collection size!");
    });
    // after all elements removed
    assert.equal(collection.size(), 0, "Wrong collection size!");

    let best = collection.pop();
    assert.isNull(best, "Null was expected!");
    assert.equal(collection.size(), 0, "Wrong collection size!");
  });
});
