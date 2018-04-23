import fs from 'fs-extra';
import os from 'os';
import {
  map,
} from 'lodash';

/**
 *
 * @param config
 * @return {function(*, *=, *, *, *)}
 */
export default (config) => {
  const baseTemplateCss = fs.readFileSync(`${process.cwd()}/res/css/base`, 'utf8');
  const emojiTemplateCss = fs.readFileSync(`${process.cwd()}/res/css/emoji`, 'utf8');
  const baseTemplate = fs.readFileSync(`${process.cwd()}/res/${config.preproc}/base`, 'utf8');
  const emojiTemplate = fs.readFileSync(`${process.cwd()}/res/${config.preproc}/emoji`, 'utf8');

  /**
   * returns a string containing base sass file for emojis
   * @param {string} template the template used for the style file
   * @param {string} prefix the classname prefix
   * @param {string} spritePath path to the sprite
   * @param {number} spriteWidth count of emojis present in the sprite
   * @param {number} spriteHeight size of an emoji
   * @param {number} emojiSize size of an emoji
   * @returns {string}
   */
  const generateBase = (template, prefix, spritePath, spriteWidth, spriteHeight, emojiSize) => {
    return [
      '', template
        .replace(/<%prefix%>/gm, prefix)
        .replace('<%pathToSprite%>', spritePath)
        .replace('<%spriteWidth%>', spriteWidth)
        .replace('<%spriteHeight%>', spriteHeight)
        .replace(/<%emojiSize%>/gm, emojiSize),
    ].join('');
  };

  /**
   * returns special sass rule for an emoji
   * @param {string} template the classname prefix
   * @param {string} prefix the classname prefix
   * @param {string} name emoji name
   * @param {number} positionX emoji position
   * @param {number} positionY emoji position
   * @returns {string}
   */
  const generateEmoji = (template, prefix, name, positionX, positionY) => {
    return [
      '', template
        .replace(/<%prefix%>/gm, prefix)
        .replace('<%emojiName%>', name)
        .replace('<%emojiXPosition%>', positionX)
        .replace('<%emojiYPosition%>', positionY),
    ].join('');
  };

  /**
   * generate a sass file from datas
   * @param {string} themeName
   * @param {array} emojisNames
   * @param {object} properties
   * @param {object} coordinates
   * @returns {*|Promise}
   */
  return (themeName, emojisNames, properties, coordinates) => {
    const spritePath = `${config.themesUrl}/${themeName}/${themeName}.png`;
    const coordinatesArray = map(coordinates, c => c);
    let preprocContent = generateBase(baseTemplate, config.prefix, spritePath, properties.width, properties.height, config.size) + os.EOL;
    let cssContent = generateBase(baseTemplateCss, config.prefix, spritePath, properties.width, properties.height, config.size) + os.EOL;

    emojisNames.map((emojiName, index) => {
      preprocContent += generateEmoji(emojiTemplate, config.prefix, emojiName, coordinatesArray[index].x, coordinatesArray[index].y);
      cssContent += generateEmoji(emojiTemplateCss, config.prefix, emojiName, coordinatesArray[index].x, coordinatesArray[index].y);
    });

    return {
      css: cssContent,
      [config.preproc]: preprocContent,
    };
  };
};