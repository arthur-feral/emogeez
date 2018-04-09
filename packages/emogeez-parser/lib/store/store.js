import {
  forEach,
  reduce,
  includes,
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
  let themesCodepoints = { [config.theme]: {} };
  let themesShortnameToName = { [config.theme]: {} };
  let themesShortnameToUtf8 = { [config.theme]: {} };

  let themesCodepointToName = { [config.theme]: {} };

  const getThemeEmojis = (theme = config.theme) => themesEmojis[theme];
  const getEmojiByName = (theme = config.theme, name) => getThemeEmojis(theme)[name];
  const getCategories = (theme = config.theme) => themesCategories[theme];
  const getCodePoints = (theme = config.theme) => themesCodepoints[theme];
  const getShortnameToName = (theme = config.theme) => themesShortnameToName[theme];
  const getShortnameToUtf8 = (theme = config.theme) => themesShortnameToUtf8[theme];
  const getNameToUtf8 = (theme = config.theme, name) => getEmojiByName(theme, name).symbol;
  const getCodepointToName = (theme = config.theme) => themesCodepointToName[theme];
  const getEmojiByShortname = (theme = config.theme, shortname) =>
    getEmojiByName(theme, getShortnameToName(theme)[shortname]);

  const setTheme = (theme, emojisData) => {
    themesEmojis[theme] = {};
    themesCategories[theme] = {};
    themesCodepoints[theme] = [];
    themesShortnameToUtf8[theme] = {};
    themesShortnameToName[theme] = {};
    themesCodepointToName[theme] = {};
    forEach(emojisData, (category) => {
      themesCategories[theme][category.name] = category;

      forEach(category.emojis, (emoji) => {
        if (!blackList[emoji.name]) {
          themesEmojis[theme][emoji.name] = emoji;
          themesShortnameToUtf8[theme][emoji.shortname] = emoji.symbol;
          themesShortnameToName[theme][emoji.shortname] = emoji.name;
          themesCodepointToName[theme][emoji.unicode] = emoji.name;
          themesCodepoints[theme].push(emoji.unicode);

          forEach(emoji.modifiers, (modifier) => {
            if (!blackList[modifier.name]) {
              themesEmojis[theme][modifier.name] = modifier;
              themesShortnameToUtf8[theme][modifier.shortname] = modifier.symbol;
              themesShortnameToName[theme][modifier.shortname] = modifier.name;
              themesCodepointToName[theme][modifier.unicode] = modifier.name;
              themesCodepoints[theme].push(modifier.unicode);
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
    getThemeEmojis,
    getEmojiByName,
    getCategories,
    getCodePoints,
    getShortnameToName,
    getShortnameToUtf8,
    getNameToUtf8,
    getCodepointToName,
    getEmojiByShortname,

    setTheme,
    fetchTheme,
  };
}