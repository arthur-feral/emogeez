import fs from 'fs-extra';
import Throttle from 'superagent-throttle';
import {
  forEach,
  map,
} from 'lodash';
import {
  saveFile,
} from '../utils';
import logger from '../logger';
import {
  BASE_URL,
  APP_READY,

  FETCHER_FETCH_CATEGORIES_ERROR,
  FETCHER_FETCH_CATEGORIES_SUCCESS,
  FETCHER_FETCH_CATEGORY_ERROR,
  FETCHER_FETCH_CATEGORY_SUCCESS,
  FETCHER_FETCH_EMOJI_ERROR,
  FETCHER_FETCH_EMOJI_SUCCESS,
  FETCHER_FETCH_IMAGE_ERROR,
  FETCHER_FETCH_IMAGE_SUCCESS,

  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_FOUND_MODIFIERS,
  PARSER_FOUND_THEME,
} from '../constants';

const RETRY_COUNT = 5;
const tempPath = process.env.TEMP_FILES_PATH;
const imagesPath = `${tempPath}/images`;
const htmlPath = `${tempPath}/html`;

const throttle = new Throttle({
  active: true,     // set false to pause queue
  rate: 150,          // how many requests can be sent every `ratePer`
  ratePer: 1000,   // number of ms in which `rate` requests may be sent
  concurrent: 50     // how many requests can be sent concurrently
});

/**
 *
 * @param superagent
 * @param config
 * @param emitter
 * @return {{fetchCategories: function()}}
 */
export default (superagent, config, emitter) => {
  /**
   * once the app is initialized with the files space ready
   * we start fetching the data from EMOJIPEDIA
   * @return {Promise}
   */
  const fetchCategories = () => {
    const cacheFilePath = `${htmlPath}/index.html`;
    if (config.cache && fs.existsSync(cacheFilePath)) {
      const fileContent = fs.readFileSync(cacheFilePath, 'utf8');

      return Promise
        .resolve(fileContent)
        .then(() => {
          emitter.emit(FETCHER_FETCH_CATEGORIES_SUCCESS, fileContent);
        });
    }

    return new Promise((resolve, reject) => {
      superagent.get(BASE_URL)
        .end((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.text);
          }
        });
    }).then((content) => {
      saveFile(content, htmlPath, 'index.html');
      emitter.emit(FETCHER_FETCH_CATEGORIES_SUCCESS, content);
    }).catch((error) => {
      emitter.emit(FETCHER_FETCH_CATEGORIES_ERROR, error);
    });
  };
  emitter.on(APP_READY, fetchCategories);

  /**
   * Once we parsed the index file containing all categories
   * we know the url of each category
   * so for each we fetch the html page
   * @param {object} category object containing raw infos about the category
   * and category url
   * @return {Promise<any>}
   */
  const fetchCategory = (category) => {
    const cacheFilePath = `${htmlPath}/${category.name}.html`;

    if (config.cache && fs.existsSync(cacheFilePath)) {
      const fileContent = fs.readFileSync(cacheFilePath, 'utf8');

      return Promise
        .resolve(fileContent)
        .then(() => {
          emitter.emit(FETCHER_FETCH_CATEGORY_SUCCESS, category, fileContent);
        });
    }

    return new Promise((resolve, reject) => {
      superagent.get(category.url)
        .end((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.text);
          }
        });
    }).then((content) => {
      saveFile(content, htmlPath, `${category.name}.html`);
      emitter.emit(FETCHER_FETCH_CATEGORY_SUCCESS, category, content);
    }).catch((error) => {
      emitter.emit(FETCHER_FETCH_CATEGORY_ERROR, error);
    });
  };
  emitter.on(PARSER_PARSE_CATEGORIES_SUCCESS, (categories) => {
    categories.map(category => fetchCategory(category));
  });

  /**
   * once we have fetched the category page and listed all emojis on it
   * for each emoji, we fetch the html page
   * @param {object} emoji an object containing basic infos about the emoji
   * and the emoji url
   * @return {Promise<any>}
   */
  const fetchEmoji = (emoji) => {
    const cacheFilePath = `${htmlPath}/${emoji.category}/${emoji.name}.html`;

    if (config.cache && fs.existsSync(cacheFilePath)) {
      const fileContent = fs.readFileSync(cacheFilePath, 'utf8');

      return Promise
        .resolve(fileContent)
        .then(() => {
          emitter.emit(FETCHER_FETCH_EMOJI_SUCCESS, emoji, fileContent);
        });
    }
    return new Promise((resolve, reject) => {
      superagent.get(emoji.url)
        .use(throttle.plugin())
        .retry(RETRY_COUNT)
        .end((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.text);
          }
        });
    }).then((content) => {
      saveFile(content, `${htmlPath}/${emoji.category}`, `${emoji.name}.html`);
      emitter.emit(FETCHER_FETCH_EMOJI_SUCCESS, emoji, content);
    }).catch((error) => {
      emitter.emit(FETCHER_FETCH_EMOJI_ERROR, error);
    });
  };
  emitter.on(PARSER_PARSE_CATEGORY_SUCCESS, (emojis) => {
    emojis.map(emoji => fetchEmoji(emoji));
  });
  emitter.on(PARSER_FOUND_MODIFIERS, (emojis) => {
    map(emojis, emoji => fetchEmoji(emoji));
  });

  /**
   * fetch the image for a theme for an emoji
   * @param {object} emoji
   * @param {string} themeName
   * @param {string} url
   * @return {Promise<any>}
   */
  const fetchImage = (emoji, themeName, url) => {
    const cacheFilePath = `${imagesPath}/${themeName}/${emoji.category}/${emoji.name}_raw.png`;
    if (config.cache && fs.existsSync(cacheFilePath)) {
      const fileContent = fs.readFileSync(cacheFilePath);

      return Promise
        .resolve(fileContent)
        .then(() => {
          emitter.emit(FETCHER_FETCH_IMAGE_SUCCESS, emoji, themeName, fileContent);
        });
    }

    return new Promise((resolve, reject) => {
      superagent.get(url)
        .use(throttle.plugin())
        .retry(RETRY_COUNT)
        .end((error, result) => {
          if (error || !result.body) {
            reject(error);
          } else {
            saveFile(
              result.body,
              `${imagesPath}/${themeName}/${emoji.category}`,
              `${emoji.name}_raw.png`,
            );
            resolve(result.body);
          }
        });
    }).then((content) => {
      emitter.emit(FETCHER_FETCH_IMAGE_SUCCESS, emoji, themeName, content);
    }).catch((error) => {
      emitter.emit(FETCHER_FETCH_IMAGE_ERROR, error, emoji, themeName);
    });
  };
  emitter.on(PARSER_FOUND_THEME, (emoji, themeName, imageUrl) => {
    fetchImage(emoji, themeName, imageUrl);
  });

  return {
    fetchCategories,
    fetchCategory,
    fetchEmoji,
    fetchImage,
  };
}