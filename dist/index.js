"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = markdownItAttribution;

var _flat = _interopRequireDefault(require("./util/flat"));

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
  var Token;

  function setupBlockquoteRule() {
    md.core.ruler.after('block', 'attribution', blockquoteRule);
  }

  function blockquoteRule(state) {
    // make Token constructor accessible to deeply nested helper functions
    Token = state.Token;
    var indicePairs = blockquoteIndicePairs(state.tokens);
    indicePairs.forEach(function (indices) {
      var _indices = _slicedToArray(indices, 2),
          from = _indices[0],
          to = _indices[1];

      updateBlockquoteTokens(state.tokens, from, to);
    });
  }

  function blockquoteIndicePairs(tokens) {
    var blockquoteOpenIndices = indicesWithTokenType(tokens, 'blockquote_open');
    var blockquoteCloseIndices = indicesWithTokenType(tokens, 'blockquote_close');
    return zipArrays(blockquoteOpenIndices, blockquoteCloseIndices);
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

  function updateBlockquoteTokens(tokens, fromIndex, toIndex) {
    var updatedTokens = blockquoteTokens(tokens, fromIndex, toIndex);
    replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens);
  }

  function replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens) {
    var deleteCount = toIndex - fromIndex + 1;
    tokens.splice.apply(tokens, [fromIndex, deleteCount].concat(_toConsumableArray(updatedTokens)));
  }

  function blockquoteTokens(tokens, fromIndex, toIndex) {
    var openingToken = tokens[fromIndex];
    var closingToken = tokens[toIndex];
    var innerTokens = innerBlockquoteTokens(tokens, fromIndex, toIndex);
    return (0, _flat["default"])([openingToken, innerTokens, closingToken]);
  }

  function innerBlockquoteTokens(tokens, fromIndex, toIndex) {
    var level = tokens[fromIndex].level;
    var quoteLines = tokens.slice(fromIndex, toIndex).filter(function (token) {
      return token.type === 'inline';
    }).map(function (token) {
      return token.content.split('\n');
    });
    return (0, _flat["default"])(quoteLines).map(function (quoteLine) {
      return singleQuoteLineTokens(quoteLine, level);
    });
  }

  function singleQuoteLineTokens(quoteLine, level) {
    var trimmedQuoteLine = quoteLine.trimStart();

    if (trimmedQuoteLine.startsWith(attributionPrefix)) {
      var quoteLineWithoutPrefix = trimmedQuoteLine.replace(attributionPrefix, '').trimStart();
      return [citationOpeningToken(level + 1), inlineToken(quoteLineWithoutPrefix, level + 2), citationClosingToken(level + 1)];
    }

    return [paragraphOpeningToken(level + 1), inlineToken(quoteLine, level + 2), paragraphClosingToken(level + 1)];
  }

  function citationOpeningToken(level) {
    return citationToken(level, 1);
  }

  function citationClosingToken(level) {
    return citationToken(level, -1);
  }

  function citationToken(level, nesting) {
    var token = new Token('paragraph_open', 'cite', nesting);
    token.level = level;
    token.block = true;
    return token;
  }

  function paragraphOpeningToken(level) {
    return paragraphToken(level, 1);
  }

  function paragraphClosingToken(level) {
    return paragraphToken(level, -1);
  }

  function inlineToken(content, level) {
    var token = new Token('inline', '', 0);
    token.content = content;
    token.level = level + 2;
    token.block = true;
    token.children = [];
    return token;
  }

  function paragraphToken(level, nesting) {
    var token = new Token('paragraph_open', 'p', nesting);
    token.level = level;
    token.block = true;
    return token;
  }

  function zipArrays(array1, array2) {
    return array1.map(function (element, index) {
      return [element, array2[index]];
    });
  }

  setupBlockquoteRule();
}