import {
  FETCHER_FETCH_CATEGORIES_SUCCESS,
  FETCHER_FETCH_CATEGORY_SUCCESS,
  FETCHER_FETCH_COMPLETE,
  FETCHER_FETCH_EMOJI_SUCCESS, FETCHER_FETCH_IMAGE_SUCCESS, FETCHER_IMAGES_FOUND, FETCHER_MODIFIERS_FOUND,
} from '../constants';

export const fetchComplete = () => ({
  type: FETCHER_FETCH_COMPLETE,
});

export const fetchCategoriesSucceeded = html => ({
  type: FETCHER_FETCH_CATEGORIES_SUCCESS,
  payload: {
    html,
  },
});

export const fetchCategorySucceeded = (category, html) => ({
  type: FETCHER_FETCH_CATEGORY_SUCCESS,
  payload: {
    category,
    html,
  },
});

export const fetchEmojiSucceeded = (emoji, html) => ({
  type: FETCHER_FETCH_EMOJI_SUCCESS,
  payload: {
    emoji,
    html,
  },
});

export const fetchImageSucceeded = (emoji, themeName, url, image) => ({
  type: FETCHER_FETCH_IMAGE_SUCCESS,
  payload: {
    emoji,
    themeName,
    url,
    image,
  },
});

export const modifiersFound = count => ({
  type: FETCHER_MODIFIERS_FOUND,
  payload: {
    count,
  },
});

export const imagesFound = count => ({
  type: FETCHER_IMAGES_FOUND,
  payload: {
    count,
  },
});
