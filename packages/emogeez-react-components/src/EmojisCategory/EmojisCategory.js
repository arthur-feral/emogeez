import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import Emoji from '../Emoji/Emoji';

const COMPONENT_NAME = 'emojisCategory';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
  categoryTitle: `${COMPONENT_NAME}Title`,
  categoryEmojis: `${COMPONENT_NAME}Emojis`,
  categoryTitleSymbol: `${COMPONENT_NAME}TitleSymbol`,
  categoryTitleName: `${COMPONENT_NAME}TitleName`,
  emoji: `${COMPONENT_NAME}Emoji`,
};

export default class EmojisCategory extends Component {
  static propTypes = {
    emojis: PropTypes.array,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    onClickEmoji: PropTypes.func,
  };

  static defaultProps = {
    emojis: [],
    onClickEmoji: noop,
  };

  onClickEmoji = (name, symbol, event) => {
    this.props.onClickEmoji(name, symbol, event);
  };

  getDOMNode() {
    return this.domNode;
  }

  render() {
    const {
      className,
      name,
      symbol,
      emojis,
    } = this.props;

    return (
      <div
        ref={(node) => {
          this.domNode = node;
        }}
        className={classNames(className, CLASSNAMES.container)}
      >
        <div className={CLASSNAMES.categoryTitle}>
          {/*
            <Emoji name={emojis[0].name}
                 symbol={emojis[0].symbol}
          />
          */}
          <span className={CLASSNAMES.categoryTitleName}>{name}</span>
        </div>
        <div className={CLASSNAMES.categoryEmojis}>
          {emojis.map(emoji => (
            <Emoji
              key={emoji.name}
              className={CLASSNAMES.emoji}
              name={emoji.name}
              symbol={emoji.symbol}
              onClick={this.onClickEmoji}
            />
          ))}
        </div>
      </div>
    );
  }
}