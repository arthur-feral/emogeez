import {
  map,
} from 'lodash';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';
import parserFactory from 'emogeez-parser';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import EmojisPopup from './EmojisPopup';

const parser = parserFactory();
parser.store.setTheme('apple', apple);

const stories = storiesOf('EmojisPopup', module)
  .addDecorator(centered);
const categories = parser.store.getCategories('apple');

stories.add('Default', () => {
  const props = {
    categories: map(categories, category => category),
    onClickEmoji: console.log, // eslint-disable-line no-console
  };

  return (
    <EmojisPopup {...props} />
  );
});
