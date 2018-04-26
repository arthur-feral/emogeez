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
    emoji: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: noop,
  };

  shouldComponentUpdate(nextProps) {
    if (this.props.emoji !== nextProps.emoji) {
      return true;
    }

    if (this.props.onClick !== nextProps.onClick) {
      return true;
    }

    return false;
  }

  onClick = (event) => {
    this.props.onClick(this.props.emoji, event);
  };

  getDOMNode() {
    return this.DOMNode;
  }

  render() {
    const {
      className,
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
        className={classNames(CLASSNAMES.container, className, `emojis-${name}`)}
        draggable="false"
        onClick={this.onClick}
        aria-label={name}
        alt={symbol}
      />
    );
  }
}