"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = markdownItAttribution;

var _util = require("./util");

var _blockquoteTokens = _interopRequireDefault(require("./blockquoteTokens"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function markdownItAttribution(md, options) {
  var attributionPrefix = options && options.attributionPrefix || '--';
  var Token; // setup Blockquote Rule

  md.core.ruler.after('block', 'attribution', blockquoteRule);

  function blockquoteRule(state) {
    // make Token constructor accessible to deeply nested helper functions
    Token = state.Token;
    var indicePairs = blockquoteIndicePairs(state.tokens);
    indicePairs.forEach(function (indices) {
      var _indices = _slicedToArray(indices, 2),
          fromIndex = _indices[0],
          toIndex = _indices[1];

      var originalBlockquoteTokens = state.tokens.slice(fromIndex, toIndex + 1);
      var updatedBlockquoteTokens = customBlockquoteTokens(originalBlockquoteTokens);
      replaceBlockquoteTokens(state.tokens, fromIndex, toIndex, updatedBlockquoteTokens);
    });
  }

  function blockquoteIndicePairs(tokens) {
    var blockquoteOpenIndices = indicesWithTokenType(tokens, 'blockquote_open');
    var blockquoteCloseIndices = indicesWithTokenType(tokens, 'blockquote_close');
    return (0, _util.zip)(blockquoteOpenIndices, blockquoteCloseIndices);
  }

  function replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens) {
    var deleteCount = toIndex - fromIndex + 1;
    tokens.splice.apply(tokens, [fromIndex, deleteCount].concat(_toConsumableArray(updatedTokens)));
  }

  function customBlockquoteTokens(blockquoteTokens) {
    var openingToken = blockquoteTokens[0];
    var closingToken = blockquoteTokens[blockquoteTokens.length - 1];
    var updatedBlockquoteTokens = (0, _blockquoteTokens["default"])(blockquoteTokens, Token, attributionPrefix);
    return (0, _util.flatten)([openingToken, updatedBlockquoteTokens, closingToken]);
  }

  function indicesWithTokenType(tokens, tokenType) {
    var mapped = tokens.map(function (token, index) {
      return token.type === tokenType ? index : null;
    });
    var filtered = mapped.filter(function (element) {
      return element !== null;
    });
    return filtered;
  }
}