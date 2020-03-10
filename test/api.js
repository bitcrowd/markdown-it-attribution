var assert = require('assert');

var markdownIt = require('markdown-it');
var markdownItAttribution = require('../');

describe('The plugin api', function () {
  it('should make the marker configurable', function () {
    var output = markdownIt()
      .use(markdownItAttribution, { attributionPrefix: '---' })
      .render('> Quotation\n> --- Some Attribution');

    assert.strictEqual(output, '<blockquote>\n<p>Quotation</p>\n<cite>Some Attribution</cite>\n</blockquote>\n');
  });
});
