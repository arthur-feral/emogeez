import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {
  expect,
} from 'chai';
import Emoji, { CLASSNAMES } from './Emoji.js';

const renderComponentIntoDOM = (props = {}) => ReactTestUtils.renderIntoDocument(
  <Emoji {...props} />,
);

const story = {
  name: 'grinning-face',
  symbol: 'symbol',
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
    expect(emoji.attributes.alt.value).to.equal('symbol');
  });
});
