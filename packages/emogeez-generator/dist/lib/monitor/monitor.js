'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _constants = require('../constants');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config, emitter) {
  var emojisTotal = 0;
  var emojisScrapped = 0;
  var imagesTotal = 0;
  var imagesComputed = 0;
  var categoriesTotal = 0;
  var categoriesScrapped = 0;

  var printProgress = function printProgress() {
    var catPercentage = Math.floor(categoriesScrapped / categoriesTotal * 100);
    var emoPercentage = Math.floor(emojisScrapped / emojisTotal * 100);
    var imaPercentage = Math.floor(imagesComputed / imagesTotal * 100);
    var total = (catPercentage + emoPercentage + imaPercentage) / 3;
    var toLog = '\uD83D\uDCE1 Collecting data: \u267B\uFE0F ';
    toLog += ' = [C ' + categoriesScrapped + '/' + categoriesTotal + ' - ' + catPercentage + '%]';
    toLog += ' = [E ' + emojisScrapped + '/' + emojisTotal + ' - ' + emoPercentage + '%]';
    toLog += ' = [I ' + imagesComputed + '/' + imagesTotal + ' - ' + imaPercentage + '%]';
    toLog += ' = [TOTAL ' + Math.floor(total) + '%]';

    _logger2.default.sameLine(toLog);
  };
  var logProgress = (0, _lodash.throttle)(printProgress, 200);

  emitter.on(_constants.PARSER_PARSE_CATEGORIES_SUCCESS, function (categories) {
    categoriesTotal += categories.length;
    logProgress();
  });
  emitter.on(_constants.PARSER_FOUND_MODIFIERS, function (emojis) {
    emojisTotal += (0, _lodash.size)(emojis);
    logProgress();
  });

  emitter.on(_constants.PARSER_PARSE_CATEGORY_SUCCESS, function (emojis) {
    emojisTotal += emojis.length;
    categoriesScrapped += 1;
  });

  emitter.on(_constants.PARSER_PARSE_EMOJI_SUCCESS, function () {
    emojisScrapped += 1;
  });

  emitter.on(_constants.PARSER_FOUND_THEME, function () {
    imagesTotal += 1;
    logProgress();
  });

  emitter.on(_constants.PARSER_PARSE_IMAGE_SUCCESS, function () {
    imagesComputed += 1;
    logProgress();
  });

  var printError = function printError(error) {
    _logger2.default.error(error.message);
    _logger2.default.error(error.stack);
  };

  emitter.on(_constants.FETCHER_FETCH_CATEGORIES_ERROR, printError);
  emitter.on(_constants.FETCHER_FETCH_CATEGORY_ERROR, printError);
  emitter.on(_constants.FETCHER_FETCH_EMOJI_ERROR, printError);
  emitter.on(_constants.FETCHER_FETCH_IMAGE_ERROR, printError);
  emitter.on(_constants.PARSER_PARSE_CATEGORIES_ERROR, printError);
  emitter.on(_constants.PARSER_PARSE_CATEGORY_ERROR, printError);
  emitter.on(_constants.PARSER_PARSE_EMOJI_ERROR, printError);
  emitter.on(_constants.PARSER_PARSE_IMAGE_ERROR, printError);
  emitter.on(_constants.GENERATOR_SPRITE_ERROR, printError);

  emitter.on(_constants.ERROR, printError);
};