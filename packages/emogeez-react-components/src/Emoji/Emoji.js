import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

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

  onClick = (event) => {
    event.preventDefault();
    this.props.onClick(this.props.emoji, event);
  };

  render() {
    const {
      className,
      emoji: {
        name,
        symbol,
      },
    } = this.props;

    return (
      <button
        className={classNames(CLASSNAMES.container, className, `emojis-${name}`)}
        draggable="false"
        onClick={this.onClick}
        aria-label={name}
        alt={symbol}
      />
    );
  }
}