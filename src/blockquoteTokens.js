import { flatten } from './util';

export default function blockquoteTokens(tokens, Token, attributionPrefix) {
  const { baseLevel } = tokens[0];
  const quoteLines = tokens
    .filter((token) => token.type === 'inline')
    .map((token) => token.content.split('\n'));

  return flatten(quoteLines).map((quoteLine) => singleQuoteLineTokens(quoteLine));

  function singleQuoteLineTokens(quoteLine) {
    const trimmedQuoteLine = quoteLine.trimStart();
    if (trimmedQuoteLine.startsWith(attributionPrefix)) {
      const quoteLineWithoutPrefix = trimmedQuoteLine.replace(attributionPrefix, '').trimStart();
      return [
        citationOpeningToken(baseLevel + 1),
        inlineToken(quoteLineWithoutPrefix, baseLevel + 2),
        citationClosingToken(baseLevel + 1),
      ];
    }

    return [
      paragraphOpeningToken(baseLevel + 1),
      inlineToken(quoteLine, baseLevel + 2),
      paragraphClosingToken(baseLevel + 1),
    ];
  }

  function citationOpeningToken(level) {
    return citationToken(level, 1);
  }

  function citationClosingToken(level) {
    return citationToken(level, -1);
  }

  function citationToken(level, nesting) {
    const token = new Token('paragraph_open', 'cite', nesting);
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
    const token = new Token('inline', '', 0);
    token.content = content;
    token.level = level + 2;
    token.block = true;
    token.children = [];
    return token;
  }

  function paragraphToken(level, nesting) {
    const token = new Token('paragraph_open', 'p', nesting);
    token.level = level;
    token.block = true;
    return token;
  }
}
