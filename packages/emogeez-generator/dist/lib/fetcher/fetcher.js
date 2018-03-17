'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _superagentThrottle = require('superagent-throttle');

var _superagentThrottle2 = _interopRequireDefault(_superagentThrottle);

var _lodash = require('lodash');

var _utils = require('../utils');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tempPath = process.env.TEMP_FILES_PATH;
var imagesPath = tempPath + '/images';
var htmlPath = tempPath + '/html';

var throttle = new _superagentThrottle2.default({
  active: true, // set false to pause queue
  rate: 200, // how many requests can be sent every `ratePer`
  ratePer: 1000, // number of ms in which `rate` requests may be sent
  concurrent: 100 // how many requests can be sent concurrently
});

/**
 *
 * @param superagent
 * @param config
 * @param emitter
 * @return {{fetchCategories: function()}}
 */

exports.default = function (superagent, config, emitter) {
  /**
   * once the app is initialized with the files space ready
   * we start fetching the data from EMOJIPEDIA
   * @return {Promise}
   */
  var fetchCategories = function fetchCategories() {
    var cacheFilePath = htmlPath + '/index.html';
    if (config.cache && _fsExtra2.default.existsSync(cacheFilePath)) {
      var fileContent = _fsExtra2.default.readFileSync(cacheFilePath, 'utf8');

      return Promise.resolve(fileContent).then(function () {
        emitter.emit(_constants.FETCHER_FETCH_CATEGORIES_SUCCESS, fileContent);
      });
    }

    return new Promise(function (resolve, reject) {
      superagent.get(_constants.BASE_URL).end(function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.text);
        }
      });
    }).then(function (content) {
      (0, _utils.saveFile)(content, htmlPath, 'index.html');
      emitter.emit(_constants.FETCHER_FETCH_CATEGORIES_SUCCESS, content);
    }).catch(function (error) {
      emitter.emit(_constants.FETCHER_FETCH_CATEGORIES_ERROR, error);
    });
  };

  /**
   * Once we parsed the index file containing all categories
   * we know the url of each category
   * so for each we fetch the html page
   * @param {object} category object containing raw infos about the category
   * and category url
   * @return {Promise<any>}
   */
  var fetchCategory = function fetchCategory(category) {
    var cacheFilePath = htmlPath + '/' + category.name + '.html';

    if (config.cache && _fsExtra2.default.existsSync(cacheFilePath)) {
      var fileContent = _fsExtra2.default.readFileSync(cacheFilePath, 'utf8');

      return Promise.resolve(fileContent).then(function () {
        emitter.emit(_constants.FETCHER_FETCH_CATEGORY_SUCCESS, category, fileContent);
      });
    }

    return new Promise(function (resolve, reject) {
      superagent.get(category.url).end(function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.text);
        }
      });
    }).then(function (content) {
      (0, _utils.saveFile)(content, htmlPath, category.name + '.html');
      emitter.emit(_constants.FETCHER_FETCH_CATEGORY_SUCCESS, category, content);
    }).catch(function (error) {
      emitter.emit(_constants.FETCHER_FETCH_CATEGORY_ERROR, error);
    });
  };

  /**
   * once we have fetched the category page and listed all emojis on it
   * for each emoji, we fetch the html page
   * @param {object} emoji an object containing basic infos about the emoji
   * and the emoji url
   * @return {Promise<any>}
   */
  var fetchEmoji = function fetchEmoji(emoji) {
    var cacheFilePath = htmlPath + '/' + emoji.category + '/' + emoji.name + '.html';

    if (config.cache && _fsExtra2.default.existsSync(cacheFilePath)) {
      var fileContent = _fsExtra2.default.readFileSync(cacheFilePath, 'utf8');

      return Promise.resolve(fileContent).then(function () {
        emitter.emit(_constants.FETCHER_FETCH_EMOJI_SUCCESS, emoji, fileContent);
      });
    }
    return new Promise(function (resolve, reject) {
      superagent.get(emoji.url).use(throttle.plugin()).end(function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.text);
        }
      });
    }).then(function (content) {
      (0, _utils.saveFile)(content, htmlPath + '/' + emoji.category, emoji.name + '.html');
      emitter.emit(_constants.FETCHER_FETCH_EMOJI_SUCCESS, emoji, content);
    }).catch(function (error) {
      console.log(error);
      emitter.emit(_constants.FETCHER_FETCH_EMOJI_ERROR, error);
    });
  };

  /**
   * fetch the image for a theme for an emoji
   * @param {object} emoji
   * @param {string} themeName
   * @param {string} url
   * @return {Promise<any>}
   */
  var fetchImage = function fetchImage(emoji, themeName, url) {
    var cacheFilePath = imagesPath + '/' + themeName + '/' + emoji.category + '/' + emoji.name + '_raw.png';
    if (config.cache && _fsExtra2.default.existsSync(cacheFilePath)) {
      var fileContent = _fsExtra2.default.readFileSync(cacheFilePath);

      return Promise.resolve(fileContent).then(function () {
        emitter.emit(_constants.FETCHER_FETCH_IMAGE_SUCCESS, emoji, themeName, fileContent);
      });
    }

    return new Promise(function (resolve, reject) {
      superagent.get(url).use(throttle.plugin()).end(function (error, result) {
        if (error || !result.body) {
          reject(error);
        } else {
          (0, _utils.saveFile)(result.body, imagesPath + '/' + themeName + '/' + emoji.category, emoji.name + '_raw.png');
          resolve(result.body);
        }
      });
    }).then(function (content) {
      emitter.emit(_constants.FETCHER_FETCH_IMAGE_SUCCESS, emoji, themeName, content);
    }).catch(function (error) {
      emitter.emit(_constants.FETCHER_FETCH_IMAGE_ERROR, error, emoji, themeName);
    });
  };

  emitter.on(_constants.APP_FILES_SPACE_READY, fetchCategories);
  emitter.on(_constants.PARSER_PARSE_CATEGORIES_SUCCESS, function (categories) {
    categories.map(function (category) {
      return fetchCategory(category);
    });
  });

  emitter.on(_constants.PARSER_PARSE_CATEGORY_SUCCESS, function (emojis) {
    emojis.map(function (emoji) {
      return fetchEmoji(emoji);
    });
  });

  emitter.on(_constants.PARSER_FOUND_MODIFIERS, function (emojis) {
    (0, _lodash.map)(emojis, function (emoji) {
      return fetchEmoji(emoji);
    });
  });

  emitter.on(_constants.PARSER_FOUND_THEME, function (emoji, themeName, imageUrl) {
    fetchImage(emoji, themeName, imageUrl);
  });
};