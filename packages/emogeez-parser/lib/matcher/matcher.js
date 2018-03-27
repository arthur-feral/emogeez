import {
  isUndefined,
  reduce,
} from 'lodash';
import {
  getUnicode,
} from '../utils';

const split = require('emoji-aware').split;

export default ({
  emojis,
  codePoints,
  codePointEmoji,
}) => {

  /**
   * return the emojis names from a text
   * @param text
   */
  const getNames = (text) => {
    const chars = split(text);
    return reduce(chars, (result, char) => {
      const name = codePointEmoji[getUnicode(char)];
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
   * @param {string} text
   * @return {boolean}
   */
  const hasEmojis = (text) => {
    const chars = split(text);

    return chars.filter(char => {
      const charUnicode = getUnicode(char);
      const emojiName = codePointEmoji[charUnicode];

      return !isUndefined(emojiName);
    }).length !== 0;
  };

  return {
    hasEmojis,
    getNames,
  };
}