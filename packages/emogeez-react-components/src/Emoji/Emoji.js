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
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: noop,
  };

  onClick = (event) => {
    event.preventDefault();
    this.props.onClick(this.props.name, this.props.symbol, event);
  };

  render() {
    const {
      className,
      name,
      symbol,
    } = this.props;

    return (
      <span
        className={classNames(CLASSNAMES.container, className, `emojis-${name}`)}
        draggable="false"
        onClick={this.onClick}
        aria-label={name}
        alt={symbol}
      />
    );
  }
}