import {
  forEach,
  reduce,
  includes,
} from 'lodash';

/**
 *
 * @param {Config} config
 * @param {object} http
 * @return {{emojis: {}, codePoints: Array, codePointEmoji: {}}}
 */
export default (config, http) => {
  let blackList = reduce(config.blackList, (result, emojiName) => ({ ...result, [emojiName]: emojiName }), {});
  let emojis = {};
  let categories = {};
  let codePoints = {};
  let codePointEmoji = {};

  const getEmojis = (theme = config.theme) => emojis[theme];
  const getCategories = (theme = config.theme) => categories[theme];
  const getCodePoints = (theme = config.theme) => codePoints[theme];
  const getCodePointsToEmojis = (theme = config.theme) => codePointEmoji[theme];

  const parse = (theme, emojisData) => {
    emojis[theme] = {};
    categories[theme] = {};
    codePoints[theme] = [];
    codePointEmoji[theme] = {};
    forEach(emojisData, (category) => {
      categories[theme][category.name] = category;

      forEach(category.emojis, (emoji) => {
        if (!blackList[emoji.name]) {
          emojis[theme][emoji.name] = emoji;
          codePointEmoji[theme][emoji.unicode] = emoji.name;
          codePoints[theme].push(emoji.unicode);

          forEach(emoji.modifiers, (modifier) => {
            if (!blackList[modifier.name]) {
              emojis[theme][modifier.name] = modifier;
              codePointEmoji[theme][modifier.unicode] = modifier.name;
              codePoints[theme].push(modifier.unicode);
            }
          });
        }
      });
    });
  };

  const fetchTheme = (theme = config.theme) => {
    http.get(theme)
      .then(emojisData => parse(theme, emojisData));
  };

  return {
    parse,
    fetchTheme,
    getCategories,
    getEmojis,
    getCodePoints,
    getCodePointsToEmojis,
  };
}