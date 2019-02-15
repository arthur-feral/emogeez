import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
} from 'chai';
import {
  map,
} from 'lodash';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import EmojisPopupToggler, { CLASSNAMES } from './EmojisPopupToggler';

const categories = map(apple, category => category);

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <EmojisPopupToggler {...props} />,
);

const story = {
  categories,
};

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
    let popup = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, CLASSNAMES.popupWrapper);

    expect(popup.length).to.equal(0);
    ReactTestUtils.Simulate.click(toggler);
    popup = window.document.getElementById('emogeezPopup').children[0];
    expect(popup.className).to.equal('emojisPopupTogglerPopupWrapper opened');
    ReactTestUtils.Simulate.click(toggler);
    popup = window.document.getElementById('emogeezPopup').children[0];
    expect(popup.className).to.equal('emojisPopupTogglerPopupWrapper');
  });

  it('should have a custom toggler', () => {
    const component = renderComponentIntoDOM({
      ...story,
      togglerRenderer: () => (
        <button className="customClassName">
          hi
        </button>
      ),
    });
    const toggler = ReactTestUtils.findRenderedDOMComponentWithClass(component, CLASSNAMES.button);
    expect(toggler.textContent).to.equal('hi');
    expect(toggler.className).to.equal('emojisPopupTogglerButton customClassName');
  });
});
