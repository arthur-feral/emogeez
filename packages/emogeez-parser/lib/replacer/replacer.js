import {
  forEach,
  has,
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

export default (config, store) => {

  /**
   * replace aliases to shortname
   * @param {string} text
   * @returns {string}
   */
  const aliasesToShortnames = (text) => text.replace(ALIASES_REGEXP, (fullMatch, prevLimit, emoji) => `${prevLimit}:${ALIASES_MAP[emoji]}:`);

  const shortnamesToUTF8 = (theme, text) => {
    let newText = aliasesToShortnames(text);

    newText = newText.replace(SHORT_NAME_REGEXP, (match, word) => {
      let result = match;

      if (has(store.getShortnameToUtf8(theme), word)) {
        result = store.getShortnameToUtf8(theme)[word];
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
      const name = store.getCodepointsToNames(theme)[codepoint];
      if (name) {
        const shortname = store.getEmojis(theme)[name].shortname;
        return `:${shortname}:`;
      }

      return char;
    });

    return textSplitted.join('');
  };

  return {
    aliasesToShortnames,
    shortnamesToUTF8,
    utf8ToShortnames,
  };
};
