import {
  keys,
} from 'lodash';
import './_emoji.scss';
import Emoji from './Emoji';
import { withKnobs, select } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';

const stories = storiesOf('Emoji', module)
  .addDecorator(withKnobs)
  .addDecorator(centered);

export const defaultStory = {
  name: 'grinning-face',
  //name: select('name', names, 'grinning-face'),
  symbol: '😀',
};

stories.add('Default', () => {
  const props = {
    ...defaultStory,
    className: 'touloulou',
  };

  return (
    <Emoji {...props} />
  );
});
