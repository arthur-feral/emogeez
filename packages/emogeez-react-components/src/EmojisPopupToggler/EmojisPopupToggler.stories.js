import {
  map,
} from 'lodash';
import React from 'react';
import EmojisPopupToggler from './EmojisPopupToggler';
import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import apple from '../../node_modules/emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisPopupToggler', module)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    categories: map(apple, category => category),
    onClickEmoji: console.log,
    historyEnabled: true,
  };

  return (
    <EmojisPopupToggler {...props} />
  );
});

stories.add('Custom toggler', () => {
  const props = {
    categories: map(apple, category => category),
    onClickEmoji: console.log,
    togglerRenderer: () => (
      <button className="customClassName">
        custom toggler
      </button>
    ),
  };

  return (
    <EmojisPopupToggler {...props} />
  );
});
