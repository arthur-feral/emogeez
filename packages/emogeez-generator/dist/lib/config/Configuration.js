'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var Configuration = function Configuration(_ref) {
  var destination = _ref.destination,
      size = _ref.size,
      cache = _ref.cache,
      prefix = _ref.prefix,
      preproc = _ref.preproc;

  _classCallCheck(this, Configuration);

  (0, _lodash.assign)(this, {
    destination: destination,
    size: parseInt(size, 10),
    cache: cache,
    prefix: prefix,
    preproc: preproc
  });
};

exports.default = Configuration;