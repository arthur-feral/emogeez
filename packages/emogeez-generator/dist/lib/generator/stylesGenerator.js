'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param config
 * @return {function(*, *=, *, *, *)}
 */
exports.default = function (config) {
  var baseTemplate = _fsExtra2.default.readFileSync(process.cwd() + '/res/' + config.preproc + '/base', 'utf8');
  var emojiTemplate = _fsExtra2.default.readFileSync(process.cwd() + '/res/' + config.preproc + '/emoji', 'utf8');

  /**
   * returns a string containing base sass file for emojis
   * @param {string} prefix the classname prefix
   * @param {string} spritePath path to the sprite
   * @param {number} spriteWidth count of emojis present in the sprite
   * @param {number} spriteHeight size of an emoji
   * @param {number} emojiSize size of an emoji
   * @returns {string}
   */
  var generateBase = function generateBase(prefix, spritePath, spriteWidth, spriteHeight, emojiSize) {
    return ['', baseTemplate.replace(/<%prefix%>/gm, prefix).replace('<%pathToSprite%>', spritePath).replace('<%spriteWidth%>', spriteWidth).replace('<%spriteHeight%>', spriteHeight).replace('<%emojiSize%>', emojiSize)].join('');
  };

  /**
   * returns special sass rule for an emoji
   * @param {string} prefix the classname prefix
   * @param {string} name emoji name
   * @param {number} positionX emoji position
   * @param {number} positionY emoji position
   * @returns {string}
   */
  var generateEmoji = function generateEmoji(prefix, name, positionX, positionY) {
    return ['', emojiTemplate.replace(/<%prefix%>/gm, prefix).replace('<%emojiName%>', name).replace('<%emojiXPosition%>', positionX).replace('<%emojiYPosition%>', positionY)].join('');
  };

  /**
   * generate a sass file from datas
   * @param {string} themeName
   * @param {array} emojisNames
   * @param {object} properties
   * @param {object} coordinates
   * @returns {*|Promise}
   */
  return function (themeName, emojisNames, properties, coordinates) {
    var spritePath = config.destination + '/' + themeName + '/' + themeName + '.png';
    var coordinatesArray = (0, _lodash.map)(coordinates, function (c) {
      return c;
    });
    var sassContent = generateBase(config.prefix, spritePath, properties.width, properties.height, config.size) + _os2.default.EOL;

    emojisNames.map(function (emojiName, index) {
      sassContent += generateEmoji(config.prefix, emojiName, coordinatesArray[index].x, coordinatesArray[index].y);
    });

    return sassContent;
  };
};