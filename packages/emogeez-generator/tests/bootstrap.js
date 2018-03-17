import jimp from 'jimp';
import fs from 'fs-extra';

const baseConfig = {
  destination: `${process.env.TEMP_FILES_PATH}/emojis`,
  size: 48,
  fromCache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/emojis/`);
fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/images/`);
fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/html/`);
fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/styles/`);
