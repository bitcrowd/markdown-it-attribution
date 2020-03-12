import MarkdownIt from 'markdown-it';
import assert from 'assert';

import MarkdownItAttribution from '..';

describe('The plugin api', function () {
  test('configure marker option', function () {
    const md = new MarkdownIt().use(MarkdownItAttribution, { attributionPrefix: '---' });
    const output = md.render('> Quotation\n> --- Some Attribution');

    assert.strictEqual(output, '<blockquote>\n<p>Quotation</p>\n<cite>Some Attribution</cite>\n</blockquote>\n');
  });
});
