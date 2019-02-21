import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, omit } from 'lodash';
import EmojisPopup from '../EmojisPopup/EmojisPopup';
import icons from '../Icons/Icons';
import { placeEmojiPopup } from '../placement';

const POPUP_CONTAINER_ID = 'emogeezPopup';
const OFFSET_POPUP = 10;
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

let onClickEmojiCallback = noop;
let togglersCount = 0;
let togglerOpenedUID = null;
let togglersMounted = [];
/**
 * return the popup DOM Node
 * @return {Element}
 */
const getPopupNode = () => {
  const $container = window.document.getElementById(POPUP_CONTAINER_ID);

  return $container.children[0];
};

const destroyPopup = () => {
  const container = window.document.getElementById(POPUP_CONTAINER_ID);
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
};

const buildPopup = (props) => {
  const {
    categories,
    prefix,
    historyEnabled,
    historyLimit,
  } = props;

  const emojiPopupContainer = window.document.createElement('div');
  emojiPopupContainer.id = POPUP_CONTAINER_ID;
  window.document.body.appendChild(emojiPopupContainer);
  ReactDOM.render((
    <div
      className={classNames(CLASSNAMES.popupWrapper)}
    >
      <div
        key="popupArrow"
        className={CLASSNAMES.popupArrow}
      />
      <EmojisPopup
        prefix={prefix}
        historyEnabled={historyEnabled}
        historyLimit={historyLimit}
        className={CLASSNAMES.popup}
        categories={categories}
        onClickEmoji={(emoji, event) => {
          onClickEmojiCallback(emoji, event);
        }}
      />
    </div>
  ), emojiPopupContainer);
};

export default class EmojisPopupToggler extends Component {
  static propTypes = {
    categories: PropTypes.array,
    className: PropTypes.string,
    onClickEmoji: PropTypes.func,
    isOpened: PropTypes.bool,
    historyEnabled: PropTypes.bool,
    historyLimit: PropTypes.number,
    onOpen: PropTypes.func,
    prefix: PropTypes.string,
    onClose: PropTypes.func,
    togglerRenderer: PropTypes.func,
    containerClassNameForPlacement: PropTypes.string,
    destroyPopupIfNoToggler: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    prefix: 'emojis',
    categories: [],
    onClickEmoji: noop,
    isOpened: false,
    historyEnabled: false,
    historyLimit: 21,
    onOpen: noop,
    onClose: noop,
    togglerRenderer: () => (
      <button type="button">
        <People className={CLASSNAMES.icon} />
      </button>
    ),
    containerClassNameForPlacement: null,
    destroyPopupIfNoToggler: false,
  };

  constructor(props) {
    super(props);

    togglersCount += 1;
    this.UID = togglersCount;
    this.container = null;
    this.toggler = null;
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onClickToggler = this.onClickToggler.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    togglerOpenedUID = props.isOpened ? this.UID : null;
  }

  componentDidMount() {
    const emojiPopupContainer = window.document.getElementById(POPUP_CONTAINER_ID);
    if (emojiPopupContainer === null) {
      buildPopup(this.props);
    }

    document.addEventListener(
      'click',
      this.handleClickOutside,
    );

    if (togglerOpenedUID === this.UID) {
      this.openPopup();
    }

    togglersMounted.push(this.UID);
  }


  componentWillReceiveProps(newProps) {
    const {
      categories,
    } = this.props;

    if (newProps.categories !== categories && newProps.categories.length !== 0) {
      destroyPopup();
      buildPopup(newProps);
    }
  }

  componentWillUnmount() {
    const {
      destroyPopupIfNoToggler,
    } = this.props;
    document.removeEventListener(
      'click',
      this.handleClickOutside,
    );

    togglersMounted = togglersMounted.filter(uid => uid !== this.UID);
    this.closePopup();
    if (destroyPopupIfNoToggler && togglersMounted.length === 0) {
      destroyPopup();
    }
  }

  onClickToggler(event) {
    event.preventDefault();
    event.stopPropagation();

    if (togglerOpenedUID !== this.UID) {
      this.closePopup();
    }

    if (togglerOpenedUID === null) {
      onClickEmojiCallback = this.onClickEmoji;
      this.openPopup();
    } else {
      this.closePopup();
    }

    return false;
  }

  onClickEmoji = (emoji, event) => {
    const {
      onClickEmoji,
    } = this.props;
    this.closePopup();
    onClickEmoji(emoji, event);
  };

  closePopup() {
    const {
      onClose,
    } = this.props;
    togglerOpenedUID = null;
    const $popup = getPopupNode();
    $popup.className = $popup.className.replace(' opened', '');
    onClose();
  }

  openPopup() {
    const {
      onOpen,
      containerClassNameForPlacement,
    } = this.props;
    togglerOpenedUID = this.UID;
    const $popup = getPopupNode();
    const $toggler = this.toggler;
    const $arrow = $popup.children[0];
    $popup.className = `${$popup.className} opened`;
    if ($popup && $toggler && $arrow) {
      placeEmojiPopup($popup, $toggler, OFFSET_POPUP, $arrow, containerClassNameForPlacement);
    }
    onOpen();
  }

  /**
   * called when we click on window
   * it checks if we clicked on the popup or outside
   * @param {Event} event
   */
  handleClickOutside(event) {
    if (togglerOpenedUID !== null) {
      const togglerNode = this.container;
      const popupNode = getPopupNode();
      if (
        !popupNode.contains(event.target)
        && !togglerNode.contains(event.target)
      ) {
        if (this.UID === togglerOpenedUID) {
          this.closePopup();
        }
      }
    }
  }

  render() {
    const {
      className,
      togglerRenderer,
    } = this.props;

    const sanitizedProps = omit(this.props, [
      'className',
      'categories',
      'onClickEmoji',
      'isOpened',
      'historyEnabled',
      'historyLimit',
      'onOpen',
      'prefix',
      'onClose',
      'togglerRenderer',
      'containerClassNameForPlacement',
      'destroyPopupIfNoToggler',
    ]);
    const originalToggler = togglerRenderer(this.props, this.state);
    const toggler = React.cloneElement(
      originalToggler, {
        ref: (node) => {
          this.toggler = node;
        },
        className: classNames(CLASSNAMES.button, originalToggler.props.className),
        onClick: this.onClickToggler,
        alt: originalToggler.props.alt || 'toggle emoji popup',
      },
    );

    return (
      <div
        ref={(node) => {
          this.container = node;
        }}
        {...sanitizedProps}
        className={classNames(className, CLASSNAMES.container)}
      >
        {toggler}
      </div>
    );
  }
}
