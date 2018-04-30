import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, take, sortBy, reverse, findIndex, forEach } from 'lodash';
import store from 'store';
import EmojisCategory from '../EmojisCategory/EmojisCategory';
import icons from '../Icons/Icons';

const COMPONENT_NAME = 'emojisPopup';
export const CLASSNAMES = {
  container: `${COMPONENT_NAME}Container`,
  category: `${COMPONENT_NAME}Category`,
  categoriesContainer: `${COMPONENT_NAME}CategoriesContainer`,
  emojiCategory: `${COMPONENT_NAME}EmojiCategory`,
  categories: `${COMPONENT_NAME}Categories`,
  emojiCategoryIcon: `${COMPONENT_NAME}EmojiCategoryIcon`,
  emojiCategoryDot: `${COMPONENT_NAME}EmojiCategoryDot`,
};

const SCROLL_TRANSITION_TIMING = 300;
const MAX_COUNT = 10;

/* eslint-disable */
const ease = function (currentTime, start, change, duration) {
  currentTime /= duration / 2;
  if (currentTime < 1) {
    return change / 2 * currentTime * currentTime + start;
  }
  currentTime -= 1;
  return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
};

const scrollTo = function (element, to, duration) {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;

  const animateScroll = function (elapsedTime) {
    elapsedTime += increment;
    element.scrollTop = ease(elapsedTime, start, change, duration);
    if (elapsedTime < duration) {
      setTimeout(function () {
        animateScroll(elapsedTime);
      }, increment);
    }
  };

  animateScroll(0);
};
/* eslint-enable */

const loadHistory = (limit) => {
  let history = store.get('emojis-history') || [];
  history = sortBy(history, emoji => emoji.count);
  history = reverse(history);
  history = take(history, limit);

  return history;
};

const updateHistory = (emoji) => {
  let history = store.get('emojis-history') || [];
  const selected = findIndex(history, emojiHistory => emojiHistory.name === emoji.name);
  if (selected === -1) {
    history.push({
      ...emoji,
      count: 1,
    });
  } else {
    history[selected].count += 1;
  }

  // in case an emoji has been clicked MAX_COUNT times
  // we reset the counts so any emoji got a chance to be on history
  const winner = findIndex(history, emojiHistory => emojiHistory.count === MAX_COUNT);
  if (winner >= 0) {
    history = history.map(emoji => ({
      ...emoji,
      count: 1,
    }));
  }

  store.set('emojis-history', history);
};

const getHistory = limit => ({
  symbol: '',
  name: 'history',
  fullName: 'History',
  emojis: loadHistory(limit),
});

export default class EmojisPopup extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    categories: PropTypes.array,
    onClickEmoji: PropTypes.func,
    historyEnabled: PropTypes.bool,
    historyLimit: PropTypes.number,
  };

  static defaultProps = {
    categories: [],
    prefix: 'emojis',
    onClickEmoji: noop,
    historyEnabled: true,
    historyLimit: 21,
  };

  constructor(props) {
    super(props);

    this.categoriesList = {};
    this.categoriesListPaddingTop = 0;
    this.categories = {};
    this.categoriesTabs = {};
    this.onClickEmoji = this.onClickEmoji.bind(this);

    this.state = {
      history: this.props.historyEnabled ?
        getHistory(props.historyLimit) :
        null,
    };
  }

  componentDidMount() {
    this.categoriesListPaddingTop = parseInt(window.getComputedStyle(this.categoriesList, null).getPropertyValue('padding-top'), 10);
  }

  shouldComponentUpdate(newProps, newState) {
    if (newProps.categories !== this.props.categories) {
      return true;
    }

    if (newProps.prefix !== this.props.prefix) {
      return true;
    }

    if (newProps.categories !== this.props.categories) {
      return true;
    }

    if (newProps.onClickEmoji !== this.props.onClickEmoji) {
      return true;
    }

    if (newProps.historyEnabled !== this.props.historyEnabled) {
      return true;
    }

    if (newProps.historyLimit !== this.props.historyLimit) {
      return true;
    }

    if (newState.history !== this.state.history) {
      return true;
    }


    return false;
  }

  onClickEmoji(emoji, event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.props.historyEnabled) {
      updateHistory(emoji);

      this.setState({
        history: getHistory(this.props.historyLimit),
      });
    }

    this.resetScroll();
    this.props.onClickEmoji(emoji, event);
  }

  onClickCategory = (categoryName) => {
    const $category = this.categories[categoryName].getDOMNode();
    if ($category && this.categoriesList) {
      scrollTo(this.categoriesList, $category.offsetTop, SCROLL_TRANSITION_TIMING);
    }
  };

  onScroll = (event) => {
    const top = this.categoriesList.scrollTop + this.categoriesListPaddingTop + 1;

    forEach(this.categories, (node) => {
      const box = {
        top: node.getDOMNode().offsetTop,
        bottom: node.getDOMNode().offsetTop + node.getDOMNode().offsetHeight,
      };

      this.categoriesTabs[node.props.name].className = this.categoriesTabs[node.props.name].className.replace(' selected', '');

      if (top > box.top && top < box.bottom) {
        this.categoriesTabs[node.props.name].className += ' selected';
      }
    });

    // prevent from scrolling the window when we scroll the emojis list
    event.stopPropagation();
  };

  resetScroll() {
    this.categoriesList.scrollTop = 0;
  }

  renderCategoryTab = (category, index) => {
    const Icon = icons[category.name];

    return (
      <span
        ref={(node) => {
          this.categoriesTabs[category.name] = node;
        }}
        key={category.name}
        className={classNames(CLASSNAMES.emojiCategory, { selected: index === 0 })}
      >
        <button
          onClick={() => {
            this.onClickCategory(category.name);
          }}
        >
          <Icon className={CLASSNAMES.emojiCategoryIcon} />
        </button>
        <span className={CLASSNAMES.emojiCategoryDot} />
      </span>
    );
  };

  render() {
    const {
      className,
      categories,
      historyEnabled,
      prefix,
    } = this.props;

    const {
      history,
    } = this.state;

    let fullCategories = categories;
    if (historyEnabled && history && history.emojis.length) {
      fullCategories = [history].concat(categories);
    }

    return (
      <div
        className={classNames(className, CLASSNAMES.container)}
      >
        <div
          key="categoryList"
          ref={(node) => {
            this.categoriesList = node;
          }}
          onScroll={this.onScroll}
          className={CLASSNAMES.categoriesContainer}
        >
          {
            fullCategories.map(category => (
              <EmojisCategory
                ref={(node) => {
                  this.categories[category.name] = node;
                }}
                key={category.name}
                className={CLASSNAMES.category}
                name={category.name}
                symbol={category.symbol}
                emojis={category.emojis}
                prefix={prefix}
                onClickEmoji={this.onClickEmoji}
              />
            ))
          }
        </div>
        <div key="categoryTabs" className={CLASSNAMES.categories}>
          {fullCategories.map(this.renderCategoryTab)}
        </div>
      </div>
    );
  }
}
