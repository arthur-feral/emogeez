import {
  isUndefined,
  reduce,
} from 'lodash';
import {
  getUnicode,
} from '../utils';

const split = require('emoji-aware').split;

export default ({
  getEmojis,
  getCodePoints,
  getCodePointsToEmojis,
}) => {

  /**
   * return the emojis names from a text
   * @param {string} themeName
   * @param {string} text
   */
  const getNames = (themeName, text) => {
    const chars = split(text);
    return reduce(chars, (result, char) => {
      const name = getCodePointsToEmojis(themeName)[getUnicode(char)];
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

    return chars.filter(char => {
      const charUnicode = getUnicode(char);
      const emojiName = getCodePointsToEmojis(themeName)[charUnicode];

      return !isUndefined(emojiName);
    }).length !== 0;
  };

  return {
    hasEmojis,
    getNames,
  };
}