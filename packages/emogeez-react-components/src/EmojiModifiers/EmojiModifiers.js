import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, map } from 'lodash';
import Emoji from '../Emoji/Emoji';

const COMPONENT_NAME = 'emojiModifiers';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
  emoji: `${COMPONENT_NAME}Emoji`,
};

export default class EmojiModifiers extends Component {
  static propTypes = {
    emoji: PropTypes.object.isRequired,
    onClickEmoji: PropTypes.func,
  };

  static defaultProps = {
    onClickEmoji: noop,
  };

  onClick = (emoji, event) => {
    this.props.onClickEmoji(emoji, event);
  };

  getDOMNode() {
    return this.DOMNode;
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.emoji !== nextProps.emoji) {
      return true;
    }

    if (this.props.onClickEmoji !== nextProps.onClickEmoji) {
      return true;
    }

    return false;
  }

  render() {
    const {
      className,
      emoji,
    } = this.props;

    const emojis = {
      [emoji.name]: emoji,
      ...emoji.modifiers,
    };

    return (
      <span
        ref={(node) => {
          this.DOMNode = node;
        }}
        className={classNames(CLASSNAMES.container, className)}>
        {
          map(emojis, (modifier) => (
            <Emoji
              key={`${CLASSNAMES.container}${modifier.name}`}
              className={CLASSNAMES.emoji}
              emoji={modifier}
              onClick={this.onClick}
            />
          ))
        }
      </span>
    );
  }
}