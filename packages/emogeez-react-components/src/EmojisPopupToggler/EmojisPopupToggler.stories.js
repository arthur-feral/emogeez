import {
  map,
} from 'lodash';
import './_emojisPopupToggler.scss';
import EmojisPopupToggler from './EmojisPopupToggler';
import { withKnobs, select } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';

import React from 'react';
import { storiesOf } from '@storybook/react';
import appleJSON from '../../node_modules/emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisPopupToggler', module)
  .addDecorator(withKnobs)
  .addDecorator(centered);

export const defaultStory = {
  categories: map(appleJSON, category => category),
};

stories.add('Default', () => {
  const props = {
    ...defaultStory,
    position: select('position', ['top', 'left', 'bottom', 'right'], 'top'),
  };

  return (
    <EmojisPopupToggler {...props} />
  );
});
