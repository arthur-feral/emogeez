import {
  forEach,
  has,
} from 'lodash';

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
  return {
    aliasesToShortnames,
    shortnamesToUTF8,
  };
};
