import {
  isUndefined,
  reduce,
  isString,
} from 'lodash';
import {
  getUnicode,
} from '../utils';

const split = require('emoji-aware').split;

export default ({
  getNameFromCodepoint,
}) => {
  /**
   * return the emojis names from a text
   * @param {string} themeName
   * @param {string} text
   */
  const getNames = (themeName, text) => {
    const chars = split(text);
    return reduce(chars, (result, char) => {
      const name = getNameFromCodepoint(themeName, getUnicode(char));
      if (!isUndefined(name)) {
        return [
          ...result,
          name,
        ];
      }

      return result;
    }, []);
  };

  /**
   * return true if an emoji is present in the text
   * @param {string} themeName
   * @param {string} text
   * @return {boolean}
   */
  const hasEmojis = (themeName, text) => {
    const chars = split(text);

    return chars.filter((char) => {
      const charUnicode = getUnicode(char);
      const emojiName = getNameFromCodepoint(themeName, charUnicode);

      return !isUndefined(emojiName);
    }).length !== 0;
  };

  /**
   * return true if the text contains only emojis as chars
   * IMPORTANT the emojis in the text must be utf8 encoded (not shortnames)
   * @param {string} themeName
   * @param {string} text
   * @return {*}
   */
  const hasOnlyEmojis = (themeName, text) => {
    if (!isString(text)) {
      return false;
    }

    if (!text.length) {
      return false;
    }

    const chars = split(text);

    const emojis = chars.filter((char) => {
      const charUnicode = getUnicode(char);
      const emojiName = getNameFromCodepoint(themeName, charUnicode);

      return !isUndefined(emojiName) || /\s/g.test(char);
    });

    return (chars && (chars.length === emojis.length));
  };

  /**
   * return true if the text contains only one emoji
   * IMPORTANT the emojis in the text must be utf8 encoded (not shortnames)
   * @param {string} themeName
   * @param {string} text
   * @return {*}
   */
  const hasOnlyOneEmoji = (themeName, text) => {
    if (!isString(text)) {
      return false;
    }

    if (!text.length) {
      return false;
    }

    const chars = split(text);

    const emojis = chars.filter((char) => {
      const charUnicode = getUnicode(char);
      const emojiName = getNameFromCodepoint(themeName, charUnicode);

      return !isUndefined(emojiName);
    });

    return (chars && (chars.length === emojis.length)) && emojis.length === 1;
  };

  return {
    hasEmojis,
    getNames,
    hasOnlyEmojis,
    hasOnlyOneEmoji,
  };
};
