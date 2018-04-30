import {
  map,
} from 'lodash';
import Emoji from './Emoji';
import { withKnobs, selectV2 } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';

import apple from 'emogeez-generator/emojis/apple/apple.json';

const emojis = apple.people.emojis;

const stories = storiesOf('Emoji', module)
  .addDecorator(withKnobs)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    emoji: emojis[0],
    onClick: console.log,
    //emoji: selectV2('emoji', map(emojis, emoji => emoji), emojis[0]),
  };

  return (
    <Emoji {...props} />
  );
});
