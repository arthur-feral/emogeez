import {
  find,
} from 'lodash';
import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
} from 'chai';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import EmojiModifiers, { CLASSNAMES } from './EmojiModifiers';

const emojis = apple.people.emojis;
const emoji = find(emojis, e => e.name === 'boy');

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <EmojiModifiers {...props} />,
);

const story = {
  emoji,
};
const onClickSpy = sinon.spy();

describe('EmojiModifiers', () => {
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
    const component = renderComponentIntoDOM(story);

    const modifiers = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.container);
    expect(modifiers.children.length).to.equal(6);
    expect(modifiers.children[0].className).to.equal('emojiContainer emojiModifiersEmoji emojis-boy');
    expect(modifiers.children[1].className).to.equal('emojiContainer emojiModifiersEmoji emojis-boy-type-1-2');
    expect(modifiers.children[2].className).to.equal('emojiContainer emojiModifiersEmoji emojis-boy-type-3');
    expect(modifiers.children[3].className).to.equal('emojiContainer emojiModifiersEmoji emojis-boy-type-4');
    expect(modifiers.children[4].className).to.equal('emojiContainer emojiModifiersEmoji emojis-boy-type-5');
    expect(modifiers.children[5].className).to.equal('emojiContainer emojiModifiersEmoji emojis-boy-type-6');
  });

  it('should react onClick', () => {
    const component = renderComponentIntoDOM({
      ...story,
      onClickEmoji: onClickSpy,
    });
    const modifiers = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.container);

    expect(onClickSpy.callCount).to.equal(0);
    ReactTestUtils.Simulate.click(modifiers.children[2]);
    expect(onClickSpy.callCount).to.equal(1);
    expect(onClickSpy.args[0][0].name).to.equal('boy-type-3');
  });
});
