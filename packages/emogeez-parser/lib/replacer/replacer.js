import {
  forEach,
  has,
  isFunction,
  map,
} from 'lodash';
import {
  getUnicode,
} from '../utils';

const split = require('emoji-aware').split;

const {
  ALIASES_MAP,
  ALIASES_REGEXP,
} = require('./aliases');

const SHORT_NAME_REGEXP = /:([a-z0-9-]+):/mg;

export default (store) => {

  /**
   * replace aliases to name
   * @param {string} text
   * @returns {string}
   */
  const aliasesToNames = (text) => text.replace(ALIASES_REGEXP, (fullMatch, prevLimit, emoji) => `${prevLimit}:${ALIASES_MAP[emoji]}:`);

  const toUTF8 = (theme, text) => {
    let newText = aliasesToNames(text);

    newText = newText.replace(SHORT_NAME_REGEXP, (match, name) => {
      let result = match;
      const hasEmoji = store.hasEmoji(theme, name);

      if (hasEmoji) {
        result = store.toUTF8(theme, name);
      }

      return result;
    });

    return newText;
  };

  /**
   * replace emoji with name in a string
   * @param {string} theme
   * @param {string} text
   * @returns {string}
   */
  const utf8ToNames = (theme, text) => {
    let textSplitted = split(text);

    if (textSplitted === false) {
      return aliasesToNames(text);
    }

    textSplitted = map(textSplitted, (char) => {
      const codepoint = getUnicode(char);
      const name = store.getNameFromCodepoint(theme, codepoint);
      if (name) {
        return `:${name}:`;
      }

      return char;
    });

    return textSplitted.join('');
  };

  const namesToHTML = (theme, text, HTMLRenderer) => {
    if (!HTMLRenderer || !isFunction(HTMLRenderer)) {
      throw new Error('Missing HTML template to use UTF8ToHTML');
    }

    return text.replace(SHORT_NAME_REGEXP, (match, name) => {
      let matched = match;
      const emoji = store.getEmojiByName(theme, name);
      if (emoji) {
        matched = HTMLRenderer(emoji);
      } else {
        return matched;
      }

      return matched;
    });
  };

  /**
   * replace name with image tag in a string
   * @param {string} theme
   * @param {string} text
   * @param {boolean} HTMLRenderer
   * @returns {string}
   */
  const UTF8ToHTML = (theme, text, HTMLRenderer) =>
    namesToHTML(theme, utf8ToNames(theme, text), HTMLRenderer);

  return {
    aliasesToNames,
    toUTF8,
    utf8ToNames,
    namesToHTML,
    UTF8ToHTML,
  };
};
