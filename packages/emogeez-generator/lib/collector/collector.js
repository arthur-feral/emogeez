import fs from 'fs-extra';
import {
  reduce,
  omit,
  map,
  findIndex,
  has,
  forEach,
  get,
  keys,
  size,
} from 'lodash';
import {
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_SUCCESS,
  COLLECTOR_COLLECT_DONE,
  PARSER_PARSED_ALL_IMAGES,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_FOUND_MODIFIERS,
  GENERATOR_GENERATE_THEMES_SUCCESS,
  GENERATOR_GENERATE_SPRITE_SUCCESS,
  GENERATOR_GENERATE_STYLE_SUCCESS,
  FETCHER_FETCH_IMAGE_ERROR,
  PARSER_FOUND_THEME,
} from '../constants';
import logger from '../logger';

/**
 * This module collect all data gathered by the fetcher and the parser
 * @param {object} config
 * @param {object} emitter
 * @return {{getEmojis: function(): {}, getThemes: function(): {}, getCategories: function(): {}, getData: function(): {}}}
 */
export default (config, emitter) => {
  let store = {
    emojisTotal: 0,
    emojisScrapped: 0,
    imagesTotal: 0,
    imagesComputed: 0,
    imagesFailedCount: 0,

    // it contains all emojis and their data
    emojis: {},

    // it contains all categories and their data
    categories: {},

    // it contains all the emojis for a specific theme
    emojisThemes: {},
  };

  const getStore = () => store;

  /**
   * @description event handler
   * it catches all themes receptions when we parse an emoji page
   * @param {object} emoji the emoji data
   * @param {string} themeName the theme name
   * @param {string} imageUrl image url
   */
  const onThemeFound = (emoji, themeName, imageUrl) => {
    store.imagesTotal += 1;
  };
  emitter.on(PARSER_FOUND_THEME, onThemeFound);

  emitter.on(PARSER_FOUND_MODIFIERS, (emojis) => {
    store.emojisTotal += size(emojis);
  });

  emitter.on(PARSER_PARSE_CATEGORY_SUCCESS, (emojis) => {
    store.emojisTotal += emojis.length;
  });

  /**
   * @description event handler
   * It catches the newly parsed emoji from an html page and store it
   * @param {object} parsedEmoji
   */
  const onEmojiParsed = (parsedEmoji) => {
    store.emojisScrapped += 1;
    store.emojis = {
      ...store.emojis,
      [parsedEmoji.name]: parsedEmoji,
    };
  };
  emitter.on(PARSER_PARSE_EMOJI_SUCCESS, onEmojiParsed);

  /**
   * @description event handler
   * It catches the newly parsed categories from the html page
   * @param {array<object>} categoriesFound
   */
  const onCategoriesParsed = (categoriesFound) => {
    store.categories = reduce(categoriesFound, (result, category) => {
      return {
        ...result,
        [category.name]: category,
      };
    }, {});
  };
  emitter.on(PARSER_PARSE_CATEGORIES_SUCCESS, onCategoriesParsed);

  const onImageParsed = (emoji, themeName, imagePath) => {
    store.imagesComputed += 1;

    store.emojisThemes = {
      ...store.emojisThemes,
      [themeName]: {
        ...store.emojisThemes[themeName] || {},
        [imagePath]: emoji.name,
      },
    };

    if (store.emojisTotal === store.emojisScrapped && store.imagesTotal === (store.imagesComputed - store.imagesFailedCount)) {
      logger.success('📡 Collecting data: ✅');
      logger.success('\n');
      emitter.emit(PARSER_PARSED_ALL_IMAGES);
    }
  };
  emitter.on(PARSER_PARSE_IMAGE_SUCCESS, onImageParsed);

  /**
   * if the image cannot be fetched so we remove the emoji from the theme
   * otherwise, the sprite generation will fail
   * @param error
   * @param emoji
   * @param themeName
   */
  // const onImageFail = (error, emoji, themeName) => {
  //   store.imagesFailedCount += 1;
  //   store.emojisThemes = {
  //     ...store.emojisThemes,
  //     [themeName]: reduce(store.emojisThemes[themeName], (result, emojiName, imagePath) => {
  //       if (emojiName === emoji.name) {
  //         return result;
  //       }
  //
  //       return {
  //         ...result,
  //         [imagePath]: emojiName,
  //       };
  //     }, {}),
  //   };
  // };
  // emitter.on(FETCHER_FETCH_IMAGE_ERROR, onImageFail);

  /**
   * HERE WE COLLECTED ALL DATA AND IMAGES WE NEED
   * we can clean the data and start building themes
   */
  const onParsedAllImages = () => {
    /*
    what we do here:
    we select only main emojis and remove modifiers from the emojis list, coz they are in the main emojis modifiers key
     */
    let themes = reduce(store.emojisThemes, (result, emojisTheme, themeName) => ({
      ...result,
      [themeName]: reduce(emojisTheme, (result, emojiName, imageUrl) => ({
        ...result,
        [emojiName]: imageUrl,
      }), {}),
    }), {});

    emitter.emit(COLLECTOR_COLLECT_DONE, themes);
  };
  emitter.on(PARSER_PARSED_ALL_IMAGES, onParsedAllImages);

  const generateJSONS = (theme) => {
    let dataClean = {};
    forEach(store.categories, (category) => {
      dataClean = {
        ...dataClean,
        [category.name]: omit(category, 'url'),
      };
    });

    store.emojis = reduce(store.emojis, (result, emoji) => ({
      ...result,
      [emoji.name]: {
        ...omit(emoji, 'themes'),
        modifiers: reduce(emoji.modifiers, (result, modifier) => ({
          ...emoji.modifiers,
          [modifier.name]: omit(modifier, 'themes'),
        }), {}),
      },
    }), {});

    forEach(store.emojis, (emoji) => {
      if (has(emoji, 'parent')) {
        store.emojis[emoji.parent]
          ['modifiers']
          [emoji.name] = emoji;

        dataClean
          [emoji.category]
          ['emojis']
          [emoji.parent]
          ['modifiers']
          [emoji.name] = omit(emoji, 'themes');
      } else {
        dataClean = {
          ...dataClean,
          [emoji.category]: {
            ...dataClean[emoji.category],
            emojis: {
              ...dataClean[emoji.category].emojis,
              [emoji.name]: omit(emoji, 'themes'),
            },
          },
        };
      }
    });

    fs.writeFileSync(`${config.destination}/emojis.json`, JSON.stringify(dataClean), 'utf8');
  };
  emitter.on(GENERATOR_GENERATE_THEMES_SUCCESS, generateJSONS);

  /**
   *
   * @param {string} themeName
   * @param {array<string>} emojisNames
   */
  const generateThemeJSON = (themeName, emojisNames) => {
    let themeData = {};

    emojisNames.map((emojiName) => {
      const emoji = omit(store.emojis[emojiName], 'url', 'themes', 'modifiers');

      if (!has(emoji, 'parent')) {
        themeData = {
          ...themeData,
          [emoji.category]: {
            ...themeData[emoji.category] || store.categories[emoji.category],
            emojis: [
              ...get(themeData, `[${emoji.category}].emojis`, []),
              emoji,
            ],
          },
        };
      } else {
        const parentIndex = findIndex(themeData[emoji.category].emojis, (e => e.name === emoji.parent));
        const parent = themeData[emoji.category].emojis[parentIndex];
        parent['modifiers'] = {
          ...parent['modifiers'] || {},
          [emoji.name]: emoji,
        };

        themeData = {
          ...themeData,
          [emoji.category]: {
            ...themeData[emoji.category] || store.categories[emoji.category],
            emojis: reduce(get(themeData, `[${emoji.category}].emojis`, []), (result, e) => {
              if (e.name === emoji.parent) {
                return [
                  ...result,
                  parent,
                ];
              } else {
                return [
                  ...result,
                  e,
                ];
              }
            }, []),
          },
        };
      }
    });

    fs.writeFileSync(`${config.destination}/${themeName}/${themeName}.json`, JSON.stringify(themeData), 'utf8');
  };
  emitter.on(GENERATOR_GENERATE_STYLE_SUCCESS, generateThemeJSON);

  return {
    getStore,
  };
};
