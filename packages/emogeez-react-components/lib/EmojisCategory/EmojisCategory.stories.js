import {
  map,
} from 'lodash';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';
import appleJSON from 'emogeez-generator/emojis/apple/apple.json';
import EmojisCategory from './EmojisCategory';

const stories = storiesOf('EmojisCategory', module)
  .addDecorator(centered);

const defaultStory = {
  name: appleJSON.people.name,
  symbol: appleJSON.people.symbol,
  emojis: map(appleJSON.people.emojis, emoji => emoji),
};

stories.add('Default', () => {
  const props = {
    ...defaultStory,
    onClickEmoji: console.log, // eslint-disable-line no-console
  };

  return (
    <EmojisCategory {...props} />
  );
});
