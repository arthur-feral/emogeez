import {
  each,
  includes,
} from 'lodash';
import logger from '../logger';
import {
  APP_READY, APP_START,
  ERROR,
} from '../constants';
import fse from 'fs-extra';
import jimp from 'jimp';
import Configuration from './Configuration';

/**
 * default config
 * @name DEFAULT_CONFIG_PARAMS
 * @type {Object}
 */
const DEFAULT_CONFIG_PARAMS = {
  destination: 'emojis',
  size: 48,
  cache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

const AVAILABLE_PREPROCESSORS = ['sass', 'less'];
const TEMP_FILES_PATH = process.env.TEMP_FILES_PATH;
const IMAGES_PATH = `${TEMP_FILES_PATH}/images`;
const BASE_IMAGE_PATH = `${IMAGES_PATH}/base.png`;

/**
 * parse cli args and build config to provide to the module
 * @name configure
 * @param {Object} commander
 * @param {Object} emitter
 */
export default (commander, emitter) => {
  logger.sameLine('⚙️ Configuring app: ♻️');
  let config = {};

  if (commander.preproc && !includes(AVAILABLE_PREPROCESSORS, commander.preproc)) {
    throw new Error('⚙️ You must provide a correct preprocessor parameter');
  }

  each(DEFAULT_CONFIG_PARAMS, (defaultValue, parameter) => {
    config[parameter] = commander[parameter] ?
      commander[parameter] :
      defaultValue;
    logger.info(`${parameter}: ${config[parameter]}`);
  });
  logger.success('⚙️ Configuring app: ✅');

  logger.sameLine('💾 Preparing files space: ♻️');
  emitter.on(APP_START, () => {
    fse.mkdirpSync(`${config.destination}/`);
    fse.mkdirpSync(`${TEMP_FILES_PATH}/images/`);
    fse.mkdirpSync(`${TEMP_FILES_PATH}/html/`);
    fse.mkdirpSync(`${TEMP_FILES_PATH}/jsons/`);
    fse.mkdirpSync(`${TEMP_FILES_PATH}/styles/`);
    jimp.read(`${process.cwd()}/res/base.png`).then((image) => {
      image
        .resize(parseInt(config.size, 10), parseInt(config.size, 10))
        .write(BASE_IMAGE_PATH, (imageError) => {
          if (imageError) {
            emitter.emit(ERROR, imageError);
          }
          logger.success('💾 Preparing files space: ✅️');
          emitter.emit(APP_READY);
        });
    }).catch((readError) => {
      emitter.emit(ERROR, readError);
    });
  });

  return new Configuration(config);
};
