import {
  map,
} from 'lodash';
import './_emoji.scss';
import Emoji from './Emoji';
import { withKnobs, select } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';

import apple from '../../node_modules/emogeez-generator/emojis/apple/apple.json';

const emojis = apple.people.emojis;

const stories = storiesOf('Emoji', module)
  .addDecorator(withKnobs)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    name: select('name', map(emojis, emoji => emoji.name), 'grinning-face'),
    symbol: '😀',
  };

  return (
    <Emoji {...props} />
  );
});
