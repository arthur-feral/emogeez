'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveFile = exports.getUnicode = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * format char unicode to something like this
 * "D83D-DC69-200D-2764-FE0F-200D-D83D-DC69"
 * @param char
 * @returns {string}
 */
var getUnicode = exports.getUnicode = function getUnicode(char) {
  var i = 0,
      c = 0,
      p = 0,
      r = [];
  while (i < char.length) {
    c = char.charCodeAt(i++);
    if (p) {
      r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join('-');
};

/**
 * save a file on a specified path
 * @param content
 * @param path
 * @param name
 */
var saveFile = exports.saveFile = function saveFile(content, path, name) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    _fsExtra2.default.accessSync(path, _fsExtra2.default.F_OK);
  } catch (error) {
    _fsExtra2.default.mkdirpSync(path);
  }

  _fsExtra2.default.writeFileSync(path + '/' + name, content);
};