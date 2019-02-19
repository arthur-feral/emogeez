import jimp, { AUTO } from 'jimp';
import sizeOf from 'image-size';
import fse from 'fs-extra';
import fs from 'fs';
import {
  map,
  keys,
  size,
} from 'lodash';
import {
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
import logger from '../logger';
import StylesGenerator from './stylesGenerators';

// const PngQuant = require('pngquant');
// const pngOptimizer = new PngQuant([192, '--quality', '60-80', '--nofs', '-']);
const Spritesmith = require('spritesmith');

// const spritesmith = new Spritesmith();
const MAX_IMAGES_TO_PROCESS_AT_TIME = 5;
const MAX_SPRITES_TO_PROCESS_AT_TIME = 1;

const { TEMP_FILES_PATH } = process.env;
const IMAGES_PATH = `${TEMP_FILES_PATH}/images`;
const BASE_IMAGE_PATH = `${IMAGES_PATH}/base.png`;

export default (config, emitter) => {
  const stylesGenerator = StylesGenerator(config, emitter);
  const imagesToProcess = [];
  let imagesProcessing = 0;

  const spritesToProcess = [];
  let spritesProcessing = 0;

  let themesToGenerate = 0;

  /**
   *
   * @param {object} emoji
   * @param {string} themeName
   * @return {*}
   */
  const generateImage = (emoji, themeName) => {
    imagesProcessing += 1;
    const imageFolder = `${TEMP_FILES_PATH}/images/${themeName}/${emoji.category}`;
    const imagePath = `${imageFolder}/${emoji.name}.png`;
    const imageRawPath = `${imageFolder}/${emoji.name}_raw.png`;
    let alreadyProcessed = true;
    const sizeWithGoodResolution = config.size * 2;

    try {
      const dims = sizeOf(imagePath);

      // if we found the image but the dimensions are differents, then we process again
      if (parseInt(dims.width, 10) !== sizeWithGoodResolution) {
        alreadyProcessed = false;
      }
    } catch (error) {
      alreadyProcessed = false;
    }

    if (alreadyProcessed) {
      emitter.emit(PARSER_PARSE_IMAGE_SUCCESS, emoji, themeName, imagePath);
      return Promise.resolve(emoji, themeName, imagePath);
    }

    return new Promise((resolve, reject) => {
      jimp.read(imageRawPath)
        .then((image) => {
          image
          // first we need to autocrop to remove extra transparent pixels
            .autocrop()
            .resize(sizeWithGoodResolution, AUTO)
            .write(imagePath, (writeBaseError) => {
              if (writeBaseError) {
                reject(writeBaseError);
              }

              jimp.read(BASE_IMAGE_PATH)
                .then((baseImage) => {
                  const dimensions = sizeOf(imagePath);
                  const x = Math.round((sizeWithGoodResolution - dimensions.width) / 2);
                  const y = Math.round((sizeWithGoodResolution - dimensions.height) / 2);

                  resolve(
                    baseImage
                      .resize(sizeWithGoodResolution, sizeWithGoodResolution)
                      .composite(image, x, y)
                      .write(imagePath),
                  );
                });
            });
        })
        .then(() => {
          emitter.emit(PARSER_PARSE_IMAGE_SUCCESS, emoji, themeName, imagePath);
        })
        .catch((error) => {
          logger.error('[GenerateImage]');
          logger.error(error.message);
          logger.error(error.stack);
          emitter.emit(PARSER_PARSE_IMAGE_ERROR, error, emoji, themeName);
        });
    });
  };

  const tryProcessingImage = () => {
    imagesProcessing -= 1;

    if (imagesProcessing < MAX_IMAGES_TO_PROCESS_AT_TIME) {
      if (imagesToProcess.length) {
        const args = imagesToProcess.shift();
        generateImage.apply(null, args); // eslint-disable-line
      }
    }
  };


  const queueSpriteProcessing = (themeName, theme) => {
    if (spritesProcessing < MAX_SPRITES_TO_PROCESS_AT_TIME) {
      generateSprite(themeName, theme); // eslint-disable-line
    } else {
      spritesToProcess.push([themeName, theme]);
    }
  };

  const generateSprites = (themes) => {
    logger.sameLine('🌈 Generating themes files: ♻️');
    themesToGenerate = size(themes);

    map(
      themes,
      (theme, themeName) => {
        queueSpriteProcessing(themeName, theme);
      },
    );
  };

  const tryProcessingSprite = () => {
    spritesProcessing -= 1;

    if (spritesProcessing < MAX_SPRITES_TO_PROCESS_AT_TIME) {
      if (spritesToProcess.length) {
        const args = spritesToProcess.shift();
        generateSprite.apply(null, args); //eslint-disable-line
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


  /**
   *
   * @param {string} themeName name of the theme
   * @param {object} theme hashmap [emojiName] => imageUrlForTheme
   */
  const generateSprite = (themeName, theme) => {
    imagesProcessing += 1;

    return new Promise((resolve, reject) => {
      const emojisFilePath = map(theme, imageUrl => imageUrl);
      const themeSpritePath = `${config.destination}/${themeName}`;
      const themeSpriteDestination = `${themeSpritePath}/${themeName}.png`;
      fse.mkdirpSync(themeSpritePath);

      Spritesmith.run({ src: emojisFilePath }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const {
            properties,
            coordinates,
            image,
          } = result;

          try {
            fs.writeFileSync(themeSpriteDestination, image);
            resolve({
              properties,
              coordinates,
            });
          } catch (error) {
            reject(error);
          }
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
    })
      .catch((error) => {
        logger.error(`[Generator] ${error}`);
        emitter.emit(GENERATOR_GENERATE_SPRITE_ERROR, error, themeName, theme);
      });
  };

  /**
   *
   * @param {string} themeName
   * @param {array} emojisNames
   * @param {object} properties
   * @param {object} coordinates
   */
  const generateStyle = (themeName, emojisNames, properties, coordinates) => new Promise((resolve, reject) => {
    const styleFiles = stylesGenerator(themeName, emojisNames, properties, coordinates);
    const filePath = `${config.destination}/${themeName}`;
    const fileNameCss = `${themeName}.${EXTENTIONS.css}`;
    const completePathCss = `${filePath}/${fileNameCss}`;
    const fileNamePreproc = `${themeName}.${EXTENTIONS[config.preproc]}`;
    const completePathPreproc = `${filePath}/${fileNamePreproc}`;

    try {
      fse.mkdirpSync(filePath);
      fs.writeFileSync(completePathCss, styleFiles.css, 'utf8');
      fs.writeFileSync(completePathPreproc, styleFiles[config.preproc], 'utf8');
      return resolve(completePathPreproc);
    } catch (error) {
      return reject(error);
    }
  }).then(() => {
    emitter.emit(GENERATOR_GENERATE_STYLE_SUCCESS, themeName, emojisNames);
  })
    .catch((error) => {
      emitter.emit(ERROR, error);
    });

  emitter.on(COLLECTOR_COLLECT_DONE, generateSprites);
  emitter.on(FETCHER_FETCH_IMAGE_SUCCESS, queueImageProcessing);
  emitter.on(PARSER_PARSE_IMAGE_SUCCESS, tryProcessingImage);
  emitter.emit(GENERATOR_GENERATE_SPRITE_ERROR, (error, themeName, theme) => {
    queueSpriteProcessing(themeName, theme);
  });
  emitter.on(PARSER_PARSE_IMAGE_ERROR, (error, emoji, themeName) => {
    imagesToProcess.push([emoji, themeName]);
  });
  emitter.on(GENERATOR_GENERATE_SPRITE_SUCCESS, (themeName, emojisNames, properties, coordinates) => {
    generateStyle(themeName, emojisNames, properties, coordinates);
    tryProcessingSprite();
    themesToGenerate -= 1;
    if (themesToGenerate === 0) {
      logger.success('🌈 Generating themes files: ✅');
      emitter.emit(GENERATOR_GENERATE_THEMES_SUCCESS);
    }
  });

  return {
    generateImage,
    generateSprite,
    generateStyle,
  };
};
