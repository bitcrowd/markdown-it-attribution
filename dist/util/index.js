"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.zip = zip;

// Thanks
// https://stackoverflow.com/a/15030117/1870317
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function zip(array1, array2) {
  return array1.map(function (element, index) {
    return [element, array2[index]];
  });
}