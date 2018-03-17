'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = undefined;

var _lodash = require('lodash');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _constants = require('../constants');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef Config
 * @property {String} destination
 * @property {String|Integer} size
 * @property {Boolean} cache
 * @property {String} prefix
 * @property {String} preproc
 */
/**
 * @param {String} destination
 * @param {String|Integer} size
 * @param {Boolean} cache
 * @param {String} prefix
 * @param {String} preproc
 * @constructor
 */
var Config = exports.Config = function Config(_ref) {
  var destination = _ref.destination,
      size = _ref.size,
      cache = _ref.cache,
      prefix = _ref.prefix,
      preproc = _ref.preproc;
  return {
    destination: destination,
    size: parseInt(size, 10),
    cache: cache,
    prefix: prefix,
    preproc: preproc
  };
};

/**
 * default config
 * @name DEFAULT_CONFIG_PARAMS
 * @type {Object}
 */
var DEFAULT_CONFIG_PARAMS = {
  destination: 'emojis',
  size: 48,
  cache: false,
  prefix: 'emojis',
  preproc: 'sass'
};

var AVAILABLE_PREPROCESSORS = ['sass', 'less'];
var TEMP_FILES_PATH = process.env.TEMP_FILES_PATH;
var IMAGES_PATH = TEMP_FILES_PATH + '/images';
var BASE_IMAGE_PATH = IMAGES_PATH + '/base.png';

/**
 * parse cli args and build config to provide to the module
 * @name configure
 * @param {Object} commander
 * @param {Object} emitter
 */

exports.default = function (commander, emitter) {
  _logger2.default.sameLine('⚙️ Configuring app: ♻️');
  var config = {};

  if (commander.preproc && !(0, _lodash.includes)(AVAILABLE_PREPROCESSORS, commander.preproc)) {
    throw new Error('⚙️ You must provide a correct preprocessor parameter');
  }

  (0, _lodash.each)(DEFAULT_CONFIG_PARAMS, function (defaultValue, parameter) {
    config[parameter] = commander[parameter] ? commander[parameter] : defaultValue;
    _logger2.default.info(parameter + ': ' + config[parameter]);
  });
  _logger2.default.success('⚙️ Configuring app: ✅');

  _logger2.default.info('💾 Preparing files space: ♻️');
  _fsExtra2.default.mkdirpSync(config.destination + '/');
  _fsExtra2.default.mkdirpSync(TEMP_FILES_PATH + '/images/');
  _fsExtra2.default.mkdirpSync(TEMP_FILES_PATH + '/html/');
  _fsExtra2.default.mkdirpSync(TEMP_FILES_PATH + '/jsons/');
  _fsExtra2.default.mkdirpSync(TEMP_FILES_PATH + '/styles/');
  _jimp2.default.read(process.cwd() + '/res/base.png').then(function (image) {
    image.resize(parseInt(config.size, 10), parseInt(config.size, 10)).write(BASE_IMAGE_PATH, function (imageError) {
      if (imageError) {
        emitter.emit(_constants.ERROR, imageError);
      }
      _logger2.default.success('💾 Preparing files space: ✅️');
      emitter.emit(_constants.APP_READY);
    });
  }).catch(function (readError) {
    emitter.emit(_constants.ERROR, readError);
  });

  return new Config(config);
};