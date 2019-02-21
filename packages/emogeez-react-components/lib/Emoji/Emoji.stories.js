import {
  map,
} from 'lodash';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import Emoji from './Emoji';

const { emojis } = apple.people;
const emojisArray = map(emojis, emoji => emoji);
const stories = storiesOf('Emoji', module)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    emoji: emojisArray[0],
    onClick: console.log, // eslint-disable-line
  };

  return (
    <Emoji {...props} />
  );
});
