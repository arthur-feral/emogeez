import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, forEach } from 'lodash';
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

export default class EmojisPopup extends Component {
  static propTypes = {
    categories: PropTypes.array,
    onClickEmoji: PropTypes.func,
  };

  static defaultProps = {
    categories: [],
    onClickEmoji: noop,
  };

  constructor(props) {
    super(props);

    this.categoriesList = {};
    this.categoriesListPaddingTop = 0;
    this.categories = {};
    this.categoriesTabs = {};
  }

  componentDidMount() {
    this.categoriesListPaddingTop = parseInt(window.getComputedStyle(this.categoriesList, null).getPropertyValue('padding-top'), 10);
  }

  onClickEmoji = (name, symbol, event) => {
    this.props.onClickEmoji(name, symbol, event);
  };

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

  renderCategoryTab = (category, index) => {
    const Icon = icons[category.name];

    return (
      <span
        ref={(node) => {
          this.categoriesTabs[category.name] = node;
        }}
        key={category.emojis[0].name}
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
    } = this.props;

    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
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
            categories.map((category) => (
              <div key={category.name}>
                <EmojisCategory
                  ref={(node) => {
                    this.categories[category.name] = node;
                  }}
                  className={CLASSNAMES.category}
                  name={category.name}
                  symbol={category.symbol}
                  emojis={category.emojis}
                />
              </div>
            ))
          }
        </div>
        <div key="categoryTabs" className={CLASSNAMES.categories}>
          {categories.map(this.renderCategoryTab)}
        </div>
      </div>
    );
  }
}