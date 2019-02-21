import fs from 'fs-extra';
import {
  map,
  reduce,
  omit,
  has,
  sortBy,
  get,
} from 'lodash';
import {
  take,
  fork,
  select,
  call,
  put,
  all,
} from 'redux-saga/effects';
import logger from '../logger';
import {
  GENERATOR_GENERATE_THEMES_SUCCESS,
  CATEGORIES_ORDER,
  FETCHER_FETCH_COMPLETE, APP_READY,
} from '../constants';
import {
  getCategories,
  getEmojis,
  getThemedEmojis,
  getThemes,
} from './selectors';
import { getConfig } from '../config/selectors';
import { dataOptimizationDone } from './actions';

function* generateThemeJSON(themeName, categories) {
  const config = yield select(getConfig);
  const emojis = yield select(getEmojis);

  const json = reduce(categories, (resultCategories, category, categoryName) => ({
    ...resultCategories,
    [categoryName]: {
      ...category,
      emojis: reduce(category.emojis, (resultEmojis, emoji, emojiName) => {
        if (has(emoji, 'parent')) {
          return {
            ...omit(resultEmojis, emojiName),
            [emoji.parent]: {
              ...get(resultEmojis, `[${emoji.parent}]`, null) || emojis[emoji.parent],
              modifiers: {
                ...get(resultEmojis, `[${emoji.parent}].modifiers`, {}),
                [emojiName]: emoji,
              },
            },
          };
        }

        return {
          ...category.emojis,
          [emojiName]: emoji,
        };
      }, {}),
    },
  }), {});

  fs.writeFileSync(`${config.destination}/${themeName}/${themeName}.json`, JSON.stringify(json), 'utf8');
}

function* generateThemesJSON() {
  logger.sameLine('🧳 Packing json: ♻️');

  const config = yield select(getConfig);
  const themedEmojis = yield select(getThemedEmojis);

  yield all(
    map(themedEmojis, (categories, themeName) => call(generateThemeJSON, themeName, categories)),
  );

  const categories = yield select(getCategories);
  const emojis = yield select(getEmojis);
  const json = reduce(categories, (resultCategories, category, categoryName) => ({
    ...resultCategories,
    [categoryName]: {
      ...category,
      emojis: reduce(emojis, (resultEmojis, emoji, emojiName) => {
        if (emoji.category === categoryName) {
          return {
            ...resultEmojis,
            [emojiName]: emoji,
          };
        }

        return resultEmojis;
      }, {}),
    },
  }), {});
  fs.writeFileSync(`${config.destination}/emojis.json`, JSON.stringify(json), 'utf8');

  logger.success('🧳 Packing json: ✅');
}

function* optimizeDatas() {
  logger.sameLine('💈 Data optimization: ♻️');
  const categories = yield select(getCategories);
  const categoriesOrdered = reduce(CATEGORIES_ORDER, (result, categoryName) => ({
    ...result,
    [categoryName]: omit(categories[categoryName], 'url'),
  }), {});

  const emojis = yield select(getEmojis);
  let orderedEmojis = sortBy(emojis, emoji => emoji.index);
  orderedEmojis = reduce(orderedEmojis, (result, emoji) => ({
    ...result,
    [emoji.name]: omit(emoji, 'url', 'themes', 'modifiers', 'index'),
  }), {});

  const themes = yield select(getThemes);
  const themedEmojis = reduce(themes, (resultThemes, emojisForTheme, themeName) => {
    const emojisInTheme = reduce(emojisForTheme, (r, e) => ({
      ...r,
      [e]: e,
    }), {});
    return {
      ...resultThemes,
      [themeName]: {
        ...reduce(categoriesOrdered, (resultCategories, category, categoryName) => ({
          ...resultCategories,
          [categoryName]: {
            ...category,
            emojis: reduce(orderedEmojis, (resultEmojis, emoji, emojiName) => {
              if (has(emojisInTheme, emojiName) && emoji.category === categoryName) {
                return {
                  ...resultEmojis,
                  [emojiName]: emoji,
                };
              }

              return resultEmojis;
            }, {}),
          },
        }), {}),
      },
    };
  }, {});
  logger.success('💈 Data optimization: ✅');
  yield put(dataOptimizationDone(categoriesOrdered, orderedEmojis, themedEmojis));
}

export default function* collectorSaga() {
  yield take(APP_READY);
  yield take(FETCHER_FETCH_COMPLETE);

  yield call(optimizeDatas);

  yield take(GENERATOR_GENERATE_THEMES_SUCCESS);

  yield fork(generateThemesJSON);
}
