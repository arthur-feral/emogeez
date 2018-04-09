import {
  forEach,
  reduce,
  includes,
  isUndefined,
  has,
} from 'lodash';

/**
 *
 * @param {Config} config
 * @param {object} http
 * @return {object}
 */
export default (config, http) => {
  let blackList = reduce(config.blackList, (result, emojiName) => ({ ...result, [emojiName]: emojiName }), {});
  let themesEmojis = { [config.theme]: {} };
  let themesCategories = { [config.theme]: {} };
  let themesCodepointToName = { [config.theme]: {} };

  const getEmojis = (theme = config.theme) => themesEmojis[theme];
  const hasEmoji = (theme = config.theme, name) => {
    return has(getEmojis(theme), name);
  };
  const getEmojiByName = (theme = config.theme, name) => getEmojis(theme)[name];
  const getCategories = (theme = config.theme) => themesCategories[theme];
  const getNameFromCodepoint = (theme = config.theme, name) => themesCodepointToName[theme][name];
  const toUTF8 = (theme, name) => getEmojiByName(theme, name).symbol;

  const setTheme = (theme, emojisData) => {
    themesEmojis[theme] = {};
    themesCategories[theme] = {};
    themesCodepointToName[theme] = {};
    forEach(emojisData, (category) => {
      themesCategories[theme][category.name] = category;
      forEach(category.emojis, (emoji) => {
        if (!blackList[emoji.name]) {
          themesEmojis[theme][emoji.name] = emoji;
          themesCodepointToName[theme][emoji.unicode] = emoji.name;
          forEach(emoji.modifiers, (modifier) => {
            if (!blackList[modifier.name]) {
              themesEmojis[theme][modifier.name] = modifier;
              themesCodepointToName[theme][modifier.unicode] = modifier.name;
            }
          });
        }
      });
    });
  };

  const fetchTheme = (theme = config.theme) => {
    http.get(theme)
      .then(emojisData => setTheme(theme, emojisData));
  };

  return {
    getEmojis,
    hasEmoji,
    getEmojiByName,
    getCategories,
    getNameFromCodepoint,
    toUTF8,

    setTheme,
    fetchTheme,
  };
}