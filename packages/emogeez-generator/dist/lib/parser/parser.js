'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _constants = require('../constants');

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param config
 * @param emitter
 * @return {{parseCategories: function(), parseCategory: function(*), parseEmoji: function(*), parseImage: function(*=)}}
 */
exports.default = function (config, emitter) {

  /**
   * this method parse the index page of emojipedia
   * to get all categories and fetch it
   * @param {string} html
   */
  var parseCategories = function parseCategories(html) {
    try {
      var $ = _cheerio2.default.load(html);
      var $categoriesContainer = $(_constants.HTML_CATEGORIES_SELECTOR);
      if ($categoriesContainer.find('h2').text() !== 'Categories') {
        throw new Error('[Scrapper] Canno\'t get categories list, Html structure has changed');
      }

      var categories = [];
      $categoriesContainer.find('a').each(function () {
        var $emojiNode = $(this).find('.emoji');
        var symbol = $emojiNode.text();

        $emojiNode.remove();
        var url = '' + _constants.BASE_URL + $(this).attr('href');
        var fullName = (0, _lodash.trim)($(this).text());
        var name = $(this).attr('href').replace(/\//g, '');
        var unicode = (0, _utils.getUnicode)(symbol);

        var category = {
          symbol: symbol,
          url: url,
          name: name,
          fullName: fullName,
          unicode: unicode
        };

        categories.push(category);
      });
      emitter.emit(_constants.PARSER_PARSE_CATEGORIES_SUCCESS, categories);
    } catch (error) {
      _logger2.default.error(error.message);
      emitter.emit(_constants.PARSER_PARSE_CATEGORIES_ERROR, error);
    }
  };
  emitter.on(_constants.FETCHER_FETCH_CATEGORIES_SUCCESS, parseCategories);

  /**
   * parse a category html page from emojipedia and notify with the emojis list
   * @param {object} category
   * @param {string} html
   */
  var parseCategory = function parseCategory(category, html) {
    try {
      var $ = _cheerio2.default.load(html);
      var $emojisList = $(_constants.HTML_EMOJIS_SELECTOR);
      if ($emojisList.length === 0) {
        throw new Error('[Scrapper] Cannot get emojis list, Html structure has changed');
      }

      var emojis = [];

      $emojisList.find('a').each(function () {
        var $emojiNode = $(this).find('.emoji');
        var symbol = $emojiNode.text();

        $emojiNode.remove();
        var url = '' + _constants.BASE_URL + $(this).attr('href');
        var fullName = (0, _lodash.trim)($(this).text());
        var name = $(this).attr('href').replace(/\//g, '');
        var emoji = {
          symbol: symbol,
          url: url,
          name: name,
          fullName: fullName,
          category: category.name
        };

        emojis.push(emoji);
      });

      emitter.emit(_constants.PARSER_PARSE_CATEGORY_SUCCESS, emojis);
      //emitter.emit(PARSER_PARSE_CATEGORY_SUCCESS, take(emojis, 10));
    } catch (error) {
      _logger2.default.error(error);
      emitter.emit(_constants.PARSER_PARSE_CATEGORY_ERROR, error);
    }
  };
  emitter.on(_constants.FETCHER_FETCH_CATEGORY_SUCCESS, parseCategory);

  /**
   * parse an emoji page and gather more informations about the emojis:
   * - shortnames
   * - modifiers
   * - unicode
   * - themes
   * @param emojiBase
   * @param html
   */
  var parseEmoji = function parseEmoji(emojiBase, html) {
    try {
      var emojiFull = _extends({}, emojiBase, {
        unicode: (0, _utils.getUnicode)(emojiBase.symbol),
        shortnames: [],
        modifiers: {},
        themes: {}
      });
      var $ = _cheerio2.default.load(html);
      var $shortNames = $(_constants.HTML_EMOJI_SHORTNAMES);
      var $themes = $(_constants.HTML_EMOJI_THEMES);
      var $modifiers = $(_constants.HTML_EMOJI_MODIFIERS);

      $themes.each(function () {
        var themeName = $(this).find('.vendor-info').find('a').attr('href').replace(/\//g, '');
        var imagePath = $(this).find('.vendor-image').find('img').attr('src');

        emojiFull.themes[themeName] = imagePath;
        emitter.emit(_constants.PARSER_FOUND_THEME, emojiFull, themeName, imagePath);
      });

      $shortNames.each(function () {
        var textContent = $(this).text();
        emojiFull.shortnames.push(textContent.replace(/:/gi, '').replace(/_/gi, '-'));
      });

      if (!emojiFull.shortnames.length) {
        emojiFull.shortnames.push(emojiFull.name);
        emojiFull.shortname = emojiFull.name;
      } else {
        emojiFull.shortname = emojiFull.shortnames[0];
      }

      // if this emoji is not a modifier
      if (!(0, _lodash.has)(emojiBase, 'parent')) {
        if ($modifiers.length) {
          $modifiers.each(function () {
            var $modifierLink = $(this).find('a');
            var modifierSymbol = $modifierLink.find('.emoji').text();
            var url = $modifierLink.attr('href');
            $modifierLink.find('.emoji').remove();
            var modifierFullName = (0, _lodash.trim)($modifierLink.text());
            var modifierName = url.replace(/\//g, '');

            emojiFull.modifiers[modifierName] = {
              parent: emojiFull.name,
              fullName: modifierFullName,
              name: modifierName,
              symbol: modifierSymbol,
              category: emojiFull.category,
              url: '' + _constants.BASE_URL + url
            };
          });
          emitter.emit(_constants.PARSER_FOUND_MODIFIERS, emojiFull.modifiers);
        }
      }

      emitter.emit(_constants.PARSER_PARSE_EMOJI_SUCCESS, emojiFull);
    } catch (error) {
      _logger2.default.error(error.message);
      emitter.emit(_constants.PARSER_PARSE_EMOJI_ERROR, error);
    }
  };
  emitter.on(_constants.FETCHER_FETCH_EMOJI_SUCCESS, parseEmoji);

  return {
    parseCategories: parseCategories,
    parseCategory: parseCategory,
    parseEmoji: parseEmoji
  };
};