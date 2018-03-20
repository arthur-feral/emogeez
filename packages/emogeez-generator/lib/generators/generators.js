import {
  has,
  forEach,
  map,
  omit,
  keys,
  reduce,
} from 'lodash';
import {
  APP_READY,
  COLLECTOR_COLLECT_DONE,
  ERROR,
  FETCHER_FETCH_IMAGE_SUCCESS,
  PARSER_PARSE_IMAGE_ERROR,
  PARSER_PARSE_IMAGE_SUCCESS,
  GENERATOR_GENERATE_SPRITE_SUCCESS,
  GENERATOR_GENERATE_SPRITE_ERROR,
  GENERATOR_GENERATE_STYLE_SUCCESS,
  GENERATOR_GENERATE_THEMES_SUCCESS,
  EXTENTIONS,
} from '../constants';
import jimp from 'jimp';
import logger from '../logger';
import sizeOf from 'image-size';
import gm from 'gm';
import fse from 'fs-extra';
import fs from 'fs';
import StylesGenerator from './stylesGenerators';

const PngQuant = require('pngquant');
const pngOptimizer = new PngQuant([192, '--quality', '60-80', '--nofs', '-']);
const Spritesmith = require('spritesmith');
const spritesmith = new Spritesmith();
const MAX_IMAGES_TO_PROCESS_AT_TIME = 1;

const TEMP_FILES_PATH = process.env.TEMP_FILES_PATH;
const IMAGES_PATH = `${TEMP_FILES_PATH}/images`;
const BASE_IMAGE_PATH = `${IMAGES_PATH}/base.png`;

export default (config, emitter) => {
  const stylesGenerator = StylesGenerator(config, emitter);
  let imagesToProcess = [];
  //let spritesToProcess = [];
  let imagesProcessing = 0;

  /**
   *
   * @param {object} emoji
   * @param {string} themeName
   * @return {*}
   */
  const generateImage = (emoji, themeName) => {
    imagesProcessing += 1;
    let imageFolder = `${TEMP_FILES_PATH}/images/${themeName}/${emoji.category}`;
    let imagePath = `${imageFolder}/${emoji.name}.png`;
    let imageRawPath = `${imageFolder}/${emoji.name}_raw.png`;
    let alreadyProcessed = true;

    try {
      const dims = sizeOf(imagePath);

      // if we found the image but the dimensions are differents, then we process again
      if (parseInt(dims.width, 10) !== parseInt(config.size, 10)) {
        alreadyProcessed = false;
      }
    } catch (error) {
      alreadyProcessed = false;
    }

    if (alreadyProcessed) {
      emitter.emit(PARSER_PARSE_IMAGE_SUCCESS, emoji, themeName, imagePath);
      return Promise.resolve(emoji, themeName, imagePath);
    } else {
      return new Promise((resolve, reject) => {
        jimp.read(imageRawPath).then((image) => {
          image
            .autocrop()
            .write(imagePath, (writeBaseError) => {
              if (writeBaseError) {
                reject(writeBaseError);
              }

              gm(imageRawPath)
                .resize(null, config.size)
                .write(imagePath, (writeRawError) => {
                  if (writeRawError) {
                    reject(writeRawError);
                  }

                  const dimensions = sizeOf(imagePath);
                  const x = Math.round((config.size - dimensions.width) / 2);

                  gm(BASE_IMAGE_PATH)
                  // add the emoji image into the base transparent image centered
                    .draw(`image Over ${x},0 0,0 ${imagePath}`)
                    .write(imagePath, function (writeResultError) {
                      if (writeResultError) {
                        reject(writeResultError);
                      }

                      resolve();
                    });
                });
            });
        }).then(() => {
          emitter.emit(PARSER_PARSE_IMAGE_SUCCESS, emoji, themeName, imagePath);
        }).catch((error) => {
          logger.error('[GenerateImage]');
          logger.error(error.message);
          logger.error(error.stack);
          emitter.emit(PARSER_PARSE_IMAGE_ERROR, error, emoji, themeName);
        });
      });
    }
  };

  const tryProcessingImage = () => {
    imagesProcessing -= 1;

    if (imagesProcessing < MAX_IMAGES_TO_PROCESS_AT_TIME) {
      if (imagesToProcess.length) {
        const args = imagesToProcess.shift();
        generateImage.apply(null, args);
      }
    }
  };

  const queueImageProcessing = (emoji, themeName) => {
    if (imagesProcessing < MAX_IMAGES_TO_PROCESS_AT_TIME) {
      generateImage(emoji, themeName);
    } else {
      imagesToProcess.push([emoji, themeName]);
    }
  };

  // const generateSprites = (themes) => {
  //   logger.sameLine('🌈 Generating themes files: ♻️');
  //   map(
  //     themes,
  //     (theme, themeName) => {
  //       spritesToProcess.push([themeName, theme]);
  //     },
  //   );
  //
  //   tryProcessingSprite();
  // };
  /**
   *
   * @param {object} themes
   */
  const generateSprites = (themes) => {
    logger.sameLine('🌈 Generating themes files: ♻️');
    const apple = {
      apple: themes['apple'],
    };
    return Promise.all(
      map(
        themes,
        (theme, themeName) => generateSprite(themeName, theme),
      ),
    ).then(() => {
      logger.success('🌈 Generating themes files: ✅');
      emitter.emit(GENERATOR_GENERATE_THEMES_SUCCESS);
    });
  };

  // const tryProcessingSprite = () => {
  //   if (spritesToProcess.length) {
  //     const args = spritesToProcess.shift();
  //     logger.info(`[Generator] Building sprite for ${args[0]}`);
  //     generateSprite.apply(null, args);
  //   } else {
  //     logger.success('🌈 Generating themes files: ✅');
  //     emitter.emit(GENERATOR_GENERATE_THEMES_SUCCESS);
  //   }
  // };

  /**
   *
   * @param {string} themeName name of the theme
   * @param {object} theme hashmap [emojiName] => imageUrlForTheme
   */
  const generateSprite = (themeName, theme) => {
    return new Promise((resolve, reject) => {
      const emojisFilePath = map(theme, imageUrl => imageUrl);
      const themeSpritePath = `${config.destination}/${themeName}`;
      const themeSpriteDestination = `${themeSpritePath}/${themeName}.png`;
      fse.mkdirpSync(themeSpritePath);

      Spritesmith.run({src: emojisFilePath}, function handleResult (err, result) {
        const {
          properties,
          coordinates,
          image,
        } = result;

        try {
          fs.writeFileSync(themeSpriteDestination, image);
          resolve({ properties, coordinates });
        }catch(error) {
          reject(error);
        }
      });
      // spritesmith.createImages(emojisFilePath, function handleImages(err, images) {
      //   const result = spritesmith.processImages(images);
      //   const destination = fs.createWriteStream(themeSpriteDestination).on('finish', () => {
      //     console.log('coucou');
      //     resolve({ properties, coordinates });
      //   });
      //
      //   const {
      //     properties,
      //     coordinates,
      //     image,
      //   } = result;
      //   try {
      //     image
      //       .pipe(pngOptimizer)
      //       .pipe(destination);
      //   } catch (error) {
      //     reject(error);
      //   }
      // });
    }).then(({ properties, coordinates }) => {
      logger.success(`[Generator] ${themeName} Done`);
      emitter.emit(GENERATOR_GENERATE_SPRITE_SUCCESS, themeName, keys(theme), properties, coordinates);
    }).catch((error) => {
      logger.error(`[Generator] ${error}`);
      emitter.emit(GENERATOR_GENERATE_SPRITE_ERROR, error);
    });
  };

  /**
   *
   * @param {string} themeName
   * @param {array} emojisNames
   * @param {object} properties
   * @param {object} coordinates
   */
  const generateStyle = (themeName, emojisNames, properties, coordinates) => {
    return new Promise((resolve, reject) => {
      const styleFile = stylesGenerator(themeName, emojisNames, properties, coordinates);
      const filePath = `${config.destination}/${themeName}`;
      const fileName = `${themeName}.${EXTENTIONS[config.preproc]}`;
      const completePath = `${filePath}/${fileName}`;

      try {
        fse.mkdirpSync(filePath);
        fs.writeFileSync(completePath, styleFile, 'utf8');
        return resolve(completePath);
      } catch (error) {
        return reject(error);
      }
    }).then((path) => {
      emitter.emit(GENERATOR_GENERATE_STYLE_SUCCESS, themeName, emojisNames);
    }).catch((error) => {
      emitter.emit(ERROR, error);
    });
  };

  emitter.on(COLLECTOR_COLLECT_DONE, generateSprites);
  emitter.on(FETCHER_FETCH_IMAGE_SUCCESS, queueImageProcessing);
  emitter.on(PARSER_PARSE_IMAGE_SUCCESS, tryProcessingImage);
  emitter.on(PARSER_PARSE_IMAGE_ERROR, (error, emoji, themeName) => {
    emitter.emit(ERROR, error);
    imagesToProcess.push([emoji, themeName]);
  });
  emitter.on(GENERATOR_GENERATE_SPRITE_SUCCESS, (themeName, emojisNames, properties, coordinates) => {
    generateStyle(themeName, emojisNames, properties, coordinates);
    //tryProcessingSprite();
  });

  return {
    generateImage,
    generateSprite,
    generateStyle,
  };
};
