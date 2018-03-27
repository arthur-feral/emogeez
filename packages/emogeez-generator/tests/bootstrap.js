import fs from 'fs-extra';

fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/emojis/`);
fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/images/`);
fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/html/`);
fs.mkdirpSync(`${process.env.TEMP_FILES_PATH}/styles/`);
