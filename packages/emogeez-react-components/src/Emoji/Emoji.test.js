import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
} from 'chai';
import Emoji, { CLASSNAMES } from './Emoji.js';
import apple from 'emogeez-generator/emojis/apple/apple.json';
const emojis = apple.people.emojis;

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <Emoji {...props} />,
);

const story = {
  emoji: emojis[0],
};

describe('Emoji', () => {
  it('should accept custom classnames', () => {
    const component = renderComponentIntoDOM({
      ...story,
      className: 'customClass',
    });

    expect(() => {
      ReactTestUtils.findRenderedDOMComponentWithClass(component, 'customClass');
    }).to.not.throw();
  });

  it('should render properly', () => {
    const component = renderComponentIntoDOM({
      ...story,
      className: 'customClass',
    });
    const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.container);
    expect(emoji.attributes.alt.value).to.equal(emojis[0].symbol);
  });
});
