import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
} from 'chai';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import EmojisCategory, { CLASSNAMES } from './EmojisCategory';

const { emojis } = apple.people;

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <EmojisCategory {...props} />,
);

const story = {
  emojis,
  name: 'people',
};
const onClickSpy = sinon.spy();

describe('EmojisCategory', () => {
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

    const title = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.categoryTitleName);
    expect(title.textContent).to.equal('people');

    const emojis = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.categoryEmojis);
    expect(emojis.children.length).to.equal(340);
    const grinningFace = emojis.children[0].children[0];
    expect(grinningFace.className).to.equal('emojiContainer emojisCategoryEmoji emojisCategoryEmojiHasModifiers emojis-grinning-face');
    const man = emojis.children[105].children[0];
    expect(man.className).to.equal('emojiContainer emojisCategoryEmoji emojisCategoryEmojiHasModifiers emojis-man');
  });

  it('should react onClick', () => {
    const component = renderComponentIntoDOM({
      ...story,
      onClickEmoji: onClickSpy,
    });

    const emojis = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.categoryEmojis);
    const grinningFace = emojis.children[0].children[0];
    expect(onClickSpy.callCount).to.equal(0);
    ReactTestUtils.Simulate.click(grinningFace);
    expect(onClickSpy.callCount).to.equal(1);
    expect(onClickSpy.args[0][0].name).to.equal('grinning-face');
    const modifiersPopupOpened = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, `${CLASSNAMES.modifiers} isOpened`);
    expect(modifiersPopupOpened.length).to.equal(0);
  });

  it('should open the modifiers popup', () => {
    const component = renderComponentIntoDOM({
      ...story,
      onClickEmoji: onClickSpy,
    });
    const emojis = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.categoryEmojis);

    const man = emojis.children[105].children[0];
    onClickSpy.reset();
    expect(onClickSpy.callCount).to.equal(0);
    ReactTestUtils.Simulate.click(man);
    expect(onClickSpy.callCount).to.equal(0);
    const modifiersPopupOpened = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, `${CLASSNAMES.modifiers} isOpened`);
    expect(modifiersPopupOpened.length).to.equal(1);
  });
});
