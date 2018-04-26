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
    historyLimit: PropTypes.number,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    categories: [],
    onClickEmoji: noop,
    isOpened: false,
    historyLimit: 21,
    onOpen: noop,
    onClose: noop,
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

  /**
   * when we click on the popup, we have to determine if you have to close the popup
   * if this.props.closeOnClick is provided has a boolean, simply check if is true
   * otherwise execute the func if its a func and test the return
   */
  onClickContent(event) {
    if (typeof this.props.closeOnClick === 'function') {
      this.setState({ opened: !this.props.closeOnClick(event) });
    }

    if (typeof this.props.closeOnClick === 'boolean') {
      if (this.props.closeOnClick) {
        this.setState({ opened: false });
      }
    }
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

  closePopup() {
    this.isOpened = false;
    const $popup = this.popup;
    $popup.className = $popup.className.replace(' opened', '');
    this.emojisPopup.resetScroll();
    this.props.onClose();
  }

  onClickEmoji = (emoji, event) => {
    this.closePopup();
    this.props.onClickEmoji(emoji, event);
  };

  render() {
    const {
      className,
      categories,
      historyLimit,
    } = this.props;

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
            historyLimit={historyLimit}
            className={CLASSNAMES.popup}
            categories={categories}
            onClickEmoji={this.onClickEmoji}
          />
        </div>
        <button
          ref={(node) => {
            this.toggler = node;
          }}
          className={CLASSNAMES.button}
          onClick={this.onClickButton}
          alt="toggle emoji popup"
        >
          <People className={CLASSNAMES.icon} />
        </button>
      </div>
    );
  }
}