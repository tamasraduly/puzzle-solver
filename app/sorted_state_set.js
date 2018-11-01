const SortedObjectCollection = require("./sorted_object_collection");
const equal = require("deep-equal");

class SortedStateSet extends SortedObjectCollection {
  constructor() {
    super();
  }

  add(obj) {
    if (this.contains(obj)) {
      return null;
    }
    super.add(obj);
    return obj;
  }

  equals(obj1, obj2) {
    const fieldNames = Object.keys(obj1);
    for (let i = 0; i < fieldNames.length; i++) {
      let value1 = obj1[fieldNames[i]];
      let value2 = obj2[fieldNames[i]];
      // Check deep-equal for value1 and value2
      if (!equal(value1, value2)) {
        // console.log(
        //   value1,
        //   "and",
        //   value2,
        //   "are not equal. fieldnames[" + i + "] = " + fieldNames[i]
        // );
        return false;
      }
    }
    return true;
  }

  findPosIfExists(obj) {
    if (this.elements.length === 0) {
      return null;
    }
    const index = this.findPos(obj, 0, this.elements.length - 1);
    if (index >= this.elements.length) {
      return null;
    }
    if (this.equals(obj, this.elements[index])) {
      return index;
    }
    return null;
  }

  delete(obj) {
    const index = this.findPosIfExists(obj);
    //    console.log("Delete ", obj.uniqueState, ", index: ", index);

    if (index != null) {
      this.elements.splice(index, 1);
      return true;
    }
    return false;
  }

  contains(obj) {
    const pos = this.findPosIfExists(obj);
    return pos != null;
  }
}

module.exports = SortedStateSet;
