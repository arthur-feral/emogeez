import {
  map,
} from 'lodash';
import React from 'react';
import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import EmojisPopupToggler from './EmojisPopupToggler';
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

stories.add('Placement from parentClass', () => {
  const togglerStyle = {
    position: 'absolute',
    left: 10,
    top: 10,
  };

  const props = {
    categories: map(apple, category => category),
    onClickEmoji: console.log,
    style: togglerStyle,
    containerClassNameForPlacement: 'parentClass',
  };

  const parentStyle = {
    width: 500,
    height: 600,
    border: '1px solid red',
    position: 'relative',
  };

  return (
    <div style={parentStyle} className="parentClass">
      <EmojisPopupToggler {...props} />
    </div>
  );
});
