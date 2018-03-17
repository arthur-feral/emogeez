'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _constants = require('../constants');

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _imageSize = require('image-size');

var _imageSize2 = _interopRequireDefault(_imageSize);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _stylesGenerator = require('./stylesGenerator');

var _stylesGenerator2 = _interopRequireDefault(_stylesGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PngQuant = require('pngquant');
var pngOptimizer = new PngQuant([192, '--quality', '60-80', '--nofs', '-']);
var Spritesmith = require('spritesmith');
var spritesmith = new Spritesmith();
var MAX_IMAGES_TO_PROCESS_AT_TIME = 1;

var TEMP_FILES_PATH = process.env.TEMP_FILES_PATH;
var IMAGES_PATH = TEMP_FILES_PATH + '/images';
var BASE_IMAGE_PATH = IMAGES_PATH + '/base.png';

exports.default = function (config, emitter) {
  var stylesGenerator = (0, _stylesGenerator2.default)(config, emitter);
  var imagesToProcess = [];
  //let spritesToProcess = [];
  var imagesProcessing = 0;

  /**
   *
   * @param {object} emoji
   * @param {string} themeName
   * @return {*}
   */
  var generateImage = function generateImage(emoji, themeName) {
    imagesProcessing += 1;
    var imageFolder = TEMP_FILES_PATH + '/images/' + themeName + '/' + emoji.category;
    var imagePath = imageFolder + '/' + emoji.name + '.png';
    var imageRawPath = imageFolder + '/' + emoji.name + '_raw.png';
    var alreadyProcessed = true;

    try {
      var dims = (0, _imageSize2.default)(imagePath);

      // if we found the image but the dimensions are differents, then we process again
      if (parseInt(dims.width, 10) !== parseInt(config.size, 10)) {
        alreadyProcessed = false;
      }
    } catch (error) {
      alreadyProcessed = false;
    }

    if (alreadyProcessed) {
      emitter.emit(_constants.PARSER_PARSE_IMAGE_SUCCESS, emoji, themeName, imagePath);
      return Promise.resolve(emoji, themeName, imagePath);
    } else {
      return new Promise(function (resolve, reject) {
        _jimp2.default.read(imageRawPath).then(function (image) {
          image.autocrop().write(imagePath, function (writeBaseError) {
            if (writeBaseError) {
              reject(writeBaseError);
            }

            (0, _gm2.default)(imageRawPath).resize(null, config.size).write(imagePath, function (writeRawError) {
              if (writeRawError) {
                reject(writeRawError);
              }

              var dimensions = (0, _imageSize2.default)(imagePath);
              var x = Math.round((config.size - dimensions.width) / 2);

              (0, _gm2.default)(BASE_IMAGE_PATH)
              // add the emoji image into the base transparent image centered
              .draw('image Over ' + x + ',0 0,0 ' + imagePath).write(imagePath, function (writeResultError) {
                if (writeResultError) {
                  reject(writeResultError);
                }

                resolve();
              });
            });
          });
        }).then(function () {
          emitter.emit(_constants.PARSER_PARSE_IMAGE_SUCCESS, emoji, themeName, imagePath);
        }).catch(function (error) {
          _logger2.default.error('[GenerateImage]');
          _logger2.default.error(error.message);
          _logger2.default.error(error.stack);
          emitter.emit(_constants.PARSER_PARSE_IMAGE_ERROR, error, emoji, themeName);
        });
      });
    }
  };

  var tryProcessingImage = function tryProcessingImage() {
    imagesProcessing -= 1;

    if (imagesProcessing < MAX_IMAGES_TO_PROCESS_AT_TIME) {
      if (imagesToProcess.length) {
        var args = imagesToProcess.shift();
        generateImage.apply(null, args);
      }
    }
  };

  var queueImageProcessing = function queueImageProcessing(emoji, themeName) {
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
  var generateSprites = function generateSprites(themes) {
    _logger2.default.sameLine('🌈 Generating themes files: ♻️');
    var apple = {
      apple: themes['apple']
    };
    return Promise.all((0, _lodash.map)(themes, function (theme, themeName) {
      return generateSprite(themeName, theme);
    })).then(function () {
      _logger2.default.success('🌈 Generating themes files: ✅');
      emitter.emit(_constants.GENERATOR_GENERATE_THEMES_SUCCESS);
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
  var generateSprite = function generateSprite(themeName, theme) {
    return new Promise(function (resolve, reject) {
      var emojisFilePath = (0, _lodash.map)(theme, function (imageUrl) {
        return imageUrl;
      });
      var themeSpritePath = config.destination + '/' + themeName;
      var themeSpriteDestination = themeSpritePath + '/' + themeName + '.png';
      _fsExtra2.default.mkdirpSync(themeSpritePath);

      Spritesmith.run({ src: emojisFilePath }, function handleResult(err, result) {
        var properties = result.properties,
            coordinates = result.coordinates,
            image = result.image;


        try {
          _fs2.default.writeFileSync(themeSpriteDestination, image);
          resolve({ properties: properties, coordinates: coordinates });
        } catch (error) {
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
    }).then(function (_ref) {
      var properties = _ref.properties,
          coordinates = _ref.coordinates;

      _logger2.default.success('[Generator] ' + themeName + ' Done');
      emitter.emit(_constants.GENERATOR_GENERATE_SPRITE_SUCCESS, themeName, (0, _lodash.keys)(theme), properties, coordinates);
    }).catch(function (error) {
      _logger2.default.error('[Generator] ' + error);
      emitter.emit(_constants.GENERATOR_SPRITE_ERROR, error);
    });
  };

  /**
   *
   * @param {string} themeName
   * @param {array} emojisNames
   * @param {object} properties
   * @param {object} coordinates
   */
  var generateStyle = function generateStyle(themeName, emojisNames, properties, coordinates) {
    return new Promise(function (resolve, reject) {
      var styleFile = stylesGenerator(themeName, emojisNames, properties, coordinates);
      var filePath = config.destination + '/' + themeName;
      var fileName = themeName + '.' + _constants.EXTENTIONS[config.preproc];
      var completePath = filePath + '/' + fileName;

      try {
        _fsExtra2.default.mkdirpSync(filePath);
        _fs2.default.writeFileSync(completePath, styleFile, 'utf8');
        return resolve(completePath);
      } catch (error) {
        return reject(error);
      }
    }).then(function (path) {
      emitter.emit(_constants.GENERATOR_GENERATE_STYLE_SUCCESS, themeName, emojisNames);
    }).catch(function (error) {
      emitter.emit(_constants.ERROR, error);
    });
  };

  emitter.on(_constants.COLLECTOR_COLLECT_DONE, generateSprites);
  emitter.on(_constants.FETCHER_FETCH_IMAGE_SUCCESS, queueImageProcessing);
  emitter.on(_constants.PARSER_PARSE_IMAGE_SUCCESS, tryProcessingImage);
  emitter.on(_constants.PARSER_PARSE_IMAGE_ERROR, function (error, emoji, themeName) {
    emitter.emit(_constants.ERROR, error);
    imagesToProcess.push([emoji, themeName]);
  });
  emitter.on(_constants.GENERATOR_GENERATE_SPRITE_SUCCESS, function (themeName, emojisNames, properties, coordinates) {
    generateStyle(themeName, emojisNames, properties, coordinates);
    //tryProcessingSprite();
  });

  return {
    generateImage: generateImage,
    generateSprite: generateSprite,
    generateStyle: generateStyle
  };
};