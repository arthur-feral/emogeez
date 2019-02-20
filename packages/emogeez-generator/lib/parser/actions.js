import {
  PARSER_PARSE_CATEGORIES_SUCCESS,
  PARSER_PARSE_CATEGORY_SUCCESS,
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_IMAGE_SUCCESS,
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

export const parseImageSucceeded = (emoji, themeName, url) => ({
  type: PARSER_PARSE_IMAGE_SUCCESS,
  payload: {
    emoji,
    themeName,
    url,
  },
});
