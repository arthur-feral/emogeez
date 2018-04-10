import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const COMPONENT_NAME = 'emoji';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
};

export default class Emoji extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string,
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
        alt={name}
      />
    );
  }
}