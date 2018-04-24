import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import EmojisPopup from '../EmojisPopup/EmojisPopup';

const COMPONENT_NAME = 'emojisPopupToggler';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
};

export default class EmojisPopupToggler extends Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    const {
      className,
    } = this.props;

    return (
      <div className={classNames(className, CLASSNAMES.container)}>

      </div>
    );
  }
}