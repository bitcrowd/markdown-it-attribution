import { flatten, zip } from './util';

export default function markdownItAttribution(md, options) {
  const attributionPrefix = (options && options.attributionPrefix) || '--';
  let Token;

  function setupBlockquoteRule() {
    md.core.ruler.after('block', 'attribution', blockquoteRule);
  }

  function blockquoteRule(state) {
    // make Token constructor accessible to deeply nested helper functions
    Token = state.Token;

    const indicePairs = blockquoteIndicePairs(state.tokens);

    indicePairs.forEach((indices) => {
      const [from, to] = indices;
      updateBlockquoteTokens(state.tokens, from, to);
    });
  }

  function blockquoteIndicePairs(tokens) {
    const blockquoteOpenIndices = indicesWithTokenType(tokens, 'blockquote_open');
    const blockquoteCloseIndices = indicesWithTokenType(tokens, 'blockquote_close');

    return zip(blockquoteOpenIndices, blockquoteCloseIndices);
  }

  function indicesWithTokenType(tokens, tokenType) {
    const mapped = tokens.map((token, index) => (token.type === tokenType ? index : null));
    const filtered = mapped.filter((element) => element !== null);
    return filtered;
  }

  function updateBlockquoteTokens(tokens, fromIndex, toIndex) {
    const updatedTokens = blockquoteTokens(tokens, fromIndex, toIndex);

    replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens);
  }

  function replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens) {
    const deleteCount = toIndex - fromIndex + 1;

    tokens.splice(fromIndex, deleteCount, ...updatedTokens);
  }

  function blockquoteTokens(tokens, fromIndex, toIndex) {
    const openingToken = tokens[fromIndex];
    const closingToken = tokens[toIndex];

    const innerTokens = innerBlockquoteTokens(tokens, fromIndex, toIndex);

    return flatten([openingToken, innerTokens, closingToken]);
  }

  function innerBlockquoteTokens(tokens, fromIndex, toIndex) {
    const { level } = tokens[fromIndex];
    const quoteLines = tokens
      .slice(fromIndex, toIndex)
      .filter((token) => token.type === 'inline')
      .map((token) => token.content.split('\n'))

    return flatten(quoteLines).map((quoteLine) => singleQuoteLineTokens(quoteLine, level));
  }

  function singleQuoteLineTokens(quoteLine, level) {
    const trimmedQuoteLine = quoteLine.trimStart();
    if (trimmedQuoteLine.startsWith(attributionPrefix)) {
      const quoteLineWithoutPrefix = trimmedQuoteLine.replace(attributionPrefix, '').trimStart();
      return [
        citationOpeningToken(level + 1),
        inlineToken(quoteLineWithoutPrefix, level + 2),
        citationClosingToken(level + 1),
      ];
    }

    return [
      paragraphOpeningToken(level + 1),
      inlineToken(quoteLine, level + 2),
      paragraphClosingToken(level + 1),
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

  setupBlockquoteRule();
}
