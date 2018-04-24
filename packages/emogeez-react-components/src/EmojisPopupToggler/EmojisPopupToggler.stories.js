import {
  map,
} from 'lodash';
import './_emojisPopupToggler.scss';
import EmojisPopupToggler from './EmojisPopupToggler';
import centered from '@storybook/addon-centered';

import React from 'react';
import { storiesOf } from '@storybook/react';
import appleJSON from '../../node_modules/emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisPopupToggler', module)
  .addDecorator(centered);

export const defaultStory = {
  categories: map(appleJSON, category => category),
};

stories.add('Default', () => {
  const props = {
    ...defaultStory,
  };

  return (
    <EmojisPopupToggler {...props} />
  );
});
