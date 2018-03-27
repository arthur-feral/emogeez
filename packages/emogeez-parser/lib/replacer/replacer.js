import {
  forEach,
} from 'lodash';

const {
  ALIASES_MAP,
  ALIASES_REGEXP,
} = require('./aliases');

const SHORT_NAME_REGEXP = /:([a-z0-9-]+):/mg;

export default (configurator) => {

  /**
   * replace aliases to shortname
   * @param {string} text
   * @returns {string}
   */
  const aliasesToShortnames = (text) => text.replace(ALIASES_REGEXP, (fullMatch, prevLimit, emoji) => `${prevLimit}:${ALIASES_MAP[emoji]}:`);

  const shortnamesToUTF8 = (text) => {
    let newText = aliasesToShortnames(text);

    newText = newText.replace(SHORT_NAME_REGEXP, (match, word) => {
      let result = match;
      if (_.has(shortnameToUtf8.apple, word)) {
        result = shortnameToUtf8.apple[word];
      }

      if (_.has(shortnameToUtf8[theme], word)) {
        result = shortnameToUtf8[theme][word];
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
