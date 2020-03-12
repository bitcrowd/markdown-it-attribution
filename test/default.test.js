import MarkdownIt from 'markdown-it';
import path from 'path';
import generate from 'markdown-it-testgen';

import MarkdownItAttribution from '..';

describe('default attribution', function () {
  const md = new MarkdownIt().use(MarkdownItAttribution);

  generate(path.join(__dirname, 'fixtures/default.txt'), md);
});
