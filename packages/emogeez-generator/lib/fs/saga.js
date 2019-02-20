import jimp from 'jimp';
import fse from 'fs-extra';
import {
  put,
  take,
  call,
} from 'redux-saga/effects';
import {
  BASE_IMAGE_PATH,
  TEMP_HTML_PATH,
  TEMP_JSON_PATH,
  TEMP_STYLE_PATH,
  CONFIG_UPDATED,
  CURRENT_WORKING_DIRECTORY,
  TEMP_IMAGES_PATH,
} from '../constants';
import { fsReady } from './actions';
import { exitApp } from '../actions';
import logger from '../logger';

const createBaseImage = async (size) => {
  const image = await jimp.read(`${CURRENT_WORKING_DIRECTORY}/res/base.png`);
  try {
    await image
      .resize(parseInt(size * 2, 10), parseInt(size * 2, 10))
      .writeAsync(BASE_IMAGE_PATH);
    return true;
  } catch (error) {
    logger.error(error.message);
    throw new Error('💾 Cannot create base image');
  }
};

export default function* fsSaga() {
  const { payload: config } = yield take(CONFIG_UPDATED);
  yield call(fse.mkdirpSync, `${config.destination}/`);
  yield call(fse.mkdirpSync, TEMP_IMAGES_PATH);
  yield call(fse.mkdirpSync, TEMP_HTML_PATH);
  yield call(fse.mkdirpSync, TEMP_JSON_PATH);
  yield call(fse.mkdirpSync, TEMP_STYLE_PATH);

  try {
    yield call(createBaseImage, config.size);
    yield put(fsReady());
  } catch (e) {
    yield put(exitApp(e.message));
  }
}
