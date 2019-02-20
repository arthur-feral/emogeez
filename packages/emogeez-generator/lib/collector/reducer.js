import {
  reduce,
} from 'lodash';
import {
  FETCHER_IMAGES_FOUND,
  FETCHER_MODIFIERS_FOUND,
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_SUCCESS,
} from '../constants';

const initialState = {
  categories: {},
  emojis: {},
  themes: {},

  categoriesToFetch: 0,
  categoriesFetched: 0,

  emojisToFetch: 0,
  emojisFetched: 0,

  imagesToProcess: 0,
  imagesProcessed: 0,
};
const collectorReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PARSER_PARSE_CATEGORIES_SUCCESS: {
      const {
        categories,
      } = payload;

      return {
        ...state,
        categories: reduce(categories, (result, category) => ({
          ...result,
          [category.name]: category,
        }), state.categories),
        categoriesToFetch: categories.length,
      };
    }

    case PARSER_PARSE_CATEGORY_SUCCESS: {
      const {
        emojis,
      } = payload;

      return {
        ...state,
        emojis: reduce(emojis, (result, emoji) => ({
          ...result,
          [emoji.name]: emoji,
        }), state.emojis),
        categoriesFetched: state.categoriesFetched + 1,
        emojisToFetch: state.emojisToFetch + emojis.length,
      };
    }

    case FETCHER_MODIFIERS_FOUND: {
      const {
        count,
      } = payload;

      return {
        ...state,
        emojisToFetch: state.emojisToFetch + count,
      };
    }

    case PARSER_PARSE_EMOJI_SUCCESS: {
      const {
        emoji,
      } = payload;

      return {
        ...state,
        emojis: {
          ...state.emojis,
          [emoji.name]: emoji,
        },
        emojisFetched: state.emojisFetched + 1,
      };
    }

    case FETCHER_IMAGES_FOUND: {
      return {
        ...state,
        imagesToProcess: state.imagesToProcess + payload.count,
      };
    }

    case PARSER_PARSE_IMAGE_SUCCESS: {
      return {
        ...state,
        imagesProcessed: state.imagesProcessed + 1,
      };
    }

    default:
      return state;
  }
};

export default collectorReducer;
