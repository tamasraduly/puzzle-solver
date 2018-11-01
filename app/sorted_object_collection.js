const equal = require("deep-equal");

class SortedObjectCollection {
  constructor(sortingFields, equalityFields) {
    this.sortingFields = sortingFields;
    this.equalityFields = equalityFields;
    this.elements = new Array();
  }

  add(obj) {
    if (this.elements.length == 0) {
      this.elements.push(obj);
      return true;
    }
    const pos = this.findPos(obj, 0, this.elements.length - 1);
    this.elements.splice(pos, 0, obj);
    return true;
  }

  findPos(obj, min, max) {
    //console.log("findPos min", min, ", max", max);

    if (min === max) {
      const comp = this.compare(obj, this.elements[min]);
      if (comp > 0) {
        return max + 1;
      }
      return max;
    }
    if (max - min === 1) {
      let comp = this.compare(obj, this.elements[min]);
      if (comp <= 0) {
        return min;
      }
      comp = this.compare(obj, this.elements[max]);
      if (comp > 0) {
        return max + 1;
      }
      return max;
    }

    const mid = Math.trunc((min + max) / 2);
    const comp = this.compare(obj, this.elements[mid]);
    if (comp === 0) {
      // already existed;
      return mid;
    }
    if (comp < 0) {
      return this.findPos(obj, min, mid);
    } else {
      return this.findPos(obj, mid, max);
    }
  }

  compare(obj1, obj2) {
    const fieldNames = this.sortingFields
      ? this.sortingFields
      : Object.keys(obj1);
    for (let i = 0; i < fieldNames.length; i++) {
      let value1 =
        typeof fieldNames[i] === "func"
          ? obj1[fieldNames[i]]()
          : obj1[fieldNames[i]];
      let value2 =
        typeof fieldNames[i] === "func"
          ? obj2[fieldNames[i]]()
          : obj2[fieldNames[i]];
      if (value1 === value2) {
        continue;
      }
      if (value1 < value2) {
        return -1;
      }
      if (value1 > value2) {
        return 1;
      }
    }
    return 0;
  }

  size() {
    return this.elements.length;
  }

  /** Get and remove the first element from the sorted collection. If the collection is empty, then returning null. */
  pop() {
    if (this.elements.length == 0) {
      return null;
    }
    const result = this.elements[0];
    this.elements.splice(0, 1);
    return result;
  }
}

module.exports = SortedObjectCollection;
