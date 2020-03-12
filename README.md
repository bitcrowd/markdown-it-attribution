# markdown-it-attribution

This is a fork from https://github.com/bitcrowd/markdown-it-attribution which adjusts the functionality to our needs, removes most of the features we don't use and refactors the code a bit.
It's a very specialized version of the original plugin, so please use at your own risk.

Namely this plugin allows to generate proper `<blockquote>` tags with nested `<cite>` tags, just like this:
```md
> Quoted text here. Lorem ipsom etc
> More quoted text here. Lorem ipsom etc
> --- Ms. Cited Name-Here
```
Will be rendered as:
```html
<blockquote>
  <p>Quoted text here. Lorem ipsum etc</p>
  <p>More quoted text here. Lorem ipsum etc</p>
  <cite>Ms. Cited Name-Here</cite>
</blockquote>
```

## Install

```bash
yarn add bitcrowd/markdown-it-attribution#master
```

If you don't use `yarn`:
```bash
npm install --save bitcrowd/markdown-it-attribution#master
```

## Usage

```js
import Markdown from 'markdown-it';
import MarkdownItAttribution from './markdown-it/markdown-it-attribution';

const mdit = new Markdown().use(MarkdownItAttribution, { attributionPrefix: '---' });
const blockquote = [
  '> Quoted text here. Lorem ipsom etc',
  '> More quoted text here. Lorem ipsom etc',
  '> --- Ms. Cited Name-Here'
];

mdit.render(blockquote.join('\n'));
```

Options are optional, `attributionPrefix` defaults to `--`;

[MIT](https://github.com/bitcrowd/markdown-it-attribution/blob/master/LICENSE.txt)
