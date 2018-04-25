import {
  map,
} from 'lodash';
import React from 'react';
import './_emojisPopupToggler.scss';
import EmojisPopupToggler from './EmojisPopupToggler';
import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import apple from '../../node_modules/emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisPopupToggler', module)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    categories: map(apple, category => category),
  };

  return (
    <EmojisPopupToggler {...props} />
  );
});
