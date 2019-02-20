import {
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_SUCCESS,
} from '../constants';
import logger from '../logger';
import { getCollectorData } from './selectors';

const collectorMiddleware = store => next => (action) => {
  const {
    getState,
  } = store;
  const {
    type,
  } = action;

  switch (type) {
    case PARSER_PARSE_CATEGORIES_SUCCESS:
    case PARSER_PARSE_CATEGORY_SUCCESS:
    case PARSER_PARSE_IMAGE_SUCCESS:
    case PARSER_PARSE_EMOJI_SUCCESS: {
      next(action);

      const {
        categoriesToFetch,
        categoriesFetched,
        emojisToFetch,
        emojisFetched,
        imagesToProcess,
        imagesProcessed,
      } = getCollectorData(getState());
      const catPercentage = Math.floor((categoriesFetched / categoriesToFetch) * 100);
      const emoPercentage = Math.floor((emojisFetched / emojisToFetch) * 100);
      const imaPercentage = Math.floor((imagesProcessed / imagesToProcess) * 100);
      const total = (catPercentage + emoPercentage + imaPercentage) / 3;
      let toLog = '📡 Collecting data: ♻️ ';
      toLog += ` = [C ${categoriesFetched}/${categoriesToFetch} - ${catPercentage}%]`;
      toLog += ` = [E ${emojisFetched}/${emojisToFetch} - ${emoPercentage}%]`;
      toLog += ` = [I ${imagesProcessed}/${imagesToProcess} - ${imaPercentage}%]`;
      toLog += ` = [TOTAL ${Math.floor(total)}%]`;

      logger.sameLine(toLog);
      break;
    }

    default:
      next(action);
      break;
  }
};

export default collectorMiddleware;
