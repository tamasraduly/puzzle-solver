const assert = require("chai").assert;
const SortedObjectCollection = require("../app/sorted_object_collection");

describe("Testing SortedObjectCollection", () => {
  it("Testing add and size methods", () => {
    const collection = new SortedObjectCollection();
    assert.equal(collection.size(), 0, "Wrong collection size!");
    const object1 = "bb";
    const object2 = "aa";
    collection.add(object1);
    assert.equal(collection.size(), 1, "Wrong collection size!");
    collection.add(object2);
    assert.equal(collection.size(), 2, "Wrong collection size!");
  });

  it("Testing pop method", () => {
    const collection = new SortedObjectCollection();
    const objects = ["aa", "bb", "cc", "bb"];
    const expectedOrder = [0, 1, 3, 2];
    let size = objects.length;
    objects.forEach(o => collection.add(o));
    assert.equal(collection.size(), size, "Wrong collection size!");
    let index = 0;
    objects.forEach(o => {
      let best = collection.pop();
      assert.equal(
        best,
        objects[expectedOrder[index]],
        "Wrong object was popped at " + index + "!"
      );
      index++;
      assert.equal(collection.size(), --size, "Wrong collection size!");
    });
    // after all elements removed
    let best = collection.pop();
    assert.isNull(best, "Null was expected!");
    assert.equal(collection.size(), 0, "Wrong collection size!");
  });
});
