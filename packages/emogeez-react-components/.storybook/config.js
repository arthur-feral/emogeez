import { configure } from '@storybook/react';
import './base.scss';

// automatically import all files ending in *.stories.js
const req = require.context('../lib', true, /.stories.js$/);

function loadStories() {
  req.keys()
    .forEach(filename => req(filename));
}


configure(loadStories, module);
