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
   * replace aliases to shortname
   * @param {string} text
   * @returns {string}
   */
  const aliasesToShortnames = (text) => text.replace(ALIASES_REGEXP, (fullMatch, prevLimit, emoji) => `${prevLimit}:${ALIASES_MAP[emoji]}:`);

  const shortnamesToUTF8 = (theme, text) => {
    let newText = aliasesToShortnames(text);

    newText = newText.replace(SHORT_NAME_REGEXP, (match, shortname) => {
      let result = match;

      if (has(store.getShortnameToUtf8(theme), shortname)) {
        result = store.getShortnameToUtf8(theme)[shortname];
      }

      return result;
    });

    return newText;
  };

  /**
   * replace emoji with shortname in a string
   * @param {string} theme
   * @param {string} text
   * @returns {string}
   */
  const utf8ToShortnames = (theme, text) => {
    let textSplitted = split(text);

    if (textSplitted === false) {
      return aliasesToShortnames(text);
    }

    textSplitted = map(textSplitted, (char) => {
      const codepoint = getUnicode(char);
      const name = store.getCodepointToName(theme)[codepoint];
      if (name) {
        const shortname = store.getThemeEmojis(theme)[name].shortname;
        return `:${shortname}:`;
      }

      return char;
    });

    return textSplitted.join('');
  };

  const shortnamesToHTML = (theme, text, HTMLRenderer) => {
    if (!HTMLRenderer || !isFunction(HTMLRenderer)) {
      throw new Error('Missing HTML template to use utf8ToHTML');
    }

    return text.replace(SHORT_NAME_REGEXP, (match, shortname) => {
      let matched = match;
      const emoji = store.getEmojiByShortname(theme, shortname);
      if (emoji) {
        matched = HTMLRenderer(emoji);
      } else {
        return matched;
      }

      return matched;
    });
  };

  /**
   * replace shortname with image tag in a string
   * @param {string} theme
   * @param {string} text
   * @param {boolean} HTMLRenderer
   * @returns {string}
   */
  const utf8ToHTML = (theme, text, HTMLRenderer) =>
    shortnamesToHTML(theme, utf8ToShortnames(theme, text), HTMLRenderer);

  return {
    aliasesToShortnames,
    shortnamesToUTF8,
    utf8ToShortnames,
    shortnamesToHTML,
    utf8ToHTML,
  };
};
