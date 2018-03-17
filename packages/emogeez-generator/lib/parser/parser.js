import {
  has,
  trim,
  omit,
  take,
} from 'lodash';
import logger from '../logger';
import {
  BASE_URL,

  FETCHER_FETCH_CATEGORIES_SUCCESS,
  FETCHER_FETCH_CATEGORY_SUCCESS,

  PARSER_PARSE_CATEGORIES_ERROR,
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_ERROR,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_ERROR,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_FOUND_THEME,

  HTML_CATEGORIES_SELECTOR,
  HTML_EMOJIS_SELECTOR,
  HTML_EMOJI_SHORTNAMES,
  HTML_EMOJI_MODIFIERS,
  HTML_EMOJI_THEMES,
  FETCHER_FETCH_EMOJI_SUCCESS,
  PARSER_FOUND_MODIFIERS,
} from '../constants';
import cheerio from 'cheerio';
import {
  getUnicode,
} from '../utils';

/**
 *
 * @param config
 * @param emitter
 * @return {{parseCategories: function(), parseCategory: function(*), parseEmoji: function(*), parseImage: function(*=)}}
 */
export default (config, emitter) => {

  /**
   * this method parse the index page of emojipedia
   * to get all categories and fetch it
   * @param {string} html
   */
  const parseCategories = (html) => {
    try {
      const $ = cheerio.load(html);
      const $categoriesContainer = $(HTML_CATEGORIES_SELECTOR);
      if ($categoriesContainer.find('h2').text() !== 'Categories') {
        throw new Error('[Scrapper] Canno\'t get categories list, Html structure has changed');
      }

      let categories = [];
      $categoriesContainer.find('a').each(function () {
        const $emojiNode = $(this).find('.emoji');
        const symbol = $emojiNode.text();

        $emojiNode.remove();
        const url = `${BASE_URL}${$(this).attr('href')}`;
        const fullName = trim($(this).text());
        const name = $(this).attr('href').replace(/\//g, '');
        const unicode = getUnicode(symbol);

        const category = {
          symbol,
          url,
          name,
          fullName,
          unicode,
        };

        categories.push(category);
      });
      emitter.emit(PARSER_PARSE_CATEGORIES_SUCCESS, categories);
    } catch (error) {
      logger.error(error.message);
      emitter.emit(PARSER_PARSE_CATEGORIES_ERROR, error);
    }
  };
  emitter.on(FETCHER_FETCH_CATEGORIES_SUCCESS, parseCategories);

  /**
   * parse a category html page from emojipedia and notify with the emojis list
   * @param {object} category
   * @param {string} html
   */
  const parseCategory = (category, html) => {
    try {
      const $ = cheerio.load(html);
      const $emojisList = $(HTML_EMOJIS_SELECTOR);
      if ($emojisList.length === 0) {
        throw new Error('[Scrapper] Cannot get emojis list, Html structure has changed');
      }

      let emojis = [];

      $emojisList.find('a').each(function () {
        const $emojiNode = $(this).find('.emoji');
        const symbol = $emojiNode.text();

        $emojiNode.remove();
        const url = `${BASE_URL}${$(this).attr('href')}`;
        const fullName = trim($(this).text());
        const name = $(this).attr('href').replace(/\//g, '');
        const emoji = {
          symbol,
          url,
          name,
          fullName,
          category: category.name,
        };

        emojis.push(emoji);
      });

      emitter.emit(PARSER_PARSE_CATEGORY_SUCCESS, emojis);
      //emitter.emit(PARSER_PARSE_CATEGORY_SUCCESS, take(emojis, 10));
    } catch (error) {
      logger.error(error);
      emitter.emit(PARSER_PARSE_CATEGORY_ERROR, error);
    }
  };
  emitter.on(FETCHER_FETCH_CATEGORY_SUCCESS, parseCategory);

  /**
   * parse an emoji page and gather more informations about the emojis:
   * - shortnames
   * - modifiers
   * - unicode
   * - themes
   * @param emojiBase
   * @param html
   */
  const parseEmoji = (emojiBase, html) => {
    try {
      let emojiFull = {
        ...emojiBase,
        unicode: getUnicode(emojiBase.symbol),
        shortnames: [],
        modifiers: {},
        themes: {},
      };
      const $ = cheerio.load(html);
      const $shortNames = $(HTML_EMOJI_SHORTNAMES);
      const $themes = $(HTML_EMOJI_THEMES);
      const $modifiers = $(HTML_EMOJI_MODIFIERS);

      $themes.each(function () {
        const themeName = $(this)
          .find('.vendor-info')
          .find('a').attr('href').replace(/\//g, '');
        const imagePath = $(this)
          .find('.vendor-image')
          .find('img').attr('src');

        emojiFull.themes[themeName] = imagePath;
        emitter.emit(PARSER_FOUND_THEME, emojiFull, themeName, imagePath);
      });

      $shortNames.each(function () {
        const textContent = $(this).text();
        emojiFull.shortnames.push(
          textContent
            .replace(/:/gi, '')
            .replace(/_/gi, '-'),
        );
      });

      if (!emojiFull.shortnames.length) {
        emojiFull.shortnames.push(emojiFull.name);
        emojiFull.shortname = emojiFull.name;
      } else {
        emojiFull.shortname = emojiFull.shortnames[0];
      }

      // if this emoji is not a modifier
      if (!has(emojiBase, 'parent')) {
        if ($modifiers.length) {
          $modifiers.each(function () {
            const $modifierLink = $(this).find('a');
            const modifierSymbol = $modifierLink.find('.emoji').text();
            const url = $modifierLink.attr('href');
            $modifierLink.find('.emoji').remove();
            const modifierFullName = trim($modifierLink.text());
            const modifierName = url.replace(/\//g, '');

            emojiFull.modifiers[modifierName] = {
              parent: emojiFull.name,
              fullName: modifierFullName,
              name: modifierName,
              symbol: modifierSymbol,
              category: emojiFull.category,
              url: `${BASE_URL}${url}`,
            };
          });
          emitter.emit(PARSER_FOUND_MODIFIERS, emojiFull.modifiers);
        }
      }

      emitter.emit(PARSER_PARSE_EMOJI_SUCCESS, emojiFull);
    } catch (error) {
      logger.error(error.message);
      emitter.emit(PARSER_PARSE_EMOJI_ERROR, error);
    }
  };
  emitter.on(FETCHER_FETCH_EMOJI_SUCCESS, parseEmoji);

  return {
    parseCategories,
    parseCategory,
    parseEmoji,
  };
}
