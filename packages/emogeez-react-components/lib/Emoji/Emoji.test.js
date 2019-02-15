import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
} from 'chai';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import Emoji, { CLASSNAMES } from './Emoji';

const emojis = apple.people.emojis;

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <Emoji {...props} />,
);

const story = {
  emoji: emojis[0],
};
const onClickSpy = sinon.spy();

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

  it('support custom prefix', () => {
    const component = renderComponentIntoDOM({
      ...story,
      prefix: 'my-custom-prefix',
    });
    const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.container);
    expect(emoji.className).to.equal('emojiContainer my-custom-prefix-grinning-face');
  });

  it('should render properly', () => {
    const component = renderComponentIntoDOM(story);
    const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.container);
    expect(emoji.textContent).to.equal(emojis[0].symbol);
  });

  it('should react onClick', () => {
    const component = renderComponentIntoDOM({
      ...story,
      onClick: onClickSpy,
    });
    const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.container);
    expect(onClickSpy.callCount).to.equal(0);
    ReactTestUtils.Simulate.click(emoji);
    expect(onClickSpy.callCount).to.equal(1);
  });
});
