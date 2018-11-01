const assert = require("chai").assert;
const SortedStateSet = require("../app/sorted_state_set");
const objects = [
  [11, 22],
  [11, 23],
  [6, 22],
  [33, 22],
  [7, 12],
  [6, 22],
  [7, 13]
];
const expectedOrder = [2, 4, 6, 0, 1, 3];

describe("Testing SortedStateSet", () => {
  it("Testing add, size methods", () => {
    const set = new SortedStateSet();
    let expectedSize = 0;
    assert.equal(set.size(), expectedSize, "Wrong set size!");
    const expectedSizes = [
      ++expectedSize,
      ++expectedSize,
      ++expectedSize,
      ++expectedSize,
      ++expectedSize,
      expectedSize,
      ++expectedSize
    ];
    let index = 0;
    objects.forEach(o => {
      set.add(o);
      assert.equal(set.size(), expectedSizes[index], "Wrong set size!");
      index++;
    });
  });

  it("Testing contains method", () => {
    const set = new SortedStateSet();
    // Check contains while adding
    objects.forEach(o => {
      set.add(o);
      assert.isTrue(set.contains(o), "The set should contain " + o);
    });

    // Check contains affter elements have been added
    objects.forEach(o => {
      assert.isTrue(set.contains(o), "The set should contain " + o);
    });
  });

  it("Testing pop method", () => {
    const set = new SortedStateSet();
    // Check contains while adding
    objects.forEach(o => {
      set.add(o);
    });

    const setSize = set.size();
    for (let i = 0; i < setSize; i++) {
      let best = set.pop();
      assert.deepEqual(
        best,
        objects[expectedOrder[i]],
        "Wrong element popped at " + i + ", expectedOrder: " + expectedOrder[i]
      );
    }
  });

  it("Testing equals method (assuming pop works)", () => {
    const set = new SortedStateSet();
    // Check contains while adding
    objects.forEach(o => {
      set.add(o);
    });

    const setSize = set.size();
    for (let i = 0; i < setSize; i++) {
      let best = set.pop();
      assert.isTrue(
        set.equals(best, objects[expectedOrder[i]]),
        "Equals failed at " + i + ", for " + expectedOrder[i]
      );
    }
  });
});

//test.testAdd();
//test.testContains();
//test.testEquals();
