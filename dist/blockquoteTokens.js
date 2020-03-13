"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = blockquoteTokens;

var _util = require("./util");

function blockquoteTokens(tokens, Token, attributionPrefix) {
  var baseLevel = tokens[0].baseLevel;
  var quoteLines = tokens.filter(function (token) {
    return token.type === 'inline';
  }).map(function (token) {
    return token.content.split('\n');
  });
  return (0, _util.flatten)(quoteLines).map(function (quoteLine) {
    return singleQuoteLineTokens(quoteLine);
  });

  function singleQuoteLineTokens(quoteLine) {
    var trimmedQuoteLine = quoteLine.trimStart();

    if (trimmedQuoteLine.startsWith(attributionPrefix)) {
      var quoteLineWithoutPrefix = trimmedQuoteLine.replace(attributionPrefix, '').trimStart();
      return [citationOpeningToken(baseLevel + 1), inlineToken(quoteLineWithoutPrefix, baseLevel + 2), citationClosingToken(baseLevel + 1)];
    }

    return [paragraphOpeningToken(baseLevel + 1), inlineToken(quoteLine, baseLevel + 2), paragraphClosingToken(baseLevel + 1)];
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
}