import { createSelector } from 'reselect';
import {
  reduce,
} from 'lodash';

export const getCollectorDomain = state => state.collector;

export const getCollectorData = getCollectorDomain;
export const getEmojis = state => getCollectorDomain(state).emojis;
export const getCategories = state => getCollectorDomain(state).categories;
export const getCategoriesToFetch = state => getCollectorDomain(state).categoriesToFetch;
export const getThemes = state => getCollectorDomain(state).themes;
export const getThemesImages = createSelector(
  getThemes,
  themes => reduce(themes, (result, images, themeName) => ({
    ...result,
    ...reduce(images, (res, emojiName, url) => ({
      ...res,
      [emojiName]: {
        url,
        emojiName,
        themeName,
      },
    }), {}),
  }), {}),
);
