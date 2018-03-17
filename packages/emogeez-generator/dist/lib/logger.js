'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loggersTypes = {
  info: 'yellow',
  warn: 'magenta',
  success: 'green',
  error: 'red'
};
var loggers = {};

(0, _lodash.each)(loggersTypes, function (color, type) {
  loggers[type] = process.env.NODE_ENV === 'test' ? _lodash.noop : function (message) {
    process.stdout.write(_chalk2.default[color](message) + '\n');
  };
});

loggers.count = function (message) {
  process.stdout.write(_chalk2.default.yellow(message) + '\r');
};

loggers.sameLine = function (message) {

  /*
  Got some
  Maximum call stack size exceeded
  RangeError: Maximum call stack size exceeded
  sometimes
   */
  try {
    process.stdout.write(_chalk2.default.yellow(message) + '\r');
  } catch (error) {}
};
/**
 * module for stdout logs
 * it exposes info, warn, error and success methods to log with special color
 * it exposes count method to log some progressing infos
 * @type {{}}
 */
exports.default = loggers;