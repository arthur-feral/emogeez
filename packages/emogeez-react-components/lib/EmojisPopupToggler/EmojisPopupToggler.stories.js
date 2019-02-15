import {
  map,
} from 'lodash';
import React from 'react';
import centered from '@storybook/addon-centered';
import { storiesOf } from '@storybook/react';
import EmojisPopupToggler from './EmojisPopupToggler';
import apple from '../../node_modules/emogeez-generator/emojis/apple/apple.json';

const stories = storiesOf('EmojisPopupToggler', module);
//.addDecorator(centered);

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

stories.add('Multiples togglers', () => {
  const parent = {
    style: {
      width: 500,
      height: 600,
      border: '1px solid red',
      position: 'relative',
    },
    className: 'parentClass',
  };

  const toggler1 = {
    categories: map(apple, category => category),
    onClickEmoji: (emoji) => {
      console.log('toggler1', emoji);
    },
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    containerClassNameForPlacement: 'parentClass',
  };

  const toggler2 = {
    categories: map(apple, category => category),
    onClickEmoji: (emoji) => {
      console.log('toggler2', emoji);
    },
    style: {
      position: 'absolute',
      right: 10,
      bottom: 10,
    },
    containerClassNameForPlacement: 'parentClass',
  };

  const toggler3 = {
    categories: map(apple, category => category),
    onClickEmoji: (emoji) => {
      console.log('toggler3', emoji);
    },
    style: {
      position: 'absolute',
      bottom: 10,
      left: 10,
    },
    containerClassNameForPlacement: 'parentClass',
  };

  const toggler4 = {
    categories: map(apple, category => category),
    onClickEmoji: (emoji) => {
      console.log('toggler4', emoji);
    },
    style: {
      position: 'absolute',
      left: 10,
      top: 10,
    },
    containerClassNameForPlacement: 'parentClass',
  };

  const toggler5 = {
    categories: map(apple, category => category),
    onClickEmoji: (emoji) => {
      console.log('toggler5', emoji);
    },
    style: {
      position: 'absolute',
      right: 10,
      top: 100,
    },
    togglerRenderer: () => (
      <button className="customClassName">
        position from window
      </button>
    ),
  };

  const toggler6 = {
    categories: map(apple, category => category),
    onClickEmoji: (emoji) => {
      console.log('toggler6', emoji);
    },
    style: {
      position: 'absolute',
      left: 250,
      top: 300,
    },
  };

  return (
    <div {...parent}>
      <EmojisPopupToggler {...toggler1} />
      <EmojisPopupToggler {...toggler2} />
      <EmojisPopupToggler {...toggler3} />
      <EmojisPopupToggler {...toggler4} />
      <EmojisPopupToggler {...toggler5} />
      <EmojisPopupToggler {...toggler6} />
    </div>
  );
});