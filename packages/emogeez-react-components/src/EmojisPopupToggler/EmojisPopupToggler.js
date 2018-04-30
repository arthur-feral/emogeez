import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import EmojisPopup from '../EmojisPopup/EmojisPopup';
import icons from '../Icons/Icons';
import { placeEmojiPopup } from '../placement';

const MARGIN_POPUP = 10;
const People = icons.people;
const COMPONENT_NAME = 'emojisPopupToggler';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
  popupWrapper: `${COMPONENT_NAME}PopupWrapper`,
  popup: `${COMPONENT_NAME}Popup`,
  popupArrow: `${COMPONENT_NAME}Arrow`,
  button: `${COMPONENT_NAME}Button`,
  icon: `${COMPONENT_NAME}Icon`,
};

export default class EmojisPopupToggler extends Component {
  static propTypes = {
    categories: PropTypes.array,
    onClickEmoji: PropTypes.func,
    isOpened: PropTypes.bool,
    historyEnabled: PropTypes.bool,
    historyLimit: PropTypes.number,
    onOpen: PropTypes.func,
    prefix: PropTypes.string,
    onClose: PropTypes.func,
    togglerRenderer: PropTypes.func,
  };

  static defaultProps = {
    prefix: 'emojis',
    categories: [],
    onClickEmoji: noop,
    isOpened: false,
    historyEnabled: false,
    historyLimit: 21,
    onOpen: noop,
    onClose: noop,
    togglerRenderer: () => (
      <button>
        <People className={CLASSNAMES.icon} />
      </button>
    ),
  };

  constructor(props) {
    super(props);

    this.container = null;
    this.popup = null;
    this.arrow = null;
    this.toggler = null;
    this.emojisPopup = null;
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onClickButton = this.onClickButton.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.isOpened = props.isOpened;
  }

  componentDidMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
    );
  }

  onClickButton = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isOpened) {
      this.openPopup();
    } else {
      this.closePopup();
    }
  };

  onClickEmoji = (emoji, event) => {
    this.closePopup();
    this.props.onClickEmoji(emoji, event);
  };

  closePopup() {
    this.isOpened = false;
    const $popup = this.popup;
    $popup.className = $popup.className.replace(' opened', '');
    this.emojisPopup.resetScroll();
    this.props.onClose();
  }

  openPopup() {
    this.isOpened = true;
    const $popup = this.popup;
    const $toggler = this.toggler;
    const $arrow = this.arrow;
    $popup.className = `${$popup.className} opened`;
    if ($popup && $toggler && $arrow) {
      placeEmojiPopup($popup, $toggler, MARGIN_POPUP, $arrow);
    }
    this.props.onOpen();
  }

  /**
   * called when we click on window
   * it checks if we clicked on the popup or outside
   * @param {Event} event
   */
  handleClickOutside(event) {
    const domNode = this.container;
    if ((!domNode || !domNode.contains(event.target)) && this.isOpened) {
      this.onClickButton(event);
    }
  }

  render() {
    const {
      className,
      categories,
      prefix,
      historyEnabled,
      historyLimit,
      togglerRenderer,
    } = this.props;

    const originalToggler = togglerRenderer(this.props, this.state);
    const toggler = React.cloneElement(
      originalToggler, {
        ref: (node) => {
          this.toggler = node;
        },
        className: classNames(CLASSNAMES.button, originalToggler.props.className),
        onClick: this.onClickButton,
        alt: originalToggler.props.alt || 'toggle emoji popup',
      },
    );

    return (
      <div
        ref={(node) => {
          this.container = node;
        }}
        className={classNames(className, CLASSNAMES.container)}
      >
        <div
          className={classNames(CLASSNAMES.popupWrapper)}
          ref={(node) => {
            this.popup = node;
          }}
        >
          <div
            key="popupArrow"
            ref={(node) => {
              this.arrow = node;
            }}
            className={CLASSNAMES.popupArrow}
          />
          <EmojisPopup
            ref={(node) => {
              this.emojisPopup = node;
            }}
            prefix={prefix}
            historyEnabled={historyEnabled}
            historyLimit={historyLimit}
            className={CLASSNAMES.popup}
            categories={categories}
            onClickEmoji={this.onClickEmoji}
          />
        </div>
        {toggler}
      </div>
    );
  }
}
