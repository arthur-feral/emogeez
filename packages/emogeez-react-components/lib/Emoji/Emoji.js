import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, omit } from 'lodash';

const COMPONENT_NAME = 'emoji';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
};

export default class Emoji extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    emoji: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    prefix: 'emojis',
    onClick: noop,
  };

  shouldComponentUpdate(nextProps) {
    const {
      emoji,
      onClick,
    } = this.props;
    if (emoji !== nextProps.emoji) {
      return true;
    }

    if (onClick !== nextProps.onClick) {
      return true;
    }

    return false;
  }

  onClick = (event) => {
    const {
      emoji,
      onClick,
    } = this.props;
    onClick(emoji, event);
  };

  getDOMNode() {
    return this.DOMNode;
  }

  render() {
    const {
      className,
      prefix,
      emoji: {
        name,
        symbol,
      },
    } = this.props;
    const cleanProps = omit(this.props, ['emoji', 'className']);

    return (
      <button
        ref={(node) => {
          this.DOMNode = node;
        }}
        {...cleanProps}
        type="button"
        className={classNames(CLASSNAMES.container, className, `${prefix}-${name}`)}
        draggable="false"
        onClick={this.onClick}
        aria-label={name}
      >
        {symbol}
      </button>
    );
  }
}
