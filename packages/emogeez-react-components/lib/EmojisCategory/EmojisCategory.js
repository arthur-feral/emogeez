import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, has, map } from 'lodash';
import Emoji from '../Emoji/Emoji';
import EmojiModifiers from '../EmojiModifiers/EmojiModifiers';
import { placeModifiersPopup } from '../placement';

const COMPONENT_NAME = 'emojisCategory';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
  categoryTitle: `${COMPONENT_NAME}Title`,
  categoryEmojis: `${COMPONENT_NAME}Emojis`,
  categoryTitleSymbol: `${COMPONENT_NAME}TitleSymbol`,
  categoryTitleName: `${COMPONENT_NAME}TitleName`,
  emojiWrapper: `${COMPONENT_NAME}EmojiWrapper`,
  modifiers: `${COMPONENT_NAME}Modifiers`,
  emoji: `${COMPONENT_NAME}Emoji`,
  hasModifiers: `${COMPONENT_NAME}EmojiHasModifiers`,
};
let canClose = true;

export default class EmojisCategory extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    emojis: PropTypes.object,
    name: PropTypes.string.isRequired,
    onClickEmoji: PropTypes.func,
  };

  static defaultProps = {
    emojis: {},
    prefix: 'emojis',
    onClickEmoji: noop,
  };

  constructor(props) {
    super(props);

    this.emojisNodes = {};
    this.modifierNodes = {};
    this.closePanel = this.closePanel.bind(this);
    this.renderEmojis = this.renderEmojis.bind(this);
    this.popupModifier = {
      isModifiersPanelOpened: false,
      modifierPanelName: '',
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.closePanel);
  }

  shouldComponentUpdate(nextProps) {
    const {
      emojis,
      name,
      onClickEmoji,
    } = this.props;
    if (emojis !== nextProps.emojis) {
      return true;
    }

    if (name !== nextProps.name) {
      return true;
    }

    if (onClickEmoji !== nextProps.onClickEmoji) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePanel);
  }

  onClickEmoji = (emoji, event) => {
    event.stopPropagation();
    event.preventDefault();
    const hasModifiers = has(emoji, 'modifiers');

    if (hasModifiers && !this.popupModifier.isModifiersPanelOpened) {
      this.popupModifier.modifierPanelName = emoji.name;
      const popup = this.modifierNodes[this.popupModifier.modifierPanelName].getDOMNode();
      popup.className = `${popup.className} isOpened`;
      this.popupModifier.isModifiersPanelOpened = true;

      canClose = false;
      placeModifiersPopup(
        this.modifierNodes[emoji.name].getDOMNode(),
        this.emojisNodes[emoji.name].getDOMNode(),
        this.DOMNode,
      );
      setTimeout(() => {
        canClose = true;
      }, 500);
    } else {
      this.props.onClickEmoji(emoji, event); // eslint-disable-line
      canClose = true;
      this.closePanel();
    }
  };

  getDOMNode() {
    return this.DOMNode;
  }

  closePanel() {
    if (canClose && this.popupModifier.isModifiersPanelOpened) {
      const popup = this.modifierNodes[this.popupModifier.modifierPanelName].getDOMNode();
      if (popup) {
        popup.className = popup.className.replace(' isOpened', '');
        this.popupModifier.isModifiersPanelOpened = false;
      }
    }
  }

  renderEmojis(emojis) {
    return map(emojis, (emoji) => {
      const {
        prefix,
      } = this.props;
      const hasModifier = has(emoji, 'modifiers');

      return (
        <span
          className={classNames(CLASSNAMES.emojiWrapper, { hasModifier })}
          key={`${CLASSNAMES.emojiWrapper}${emoji.name}`}
        >
          <Emoji
            ref={(node) => {
              this.emojisNodes[emoji.name] = node;
            }}
            prefix={prefix}
            key={emoji.name}
            className={classNames(CLASSNAMES.emoji, CLASSNAMES.hasModifiers)}
            emoji={emoji}
            onClick={this.onClickEmoji}
          />
          {
            hasModifier && (
              <EmojiModifiers
                ref={(node) => {
                  this.modifierNodes[emoji.name] = node;
                }}
                prefix={prefix}
                className={CLASSNAMES.modifiers}
                key={`${CLASSNAMES.modifiers}${emoji.name}`}
                emoji={emoji}
                onClickEmoji={this.onClickEmoji}
              />
            )
          }
        </span>
      );
    });
  }

  render() {
    const {
      className,
      name,
      emojis,
    } = this.props;

    return (
      <div
        ref={(node) => {
          this.DOMNode = node;
        }}
        className={classNames(className, CLASSNAMES.container)}
      >
        <div className={CLASSNAMES.categoryTitle}>
          <span className={CLASSNAMES.categoryTitleName}>{name}</span>
        </div>
        <div className={CLASSNAMES.categoryEmojis}>
          {this.renderEmojis(emojis)}
        </div>
      </div>
    );
  }
}
