import fs from 'fs-extra';
import {
  map,
  reduce,
  omit,
  has,
  get,
  findIndex,
} from 'lodash';
import {
  take,
  fork,
  select,
  call,
  all,
} from 'redux-saga/effects';
import { GENERATOR_GENERATE_THEMES_SUCCESS } from '../constants';
import {
  getCategories,
  getEmojis,
  getThemes,
} from './selectors';
import { getConfig } from '../config/selectors';

function* generateThemeJSON(themeName, theme) {
  const config = yield select(getConfig);
  const emojis = yield select(getEmojis);
  const categories = yield select(getCategories);
  const json = reduce(theme, (result, emojiName) => {
    const emoji = omit(emojis[emojiName], 'url', 'themes', 'modifiers');

    if (!has(emoji, 'parent')) {
      return {
        ...result,
        [emoji.category]: {
          ...result[emoji.category] || categories[emoji.category],
          emojis: [
            ...get(result, `[${emoji.category}].emojis`, []),
            emoji,
          ],
        },
      };
    }
    const parentIndex = findIndex(result[emoji.category].emojis, (e => e.name === emoji.parent));
    const parent = result[emoji.category].emojis[parentIndex];
    parent.modifiers = {
      ...parent.modifiers || {},
      [emoji.name]: emoji,
    };

    return {
      ...result,
      [emoji.category]: {
        ...result[emoji.category] || categories[emoji.category],
        emojis: reduce(get(result, `[${emoji.category}].emojis`, []), (result, e) => {
          if (e.name === emoji.parent) {
            return [
              ...result,
              parent,
            ];
          }

          return [
            ...result,
            e,
          ];
        }, []),
      },
    };
  }, {});

  fs.writeFileSync(`${config.destination}/${themeName}/${themeName}.json`, JSON.stringify(json), 'utf8');
}

function* generateThemesJSON() {
  const themes = yield select(getThemes);

  yield all(
    map(themes, (theme, themeName) => call(generateThemeJSON, themeName, theme)),
  );
}

export default function* collectorSaga() {
  yield take(GENERATOR_GENERATE_THEMES_SUCCESS);

  yield fork(generateThemesJSON);
}
