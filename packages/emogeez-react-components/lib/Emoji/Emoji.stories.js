import centered from '@storybook/addon-centered';
import React from 'react';
import { storiesOf } from '@storybook/react';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import Emoji from './Emoji';

const emojis = apple.people.emojis;

const stories = storiesOf('Emoji', module)
  .addDecorator(centered);

stories.add('Default', () => {
  const props = {
    emoji: emojis[0],
    onClick: console.log,
  };

  return (
    <Emoji {...props} />
  );
});
