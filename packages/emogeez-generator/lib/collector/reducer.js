import {
  reduce,
  size,
  omit,
  includes,
} from 'lodash';
import {
  FETCHER_MODIFIERS_FOUND,
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_ERROR,
  PARSER_PARSE_IMAGE_SUCCESS,
  ALLOWED_THEMES,
  DATA_OPTIMIZATION_DONE,
} from '../constants';

const initialState = {
  categories: {},
  emojis: {},
  themes: {},
  themedEmojis: {},

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
      const themes = reduce(emoji.themes, (result, themeUrl, themeName) => {
        // if (includes(ALLOWED_THEMES, themeName)) {
        //   return {
        //     ...result,
        //     [themeName]: {
        //       ...state.themes[themeName],
        //       [themeUrl]: emoji.name,
        //     },
        //   };
        // }

        return {
          ...result,
          [themeName]: {
            ...state.themes[themeName],
            [themeUrl]: emoji.name,
          },
        };
      }, state.themes);

      return {
        ...state,
        emojis: {
          ...state.emojis,
          [emoji.name]: emoji,
        },
        emojisFetched: state.emojisFetched + 1,
        imagesToProcess: state.imagesToProcess + size(emoji.themes),
        themes,
      };
    }

    case PARSER_PARSE_IMAGE_SUCCESS: {
      return {
        ...state,
        imagesProcessed: state.imagesProcessed + 1,
      };
    }

    case PARSER_PARSE_IMAGE_ERROR: {
      const {
        themeName,
        url,
      } = payload;

      return {
        ...state,
        themes: {
          ...state.themes,
          [themeName]: omit(state.themes[themeName], url),
        },
      };
    }

    case DATA_OPTIMIZATION_DONE: {
      const {
        emojis,
        categories,
        themedEmojis,
      } = payload;
      return {
        ...state,
        emojis,
        categories,
        themedEmojis,
      };
    }

    default:
      return state;
  }
};

export default collectorReducer;
