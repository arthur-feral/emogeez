'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _lodash = require('lodash');

var _constants = require('../constants');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * This module collect all data gathered by the fetcher and the parser
 * @param {object} config
 * @param {object} emitter
 * @return {{getEmojis: function(): {}, getThemes: function(): {}, getCategories: function(): {}, getData: function(): {}}}
 */
exports.default = function (config, emitter) {
  var emojisTotal = 0;
  var emojisScrapped = 0;
  var imagesTotal = 0;
  var imagesComputed = 0;
  var imagesFailedCount = 0;

  var data = {};

  // it contains all emojis and their data
  var emojis = {};

  // it contains all categories and their data
  var categories = {};

  // it contains all the emojis for a specific theme
  var emojisThemes = {};

  var getEmojis = function getEmojis() {
    return emojis;
  };
  var getCategories = function getCategories() {
    return categories;
  };
  var getData = function getData() {
    return data;
  };

  /**
   * @description event handler
   * it catches all themes receptions when we parse an emoji page
   * @param {object} emoji the emoji data
   * @param {string} themeName the theme name
   * @param {string} imageUrl image url
   */
  var onThemeFound = function onThemeFound(emoji, themeName, imageUrl) {
    imagesTotal += 1;
  };

  /**
   * @description event handler
   * It catches the newly parsed emoji from an html page and store it
   * @param {object} parsedEmoji
   */
  var onEmojiParsed = function onEmojiParsed(parsedEmoji) {
    emojisScrapped += 1;
    emojis = _extends({}, emojis, _defineProperty({}, parsedEmoji.name, parsedEmoji));
  };

  /**
   * @description event handler
   * It catches the newly parsed categories from the html page
   * @param {array<object>} categoriesFound
   */
  var onCategoriesParsed = function onCategoriesParsed(categoriesFound) {
    categories = (0, _lodash.reduce)(categoriesFound, function (result, category) {
      return _extends({}, result, _defineProperty({}, category.name, category));
    }, {});
  };

  var onImageParsed = function onImageParsed(emoji, themeName, imagePath) {
    imagesComputed += 1;

    emojisThemes = _extends({}, emojisThemes, _defineProperty({}, themeName, _extends({}, emojisThemes[themeName] || {}, _defineProperty({}, imagePath, emoji.name))));

    if (emojisTotal === emojisScrapped && imagesTotal === imagesComputed - imagesFailedCount) {
      _logger2.default.success('📡 Collecting data: ✅');
      emitter.emit(_constants.PARSER_PARSED_ALL_IMAGES);
    }
  };

  /**
   * if the image cannot be fetched so we remove the emoji from the theme
   * otherwise, the sprite generation will fail
   * @param error
   * @param emoji
   * @param themeName
   */
  var onImageFail = function onImageFail(error, emoji, themeName) {
    imagesFailedCount += 1;
    emojisThemes = _extends({}, emojisThemes, _defineProperty({}, themeName, emojisThemes[themeName].filter(function (emojiName) {
      return emojiName !== emoji.name;
    })));

    emojisThemes = _extends({}, emojisThemes, _defineProperty({}, themeName, _extends({}, (0, _lodash.omit)(emojisThemes[themeName] || {}, imagePath))));
  };

  /**
   * HERE WE COLLECTED ALL DATA AND IMAGES WE NEED
   * we can clean the data and start building themes
   */
  var onParsedAllImages = function onParsedAllImages() {
    /*
    what we do here:
    we select only main emojis and remove modifiers from the emojis list, coz they are in the main emojis modifiers key
     */
    var themes = (0, _lodash.reduce)(emojisThemes, function (result, emojisTheme, themeName) {
      return _extends({}, result, _defineProperty({}, themeName, (0, _lodash.reduce)(emojisTheme, function (result, emojiName, imageUrl) {
        return _extends({}, result, _defineProperty({}, emojiName, imageUrl));
      }, {})));
    }, {});

    emitter.emit(_constants.COLLECTOR_COLLECT_DONE, themes);
  };

  var generateJSONS = function generateJSONS(theme) {
    var dataClean = {};
    (0, _lodash.forEach)(categories, function (category) {
      dataClean = _extends({}, dataClean, _defineProperty({}, category.name, (0, _lodash.omit)(category, 'url')));
    });

    emojis = (0, _lodash.reduce)(emojis, function (result, emoji) {
      return _extends({}, result, _defineProperty({}, emoji.name, _extends({}, (0, _lodash.omit)(emoji, 'themes'), {
        modifiers: (0, _lodash.reduce)(emoji.modifiers, function (result, modifier) {
          return _extends({}, emoji.modifiers, _defineProperty({}, modifier.name, (0, _lodash.omit)(modifier, 'themes')));
        }, {})
      })));
    }, {});

    (0, _lodash.forEach)(emojis, function (emoji) {
      if ((0, _lodash.has)(emoji, 'parent')) {
        emojis[emoji.parent]['modifiers'][emoji.name] = emoji;

        dataClean[emoji.category]['emojis'][emoji.parent]['modifiers'][emoji.name] = (0, _lodash.omit)(emoji, 'themes');
      } else {
        dataClean = _extends({}, dataClean, _defineProperty({}, emoji.category, _extends({}, dataClean[emoji.category], {
          emojis: _extends({}, dataClean[emoji.category].emojis, _defineProperty({}, emoji.name, (0, _lodash.omit)(emoji, 'themes')))
        })));
      }
    });

    _fsExtra2.default.writeFileSync(config.destination + '/emojis.json', JSON.stringify(dataClean), 'utf8');
  };

  /**
   *
   * @param {string} themeName
   * @param {array<string>} emojisNames
   */
  var generateThemeJSON = function generateThemeJSON(themeName, emojisNames) {
    var themeData = {};

    emojisNames.map(function (emojiName) {
      var emoji = (0, _lodash.omit)(emojis[emojiName], 'url', 'themes', 'modifiers');

      if (!(0, _lodash.has)(emoji, 'parent')) {
        themeData = _extends({}, themeData, _defineProperty({}, emoji.category, _extends({}, themeData[emoji.category] || categories[emoji.category], {
          emojis: [].concat(_toConsumableArray((0, _lodash.get)(themeData, '[' + emoji.category + '].emojis', [])), [emoji])
        })));
      } else {
        var parentIndex = (0, _lodash.findIndex)(themeData[emoji.category].emojis, function (e) {
          return e.name === emoji.parent;
        });
        var parent = themeData[emoji.category].emojis[parentIndex];
        parent['modifiers'] = _extends({}, parent['modifiers'] || {}, _defineProperty({}, emoji.name, emoji));

        themeData = _extends({}, themeData, _defineProperty({}, emoji.category, _extends({}, themeData[emoji.category] || categories[emoji.category], {
          emojis: (0, _lodash.reduce)((0, _lodash.get)(themeData, '[' + emoji.category + '].emojis', []), function (result, e) {
            if (e.name === emoji.parent) {
              return [].concat(_toConsumableArray(result), [parent]);
            } else {
              return [].concat(_toConsumableArray(result), [e]);
            }
          }, [])
        })));
      }
    });

    _fsExtra2.default.writeFileSync(config.destination + '/' + themeName + '/' + themeName + '.json', JSON.stringify(themeData), 'utf8');
  };

  emitter.on(_constants.GENERATOR_GENERATE_STYLE_SUCCESS, generateThemeJSON);
  emitter.on(_constants.GENERATOR_GENERATE_THEMES_SUCCESS, generateJSONS);
  emitter.on(_constants.PARSER_FOUND_THEME, onThemeFound);
  emitter.on(_constants.PARSER_PARSE_EMOJI_SUCCESS, onEmojiParsed);
  emitter.on(_constants.PARSER_PARSE_CATEGORIES_SUCCESS, onCategoriesParsed);
  emitter.on(_constants.PARSER_PARSE_IMAGE_SUCCESS, onImageParsed);
  emitter.on(_constants.PARSER_PARSED_ALL_IMAGES, onParsedAllImages);
  emitter.on(_constants.FETCHER_FETCH_IMAGE_ERROR, onImageFail);

  emitter.on(_constants.PARSER_FOUND_MODIFIERS, function (emojis) {
    emojisTotal += (0, _lodash.size)(emojis);
  });

  emitter.on(_constants.PARSER_PARSE_CATEGORY_SUCCESS, function (emojis) {
    emojisTotal += emojis.length;
  });

  return {
    getEmojis: getEmojis,
    getCategories: getCategories,
    getData: getData
  };
};