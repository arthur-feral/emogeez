import { configure } from '@storybook/react';
import emojis from 'emogeez-generator/emojis/apple/apple.json';
import Parser from 'emogeez-parser';
import '../node_modules/emogeez-generator/emojis/apple/apple.scss';

const parser = Parser();

parser.loadTheme('apple', emojis);
global.emojis = parser.getEmojis('apple');

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}


configure(loadStories, module);
