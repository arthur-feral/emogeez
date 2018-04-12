import { configure } from '@storybook/react';
import emojis from 'emogeez-generator/emojis/apple/apple.json';
import Parser from 'emogeez-parser';
import './base.scss';

const parser = Parser();

parser.store.setTheme('apple', emojis);
global.emojis = parser.store.getEmojis('apple');

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}


configure(loadStories, module);
