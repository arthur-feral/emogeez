import {
  map,
} from 'lodash';
import EmojisPopup from './EmojisPopup';
import centered from '@storybook/addon-centered';

import React from 'react';
import { storiesOf } from '@storybook/react';
import apple from 'emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisPopup', module)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    categories: map(apple, category => category),
    onClickEmoji: console.log,
  };

  return (
    <EmojisPopup {...props} />
  );
});
