import {
  keys,
  size,
  throttle,
} from 'lodash';
import {
  ERROR,
  PARSER_FOUND_MODIFIERS,
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_SUCCESS,
  PARSER_PARSED_ALL_IMAGES,

  FETCHER_FETCH_CATEGORIES_ERROR,
  FETCHER_FETCH_CATEGORY_ERROR,
  FETCHER_FETCH_EMOJI_ERROR,
  FETCHER_FETCH_IMAGE_ERROR,
  PARSER_PARSE_CATEGORIES_ERROR,
  PARSER_PARSE_CATEGORY_ERROR,
  PARSER_PARSE_EMOJI_ERROR,
  PARSER_PARSE_IMAGE_ERROR,
  PARSER_FOUND_THEME,
} from '../constants';
import logger from '../logger';

export default (config, emitter) => {
  let emojisTotal = 0;
  let emojisScrapped = 0;
  let imagesTotal = 0;
  let imagesComputed = 0;
  let categoriesTotal = 0;
  let categoriesScrapped = 0;

  const printProgress = () => {
    let catPercentage = Math.floor(categoriesScrapped / categoriesTotal * 100);
    let emoPercentage = Math.floor(emojisScrapped / emojisTotal * 100);
    let imaPercentage = Math.floor(imagesComputed / imagesTotal * 100);
    let total = (catPercentage + emoPercentage + imaPercentage) / 3;
    let toLog = `📡 Collecting data: ♻️ `;
    toLog += ` = [C ${categoriesScrapped}/${categoriesTotal} - ${catPercentage}%]`;
    toLog += ` = [E ${emojisScrapped}/${emojisTotal} - ${emoPercentage}%]`;
    toLog += ` = [I ${imagesComputed}/${imagesTotal} - ${imaPercentage}%]`;
    toLog += ` = [TOTAL ${Math.floor(total)}%]`;

    logger.sameLine(toLog);
  };
  const logProgress = throttle(printProgress, 200);

  emitter.on(PARSER_PARSE_CATEGORIES_SUCCESS, (categories) => {
    categoriesTotal += categories.length;
    logProgress();
  });
  emitter.on(PARSER_FOUND_MODIFIERS, (emojis) => {
    emojisTotal += size(emojis);
    logProgress();
  });

  emitter.on(PARSER_PARSE_CATEGORY_SUCCESS, (emojis) => {
    emojisTotal += emojis.length;
    categoriesScrapped += 1;
  });

  emitter.on(PARSER_PARSE_EMOJI_SUCCESS, () => {
    emojisScrapped += 1;
  });

  emitter.on(PARSER_FOUND_THEME, () => {
    imagesTotal += 1;
    logProgress();
  });

  emitter.on(PARSER_PARSE_IMAGE_SUCCESS, () => {
    imagesComputed += 1;
    logProgress();
  });

  const printError = (error) => {
    logger.error(error.message);
    logger.error(error.stack);
  };

  emitter.on(FETCHER_FETCH_CATEGORIES_ERROR, printError);
  emitter.on(FETCHER_FETCH_CATEGORY_ERROR, printError);
  emitter.on(FETCHER_FETCH_EMOJI_ERROR, printError);
  emitter.on(FETCHER_FETCH_IMAGE_ERROR, printError);
  emitter.on(PARSER_PARSE_CATEGORIES_ERROR, printError);
  emitter.on(PARSER_PARSE_CATEGORY_ERROR, printError);
  emitter.on(PARSER_PARSE_EMOJI_ERROR, printError);
  emitter.on(PARSER_PARSE_IMAGE_ERROR, printError);

  emitter.on(ERROR, printError);
};
