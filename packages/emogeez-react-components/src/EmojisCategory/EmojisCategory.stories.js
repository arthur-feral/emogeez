import {
  keys,
} from 'lodash';
import EmojisCategory from './EmojisCategory';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';
import appleJSON from 'emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisCategory', module)
  .addDecorator(centered);

export const defaultStory = {
  name: appleJSON.people.name,
  symbol: appleJSON.people.symbol,
  emojis: appleJSON.people.emojis,
};

stories.add('Default', () => {
  const props = {
    ...defaultStory,
    onClickEmoji: console.log,
  };

  return (
    <EmojisCategory {...props} />
  );
});
