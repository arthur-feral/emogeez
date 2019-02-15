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
import apple from 'emogeez-generator/emojis/apple/apple.json';
import EmojisPopup, { CLASSNAMES } from './EmojisPopup';

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
        onClickEmoji: () => onClickSpy,
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
        onClickEmoji: () => onClickSpy,
      });

      assert.isNull(localStorage.getItem('emojis-history'));
      const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face');
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":1}]');// eslint-disable-line
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":2}]');// eslint-disable-line

      const emoji2 = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face-with-smiling-eyes');
      ReactTestUtils.Simulate.click(emoji2);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":2},{"symbol":"😁","name":"grinning-face-with-smiling-eyes","fullName":"Beaming Face With Smiling Eyes","category":"people","unicode":"1f601","shortnames":["grin"],"shortname":"grin","count":1}]');// eslint-disable-line
    });

    it('should not display more than historyLimit', () => {
      localStorage.clear();
      const component = renderComponentIntoDOM({
        ...story,
        historyEnabled: true,
        historyLimit: 1,
        onClickEmoji: () => onClickSpy,
      });
      assert.isNull(localStorage.getItem('emojis-history'));
      const emoji = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face');
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":1}]');// eslint-disable-line
      ReactTestUtils.Simulate.click(emoji);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":2}]');// eslint-disable-line

      const emoji2 = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'emojis-grinning-face-with-smiling-eyes');
      ReactTestUtils.Simulate.click(emoji2);
      expect(localStorage.getItem('emojis-history')).to.deep.equal('[{"symbol":"😀","name":"grinning-face","fullName":"Grinning Face","category":"people","unicode":"1f600","shortnames":["grinning"],"shortname":"grinning","count":2},{"symbol":"😁","name":"grinning-face-with-smiling-eyes","fullName":"Beaming Face With Smiling Eyes","category":"people","unicode":"1f601","shortnames":["grin"],"shortname":"grin","count":1}]');// eslint-disable-line

      const historyCategory = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, CLASSNAMES.category)[0];
      expect(historyCategory.children[0].textContent).to.equal('history');
      expect(historyCategory.children[1].children.length).to.equal(1);
    });
  });
});
