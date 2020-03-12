"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.flat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.array.unscopables.flat");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/es.string.trim-start");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = markdownItAttribution;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function markdownItAttribution(md, options) {
  var attributionPrefix = options && options.attributionPrefix || '--';
  var Token;

  function replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens) {
    var deleteCount = toIndex - fromIndex + 1;
    tokens.splice.apply(tokens, [fromIndex, deleteCount].concat(_toConsumableArray(updatedTokens)));
  }

  function citationToken(level, nesting) {
    var token = new Token('paragraph_open', 'cite', nesting);
    token.level = level;
    token.block = true;
    return token;
  }

  function citationOpeningToken(level) {
    return citationToken(level, 1);
  }

  function citationClosingToken(level) {
    return citationToken(level, -1);
  }

  function paragraphToken(level, nesting) {
    var token = new Token('paragraph_open', 'p', nesting);
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

  function indicesWithTokenType(tokens, tokenType) {
    var mapped = tokens.map(function (token, index) {
      return token.type === tokenType ? index : null;
    });
    var filtered = mapped.filter(function (element) {
      return element !== null;
    });
    return filtered;
  }

  function zipArrays(array1, array2) {
    return array1.map(function (element, index) {
      return [element, array2[index]];
    });
  }

  function blockquoteIndicePairs(tokens) {
    var blockquoteOpenIndices = indicesWithTokenType(tokens, 'blockquote_open');
    var blockquoteCloseIndices = indicesWithTokenType(tokens, 'blockquote_close');
    return zipArrays(blockquoteOpenIndices, blockquoteCloseIndices);
  }

  function singleQuoteLineTokens(quoteLine, level) {
    var trimmedQuoteLine = quoteLine.trimStart();

    if (trimmedQuoteLine.startsWith(attributionPrefix)) {
      var quoteLineWithoutPrefix = trimmedQuoteLine.replace(attributionPrefix, '').trimStart();
      return [citationOpeningToken(level + 1), inlineToken(quoteLineWithoutPrefix, level + 2), citationClosingToken(level + 1)];
    }

    return [paragraphOpeningToken(level + 1), inlineToken(quoteLine, level + 2), paragraphClosingToken(level + 1)];
  }

  function innerBlockquoteTokens(tokens, fromIndex, toIndex) {
    var level = tokens[fromIndex].level;
    var quoteLines = tokens.slice(fromIndex, toIndex).filter(function (token) {
      return token.type === 'inline';
    }).map(function (token) {
      return token.content.split('\n');
    }).flat();
    return quoteLines.map(function (quoteLine) {
      return singleQuoteLineTokens(quoteLine, level);
    });
  }

  function blockquoteTokens(tokens, fromIndex, toIndex) {
    var openingToken = tokens[fromIndex];
    var closingToken = tokens[toIndex];
    var innerTokens = innerBlockquoteTokens(tokens, fromIndex, toIndex);
    return [openingToken, innerTokens, closingToken].flat(2);
  }

  function updateBlockquoteTokens(tokens, fromIndex, toIndex) {
    var updatedTokens = blockquoteTokens(tokens, fromIndex, toIndex);
    replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens);
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

  function setupBlockquoteRule() {
    md.core.ruler.after('block', 'attribution', blockquoteRule);
  }

  setupBlockquoteRule();
}