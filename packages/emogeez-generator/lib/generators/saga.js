import jimp, { AUTO } from 'jimp';
import Spritesmith from 'spritesmith';
import sizeOf from 'image-size';
import fse from 'fs-extra';
import fs from 'fs';
import {
  map,
  reduce,
} from 'lodash';
import {
  take,
  fork,
  select,
  call,
  all,
  put,
} from 'redux-saga/effects';
import {
  APP_READY,
  BASE_IMAGE_PATH, EXTENTIONS,
  FETCHER_FETCH_COMPLETE,
  TEMP_IMAGES_PATH,
} from '../constants';
import logger from '../logger';
import {
  getEmojis, getThemes,
  getThemesImages,
} from '../collector/selectors';
import { getConfig } from '../config/selectors';
import { getRequest, saveFile } from '../utils';
import { exitApp } from '../actions';
import { parseImageSucceeded } from '../parser/actions';
import { generateSpriteSucceeded, generateThemesSucceeded } from './actions';
import StylesGenerator from './stylesGenerators';

function* processImage(emoji, themeName, url) {
  const config = yield select(getConfig);
  const imageFolder = `${TEMP_IMAGES_PATH}/${themeName}/${emoji.category}`;
  const imagePath = `${imageFolder}/${emoji.name}.png`;
  const imageRawPath = `${imageFolder}/${emoji.name}_raw.png`;

  const sizeWithGoodResolution = config.size * 2;
  let alreadyProcessed = true;
  let success = true;
  try {
    const dims = sizeOf(imagePath);
    // if we found the image but the dimensions are differents, then we process again
    if (parseInt(dims.width, 10) !== sizeWithGoodResolution) {
      alreadyProcessed = false;
    }
  } catch (e) {
    alreadyProcessed = false;
  }

  if (!alreadyProcessed) {
    try {
      const image = yield call(jimp.read, imageRawPath);
      image
      // first we need to autocrop to remove extra transparent pixels
        .autocrop()
        .resize(sizeWithGoodResolution, AUTO)
        .write(imagePath);
      const baseImage = yield call(jimp.read, BASE_IMAGE_PATH);
      const dimensions = sizeOf(imagePath);
      const x = Math.round((sizeWithGoodResolution - dimensions.width) / 2);
      const y = Math.round((sizeWithGoodResolution - dimensions.height) / 2);
      baseImage
        .resize(sizeWithGoodResolution, sizeWithGoodResolution)
        .composite(image, x, y)
        .write(imagePath);
    } catch (e) {
      success = false;
    }
  }

  if (success) {
    yield put(parseImageSucceeded(emoji, themeName, url));
  }
}

function* fetchImage(superagent, emoji, themeName, url) {
  const cacheFilePath = `${TEMP_IMAGES_PATH}/${themeName}/${emoji.category}/${emoji.name}_raw.png`;

  if (!fse.existsSync(cacheFilePath)) {
    try {
      const response = yield call(getRequest, superagent, url);
      saveFile(response.body, `${TEMP_IMAGES_PATH}/${themeName}/${emoji.category}`, `${emoji.name}_raw.png`);
    } catch (e) {
      yield put(exitApp(e));
    }
  }

  yield call(processImage, emoji, themeName, url);
}

function* generateStyle(config, themeName, emojisNames, properties, coordinates) {
  const styleFiles = StylesGenerator(config)(themeName, emojisNames, properties, coordinates);
  const filePath = `${config.destination}/${themeName}`;
  const fileNameCss = `${themeName}.${EXTENTIONS.css}`;
  const completePathCss = `${filePath}/${fileNameCss}`;
  const fileNamePreproc = `${themeName}.${EXTENTIONS[config.preproc]}`;
  const completePathPreproc = `${filePath}/${fileNamePreproc}`;

  try {
    yield call(fse.mkdirpSync, filePath);
    yield call(fs.writeFileSync, completePathCss, styleFiles.css, 'utf8');
    yield call(fs.writeFileSync, completePathPreproc, styleFiles[config.preproc], 'utf8');
  } catch (error) {
    yield call(exitApp(error));
  }

  logger.success(`[Generator] ${themeName} done`);
  yield put(generateSpriteSucceeded(themeName));
}

function _generateSprite(sources, destination) { // eslint-disable-line no-underscore-dangle
  return new Promise((resolve, reject) => {
    Spritesmith.run({ src: sources }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const {
          properties,
          coordinates,
          image,
        } = result;

        try {
          fse.writeFileSync(destination, image);
          resolve({
            properties,
            coordinates,
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

function* generateSprite(themeName, theme) {
  const emojis = yield select(getEmojis);
  const config = yield select(getConfig);
  const emojisFilePath = map(theme, (_, emojiName) => {
    const emoji = emojis[emojiName];

    return `${TEMP_IMAGES_PATH}/${themeName}/${emoji.category}/${emoji.name}.png`;
  });
  const emojisNames = map(theme, (_, emojiName) => emojiName);
  const themeSpritePath = `${config.destination}/${themeName}`;
  const themeSpriteDestination = `${themeSpritePath}/${themeName}.png`;
  fse.mkdirpSync(themeSpritePath);

  try {
    const {
      properties,
      coordinates,
    } = yield call(_generateSprite, emojisFilePath, themeSpriteDestination);
    yield call(generateStyle, config, themeName, emojisNames, properties, coordinates);
  } catch (e) {
    yield put(exitApp(e));
  }
}


function* generateSprites() {
  const themes = yield select(getThemes);

  yield all(
    map(themes, (theme, themeName) => call(generateSprite, themeName, theme)),
  );
}

/**
 * fetch all images and generate themes
 * @param superagent
 * @return {IterableIterator<*>}
 */
function* generateThemes(superagent) {
  const emojis = yield select(getEmojis);
  const themes = yield select(getThemesImages);
  const imagesToFetch = reduce(themes, (result, theme) => ([
    ...result,
    [superagent, emojis[theme.emojiName], theme.themeName, theme.url],
  ]), []);

  yield all(
    imagesToFetch.map(args => call(fetchImage, ...args)),
  );
  yield call(generateSprites);
  yield put(generateThemesSucceeded());
}

/**
 * Main saga
 * @param superagent
 * @return {IterableIterator<*>}
 */
export default function* generatorSaga(superagent) {
  yield take(APP_READY);
  yield take(FETCHER_FETCH_COMPLETE);
  logger.sameLine('🌈 Generating themes files: ♻️');
  yield fork(generateThemes, superagent);
}
