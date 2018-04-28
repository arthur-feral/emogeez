import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import {
  assert,
  expect,
} from 'chai';
import {
  map,
} from 'lodash';
import EmojisPopup, { CLASSNAMES } from './EmojisPopup.js';
import apple from 'emogeez-generator/emojis/apple/apple.json';

const categories = map(apple, category => category);

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <EmojisPopup {...props} />,
);

const story = {
  categories,
};
const onClickSpy = sinon.spy();

describe('EmojisPopup', () => {
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

    const categories = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.categoriesContainer);
    expect(categories.children.length).to.equal(8);
  });
  describe('history', () => {
    it('should not memorize', () => {
      const component = renderComponentIntoDOM({
        ...story,
        historyEnabled: false,
        onClickEmoji: onClickSpy,
      });

      const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face');
      assert.isNull(localStorage.getItem('emojis-history'));
      ReactTestUtils.Simulate.click(emoji);
      assert.isNull(localStorage.getItem('emojis-history'));
    });

    it('should memorize', () => {
      const component = renderComponentIntoDOM({
        ...story,
        historyEnabled: true,
        onClickEmoji: onClickSpy,
      });

      const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face');
      assert.isNull(localStorage.getItem('emojis-history'));
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":1}]');
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":2}]');

      const emoji2Wrapper = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'emojis-man')[0];
      ReactTestUtils.Simulate.click(emoji2Wrapper);
      const modifiersPopupOpened = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, `emojisCategoryModifiers isOpened`)[0];
      const emoji2 = modifiersPopupOpened.children[0];
      ReactTestUtils.Simulate.click(emoji2);

      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"👨","name":"man","fullName":"Man","category":"people","unicode":"1f468","shortnames":["man"],"shortname":"man","modifiers":{"man-type-1-2":{"parent":"man","fullName":"Man: Light Skin Tone","name":"man-type-1-2","symbol":"👨🏻","category":"people","unicode":"1f468-1f3fb","shortnames":["man-type-1-2"],"shortname":"man-type-1-2"},"man-type-3":{"parent":"man","fullName":"Man: Medium-Light Skin Tone","name":"man-type-3","symbol":"👨🏼","category":"people","unicode":"1f468-1f3fc","shortnames":["man-type-3"],"shortname":"man-type-3"},"man-type-4":{"parent":"man","fullName":"Man: Medium Skin Tone","name":"man-type-4","symbol":"👨🏽","category":"people","unicode":"1f468-1f3fd","shortnames":["man-type-4"],"shortname":"man-type-4"},"man-type-5":{"parent":"man","fullName":"Man: Medium-Dark Skin Tone","name":"man-type-5","symbol":"👨🏾","category":"people","unicode":"1f468-1f3fe","shortnames":["man-type-5"],"shortname":"man-type-5"},"man-type-6":{"parent":"man","fullName":"Man: Dark Skin Tone","name":"man-type-6","symbol":"👨🏿","category":"people","unicode":"1f468-1f3ff","shortnames":["man-type-6"],"shortname":"man-type-6"}},"count":1},{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":2}]');
    });

    it('should not memorize more than historyLimit', () => {
      localStorage.clear();
      const component = renderComponentIntoDOM({
        ...story,
        historyEnabled: true,
        historyLimit: 1,
        onClickEmoji: onClickSpy,
      });
      assert.isNull(localStorage.getItem('emojis-history'));

      const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face');
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":1}]');

      const emoji2 = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face-with-smiling-eyes');
      ReactTestUtils.Simulate.click(emoji2);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":1}]');
    });
  });
});
