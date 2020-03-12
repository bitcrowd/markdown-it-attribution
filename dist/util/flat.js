"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = flatten;

// Thanks
// https://stackoverflow.com/a/15030117/1870317
function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}