import jimp, { AUTO } from 'jimp';
import Spritesmith from 'spritesmith';
import sizeOf from 'image-size';
import fse from 'fs-extra';
import fs from 'fs';
import imagemin from 'imagemin';
import imageminPng from 'imagemin-pngquant';
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
  BASE_IMAGE_PATH,
  DATA_OPTIMIZATION_DONE,
  EXTENTIONS,
  TEMP_IMAGES_PATH,
} from '../constants';
import logger from '../logger';
import {
  getEmojis,
  getThemes,
} from '../collector/selectors';
import { getConfig } from '../config/selectors';
import { getRequest, saveFile } from '../utils';
import { exitApp } from '../actions';
import { parseImageSucceeded, parseImageFailed } from '../parser/actions';
import { generateSpriteSucceeded, generateThemesSucceeded } from './actions';
import StylesGenerator from './stylesGenerators';

function* processImage(emoji, themeName, url) {
  const config = yield select(getConfig);
  const imageFolder = `${TEMP_IMAGES_PATH}${themeName}/${emoji.category}`;
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
        .resize(AUTO, sizeWithGoodResolution)
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
      logger.error('processImage', emoji.name, themeName, url, e);
      success = false;
    }
  }

  if (success) {
    yield put(parseImageSucceeded(emoji, themeName, url));
  } else {
    console.error(emoji, themeName, url); // eslint-disable-line no-console
    yield put(parseImageFailed(emoji, themeName, url));
  }
}

function* fetchImage(superagent, emoji, themeName, url) {
  const cacheFilePath = `${TEMP_IMAGES_PATH}${themeName}/${emoji.category}`;
  const cacheFileName = `${emoji.name}_raw.png`;
  if (!fse.existsSync(`${cacheFilePath}/${cacheFileName}`)) {
    try {
      const response = yield call(getRequest, superagent, url);
      saveFile(response.body, cacheFilePath, cacheFileName);
      yield call(processImage, emoji, themeName, url);
    } catch (e) {
      yield put(parseImageFailed(emoji, themeName, url));
    }
  }
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
    yield put(exitApp(error));
  }

  logger.success(`[Generator] ${themeName} done`);
  yield put(generateSpriteSucceeded(themeName));
}

function _generateSprite(sources, destination, name) { // eslint-disable-line no-underscore-dangle
  return new Promise((resolve, reject) => {
    Spritesmith.run({ src: sources }, async (err, result) => {
      if (err) {
        reject(err);
      } else {
        const {
          properties,
          coordinates,
          image,
        } = result;

        try {
          fse.writeFileSync(`${destination}/${name}`, image);
          await imagemin([`${destination}/*.png`], destination, {
            plugins: [
              imageminPng({
                strip: true,
                // dithering: 0.1,
                speed: 10,
                // quality: [0.10, 0.20],
                // posterize: 4,
              }),
            ],
          });
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
  const emojisFilePath = map(theme, (emojiName) => {
    const emoji = emojis[emojiName];

    return `${TEMP_IMAGES_PATH}${themeName}/${emoji.category}/${emoji.name}.png`;
  });
  const emojisNames = map(theme, emojiName => emojiName);
  const themeSpritePath = `${config.destination}/${themeName}`;
  const themeSpriteName = `${themeName}.png`;
  fse.mkdirpSync(themeSpritePath);

  try {
    const {
      properties,
      coordinates,
    } = yield call(_generateSprite, emojisFilePath, themeSpritePath, themeSpriteName);
    yield call(generateStyle, config, themeName, emojisNames, properties, coordinates);
  } catch (e) {
    console.error(themeName, theme); // eslint-disable-line no-console
    yield put(exitApp(e));
  }
}


function* generateSprites() {
  const theme = yield select(getThemes);

  yield all(
    map(theme, (theme, themeName) => call(generateSprite, themeName, theme)),
  );
}

/**
 * fetch all images and generate themes
 * @param superagent
 * @return {IterableIterator<*>}
 */
function* generateThemes(superagent) {
  const emojis = yield select(getEmojis);
  const themes = yield select(getThemes);

  const imagesToFetch = reduce(themes, (result, theme, themeName) => ([
    ...result,
    ...reduce(theme, (result, emojiName, imageUrl) => ([
      ...result,
      [superagent, emojis[emojiName], themeName, imageUrl],
    ]), []),
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
  yield take(DATA_OPTIMIZATION_DONE);
  logger.sameLine('🌈 Generating themes files: ♻️');
  logger.info('');
  yield fork(generateThemes, superagent);
}
