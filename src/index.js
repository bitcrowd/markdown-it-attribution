import { flatten, zip } from './util';
import updateBlockquote from './blockquoteTokens';

export default function markdownItAttribution(md, options) {
  const attributionPrefix = (options && options.attributionPrefix) || '--';
  let Token;

  // setup Blockquote Rule
  md.core.ruler.after('block', 'attribution', blockquoteRule);

  function blockquoteRule(state) {
    // make Token constructor accessible to deeply nested helper functions
    Token = state.Token;

    const indicePairs = blockquoteIndicePairs(state.tokens);

    indicePairs.forEach((indices) => {
      const [fromIndex, toIndex] = indices;
      const originalBlockquoteTokens = state.tokens.slice(fromIndex, toIndex + 1);
      const updatedBlockquoteTokens = customBlockquoteTokens(originalBlockquoteTokens);
      replaceBlockquoteTokens(state.tokens, fromIndex, toIndex, updatedBlockquoteTokens);
    });
  }

  function blockquoteIndicePairs(tokens) {
    const blockquoteOpenIndices = indicesWithTokenType(tokens, 'blockquote_open');
    const blockquoteCloseIndices = indicesWithTokenType(tokens, 'blockquote_close');

    return zip(blockquoteOpenIndices, blockquoteCloseIndices);
  }

  function replaceBlockquoteTokens(tokens, fromIndex, toIndex, updatedTokens) {
    const deleteCount = toIndex - fromIndex + 1;

    tokens.splice(fromIndex, deleteCount, ...updatedTokens);
  }

  function customBlockquoteTokens(blockquoteTokens) {
    const openingToken = blockquoteTokens[0];
    const closingToken = blockquoteTokens[blockquoteTokens.length - 1];
    const updatedBlockquoteTokens = updateBlockquote(blockquoteTokens, Token, attributionPrefix);

    return flatten([openingToken, updatedBlockquoteTokens, closingToken]);
  }

  function indicesWithTokenType(tokens, tokenType) {
    const mapped = tokens.map((token, index) => (token.type === tokenType ? index : null));
    const filtered = mapped.filter((element) => element !== null);
    return filtered;
  }
}
