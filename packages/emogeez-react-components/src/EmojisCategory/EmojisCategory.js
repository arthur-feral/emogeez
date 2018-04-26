import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, has } from 'lodash';
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
};
let canClose = true;

export default class EmojisCategory extends Component {
  static propTypes = {
    emojis: PropTypes.array,
    name: PropTypes.string.isRequired,
    onClickEmoji: PropTypes.func,
  };

  static defaultProps = {
    emojis: [],
    onClickEmoji: noop,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModifiersPanelOpened: false,
      modifierPanelName: '',
    };

    this.emojisNodes = {};
    this.modifierNodes = {};
    this.closePanel = this.closePanel.bind(this);
    this.renderEmojis = this.renderEmojis.bind(this);
    this.popupModifier = {
      isModifiersPanelOpened: false,
      modifierPanelName: '',
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.emojis.length !== nextProps.emojis.length) {
      return true;
    }

    if (this.props.name !== nextProps.name) {
      return true;
    }

    if (this.props.onClickEmoji !== nextProps.onClickEmoji) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    document.addEventListener('click', this.closePanel);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePanel);
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
      this.props.onClickEmoji(emoji, event);
      canClose = true;
      this.closePanel();
    }
  };

  getDOMNode() {
    return this.DOMNode;
  }

  renderEmojis(emojis) {
    return emojis.map(emoji => {
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
            key={emoji.name}
            className={CLASSNAMES.emoji}
            emoji={emoji}
            onClick={this.onClickEmoji}
          />
          {
            hasModifier && (
              <EmojiModifiers
                ref={(node) => {
                  this.modifierNodes[emoji.name] = node;
                }}
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