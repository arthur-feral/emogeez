import fs from 'fs-extra';
import Throttle from 'superagent-throttle';
import {
  has,
  map,
  size,
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
  FETCHER_RETRY_COUNT,
  TEMP_HTML_PATH, TEMP_IMAGES_PATH,
} from '../constants';
import { getConfig } from '../config/selectors';
import { exitApp } from '../actions';
import { saveFile } from '../utils';
import { parseCategories, parseCategory, parseEmoji } from '../parser/parser';
import { parseCategoriesSucceeded, parseCategorySucceeded, parseEmojiSucceeded } from '../parser/actions';
import { fetchImageSucceeded, imagesFound, modifiersFound } from './actions';

const throttle = new Throttle({
  active: true, // set false to pause queue
  rate: 150, // how many requests can be sent every `ratePer`
  ratePer: 1000, // number of ms in which `rate` requests may be sent
  concurrent: 50, // how many requests can be sent concurrently
});
const getRequest = (superagent, url) => superagent
  .get(url)
  .use(throttle.plugin())
  .retry(FETCHER_RETRY_COUNT);

function* fetchImage(superagent, emoji, themeName, url) {
  const cacheFilePath = `${TEMP_IMAGES_PATH}/${themeName}/${emoji.category}/${emoji.name}_raw.png`;
  const { cache } = yield select(getConfig);

  let image = null;
  if (cache && fs.existsSync(cacheFilePath)) {
    image = fs.readFileSync(cacheFilePath);
  } else {
    try {
      const response = yield call(getRequest, superagent, url);
      image = response.body;
      yield call(saveFile, response.body, `${TEMP_IMAGES_PATH}/${themeName}/${emoji.category}`, `${emoji.name}_raw.png`);
    } catch (e) {
      yield put(exitApp(e));
    }
  }

  yield put(fetchImageSucceeded(emoji, themeName, url, image));
}

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
      yield call(saveFile, response.text, `${TEMP_HTML_PATH}/${emoji.category}`, `${emoji.name}.html`);
      emojiFull = parseEmoji(emoji, response.text);
    } catch (e) {
      yield put(exitApp(e));
    }
  }

  yield put(parseEmojiSucceeded(emoji, emojiFull));

  yield put(imagesFound(size(emojiFull.themes)));
  yield all(
    map(emojiFull.themes, (themeUrl, themeName) => fork(fetchImage, superagent, emojiFull, themeName, themeUrl)),
  );

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
      yield call(saveFile, response.text, TEMP_HTML_PATH, `${category.name}.html`);
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
}

export default function* fetcherSaga(superagent) {
  yield take(APP_READY);
  yield fork(fetchIndex, superagent);
}
