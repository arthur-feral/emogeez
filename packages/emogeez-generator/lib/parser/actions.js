import {
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
} from '../constants';

export const parseCategoriesSucceeded = categories => ({
  type: PARSER_PARSE_CATEGORIES_SUCCESS,
  payload: {
    categories,
  },
});

export const parseCategorySucceeded = (category, emojis) => ({
  type: PARSER_PARSE_CATEGORY_SUCCESS,
  payload: {
    category,
    emojis,
  },
});

export const parseEmojiSucceeded = (emojiBase, emoji) => ({
  type: PARSER_PARSE_EMOJI_SUCCESS,
  payload: {
    emojiBase,
    emoji,
  },
});
