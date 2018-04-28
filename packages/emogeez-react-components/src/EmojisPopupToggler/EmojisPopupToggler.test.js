import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
  assert,
} from 'chai';
import {
  map,
} from 'lodash';
import EmojisPopupToggler, { CLASSNAMES } from './EmojisPopupToggler.js';
import apple from 'emogeez-generator/emojis/apple/apple.json';

const categories = map(apple, category => category);

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <EmojisPopupToggler {...props} />,
);

const story = {
  categories,
};
const onClickSpy = sinon.spy();

describe('EmojisPopupToggler', () => {
  it('should accept custom classnames', () => {
    const component = renderComponentIntoDOM({
      ...story,
      className: 'customClass',
    });

    expect(() => {
      ReactTestUtils.findRenderedDOMComponentWithClass(component, 'customClass');
    }).to.not.throw();
  });

  it('should open the popup onClick on toggler', () => {
    const component = renderComponentIntoDOM(story);
    const toggler = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.button);
    const popup = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.popupWrapper);

    expect(popup.className).to.equal('emojisPopupTogglerPopupWrapper');
    ReactTestUtils.Simulate.click(toggler);
    expect(popup.className).to.equal('emojisPopupTogglerPopupWrapper opened');
    ReactTestUtils.Simulate.click(toggler);
    expect(popup.className).to.equal('emojisPopupTogglerPopupWrapper');
  });
});
