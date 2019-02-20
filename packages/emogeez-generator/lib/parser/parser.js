import {
  has,
  trim,
} from 'lodash';
import cheerio from 'cheerio';
import logger from '../logger';
import {
  BASE_URL,
  HTML_CATEGORIES_SELECTOR,
  HTML_EMOJIS_SELECTOR,
  HTML_EMOJI_SHORTNAMES,
  HTML_EMOJI_THEMES,
  HTML_EMOJI_MODIFIERS_LIST,
} from '../constants';
import {
  getUnicode,
} from '../utils';

/**
 * this method parse the index page of emojipedia
 * to get all categories and fetch it
 * @param {string} html
 */
export const parseCategories = (html) => {
  try {
    const $ = cheerio.load(html);
    const $categoriesContainer = $(HTML_CATEGORIES_SELECTOR);
    if ($categoriesContainer.find('h2')
      .text() !== 'Categories') {
      throw new Error('[Scrapper] Canno\'t get categories list, Html structure has changed');
    }

    const categories = [];
    $categoriesContainer.find('a')
      .each(function () {
        const $emojiNode = $(this)
          .find('.emoji');
        const symbol = $emojiNode.text();

        $emojiNode.remove();
        const url = `${BASE_URL}${$(this)
          .attr('href')}`;
        const fullName = trim($(this)
          .text());
        const name = $(this)
          .attr('href')
          .replace(/\//g, '');
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

    return categories;
  } catch (error) {
    logger.error(error.message);
    return [];
  }
};

/**
 * parse a category html page from emojipedia and notify with the emojis list
 * @param {object} category
 * @param {string} html
 */
export const parseCategory = (category, html) => {
  try {
    const $ = cheerio.load(html);
    const $emojisList = $(HTML_EMOJIS_SELECTOR);
    if ($emojisList.length === 0) {
      throw new Error('[Scrapper] Cannot get emojis list, Html structure has changed');
    }

    const emojis = [];

    $emojisList.find('a')
      .each(function () {
        const $emojiNode = $(this)
          .find('.emoji');
        const symbol = $emojiNode.text();

        $emojiNode.remove();
        const url = `${BASE_URL}${$(this)
          .attr('href')}`;
        const fullName = trim($(this)
          .text());
        const name = $(this)
          .attr('href')
          .replace(/\//g, '');
        const emoji = {
          symbol,
          url,
          name,
          fullName,
          category: category.name,
        };

        emojis.push(emoji);
      });

    return emojis;
  } catch (error) {
    logger.error(error);
    return [];
  }
};

/**
 * parse an emoji page and gather more informations about the emojis:
 * - shortnames
 * - modifiers
 * - unicode
 * - themes
 * @param emojiBase
 * @param html
 */
export const parseEmoji = (emojiBase, html) => {
  try {
    const emojiFull = {
      ...emojiBase,
      unicode: getUnicode(emojiBase.symbol),
      shortnames: [],
      modifiers: {},
      themes: {},
    };
    const $ = cheerio.load(html);

    // collecting themes
    const $themes = $(HTML_EMOJI_THEMES);
    $themes.each(function () {
      const themeName = $(this)
        .find('.vendor-info')
        .find('a')
        .attr('href')
        .replace(/\//g, '');
      const imagePath = $(this)
        .find('.vendor-image')
        .find('img')
        .attr('src');

      emojiFull.themes[themeName] = imagePath;
    });

    // collecting shortnames
    const $shortNames = $(HTML_EMOJI_SHORTNAMES);
    $shortNames.each(function () {
      const textContent = $(this)
        .text();
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
      emojiFull.shortname = emojiFull.shortnames[0]; // eslint-disable-line prefer-destructuring
    }

    // collecting modifiers
    // if this emoji is not a modifier
    const $emojisList = $(HTML_EMOJI_MODIFIERS_LIST);
    const $emojisListTitles = $emojisList.prev();
    const $firstTitle = $($emojisListTitles.get(0));
    if (/Related/.test($firstTitle.text())) {
      if (!has(emojiBase, 'parent')) {
        const $modifiers = $($emojisList.get(0))
          .find('li')
          .filter((match, container) => {
            const $container = $(container);
            const text = $container.text();
            const url = $container.find('a')
              .attr('href');
            const nameRegexp = new RegExp(emojiFull.fullName);
            const typedRegexp = new RegExp('type-');
            return nameRegexp.test(text) && typedRegexp.test(url);
          });
        if ($modifiers.length) {
          $modifiers.each(function () {
            const $modifierLink = $(this)
              .find('a');
            const modifierSymbol = $modifierLink.find('.emoji')
              .text();
            const url = $modifierLink.attr('href');
            $modifierLink.find('.emoji')
              .remove();
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
        }
      }
    }

    return emojiFull;
  } catch (error) {
    logger.error(error.message);
    return null;
  }
};
