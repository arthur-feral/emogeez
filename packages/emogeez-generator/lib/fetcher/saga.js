import fs from 'fs-extra';
import {
  has,
  map,
  size,
  take as _take,
} from 'lodash';
import {
  take,
  fork,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';
import {
  APP_READY,
  BASE_URL,
  TEMP_HTML_PATH,
} from '../constants';
import { getConfig } from '../config/selectors';
import { exitApp } from '../actions';
import { getRequest, saveFile } from '../utils';
import { parseCategories, parseCategory, parseEmoji } from '../parser/parser';
import { parseCategoriesSucceeded, parseCategorySucceeded, parseEmojiSucceeded } from '../parser/actions';
import { fetchComplete, modifiersFound } from './actions';
import logger from '../logger';

function* fetchEmoji(superagent, emoji) {
  const cacheFilePath = `${TEMP_HTML_PATH}/${emoji.category}/${emoji.name}.html`;

  let emojiFull = null;
  const { cache } = yield select(getConfig);
  if (cache && fs.existsSync(cacheFilePath)) {
    const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
    emojiFull = parseEmoji(emoji, fileContent);
  } else {
    try {
      const response = yield call(getRequest, superagent, emoji.url);
      saveFile(response.text, `${TEMP_HTML_PATH}/${emoji.category}`, `${emoji.name}.html`);
      emojiFull = parseEmoji(emoji, response.text);
    } catch (e) {
      yield put(exitApp(e));
    }
  }

  yield put(parseEmojiSucceeded(emoji, emojiFull));

  if (has(emojiFull, 'modifiers')) {
    yield put(modifiersFound(size(emojiFull.modifiers)));
    yield all(
      map(emojiFull.modifiers, modifier => call(fetchEmoji, superagent, modifier)),
    );
  }
}

function* fetchCategory(superagent, category) {
  const cacheFilePath = `${TEMP_HTML_PATH}/${category.name}.html`;
  const { cache } = yield select(getConfig);
  let emojis = [];
  if (cache && fs.existsSync(cacheFilePath)) {
    const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
    emojis = parseCategory(category, fileContent);
  } else {
    try {
      const response = yield call(getRequest, superagent, category.url);
      saveFile(response.text, TEMP_HTML_PATH, `${category.name}.html`);
      emojis = parseCategory(category, response.text);
    } catch (e) {
      yield put(exitApp(e));
    }
  }

  yield put(parseCategorySucceeded(category, emojis));

  yield all(
    emojis.map(emoji => call(fetchEmoji, superagent, emoji)),
  );
}

function* fetchIndex(superagent) {
  const cacheFilePath = `${TEMP_HTML_PATH}/index.html`;
  const { cache } = yield select(getConfig);
  let categories = [];
  if (cache && fs.existsSync(cacheFilePath)) {
    const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
    categories = parseCategories(fileContent);
  } else {
    try {
      const response = yield call(getRequest, superagent, BASE_URL);
      yield call(saveFile, response.text, TEMP_HTML_PATH, 'index.html');
      categories = parseCategories(response.text);
    } catch (e) {
      yield put(exitApp(e));
    }
  }

  yield put(parseCategoriesSucceeded(categories));

  yield all(
    categories.map(category => call(fetchCategory, superagent, category)),
  );
  yield put(fetchComplete());
  logger.success('📡  Collecting data: ✅️');
}

export default function* fetcherSaga(superagent) {
  yield take(APP_READY);

  logger.sameLine('📡  Collecting data: ♻️');
  yield fork(fetchIndex, superagent);
}
