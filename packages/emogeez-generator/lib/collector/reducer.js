import {
  reduce, size, includes,
} from 'lodash';
import {
  FETCHER_MODIFIERS_FOUND,
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_ERROR,
  PARSER_PARSE_IMAGE_SUCCESS,
  ALLOWED_THEMES,
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
      const themes = reduce(emoji.themes, (result, themeUrl, themeName) => {
        if (includes(ALLOWED_THEMES, themeName)) {
          return {
            ...result,
            [themeName]: {
              ...state.themes[themeName],
              [themeUrl]: emoji.name,
            },
          };
        }
        return result;
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
        emoji,
        themeName,
        url,
      } = payload;
      const theme = reduce(emoji.themes[themeName], (result, themeUrl, emojiName) => {
        if (themeUrl !== url) {
          return {
            ...result,
            [themeUrl]: emojiName,
          };
        }

        return result;
      }, {});

      return {
        ...state,
        themes: {
          ...state.themes,
          [themeName]: theme,
        },
      };
    }

    default:
      return state;
  }
};

export default collectorReducer;
