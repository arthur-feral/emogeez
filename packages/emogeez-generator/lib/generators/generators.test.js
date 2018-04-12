require('../../tests/bootstrap');
import {
  reduce,
  map,
} from 'lodash';
import path from 'path';
import fs from 'fs-extra';
import fse from 'fs-extra';
import EventEmitter from 'eventemitter3';
import sinon from 'sinon';
import {
  expect,
} from 'chai';
import GeneratorFactory from './generators';

const baseConfig = {
  destination: 'tests/tmp/emojis',
  size: 48,
  fromCache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

const emitter = new EventEmitter();
let generator = GeneratorFactory(baseConfig, emitter);

const parseImageSuccessSpy = sinon.spy();
const generateSpriteSuccessSpy = sinon.spy();
const generateStyleSuccessSpy = sinon.spy();

emitter.on('PARSER_PARSE_IMAGE_SUCCESS', parseImageSuccessSpy);
emitter.on('GENERATOR_GENERATE_SPRITE_SUCCESS', generateSpriteSuccessSpy);
emitter.on('GENERATOR_GENERATE_STYLE_SUCCESS', generateStyleSuccessSpy);

const tempPath = `${process.cwd()}/${process.env.TEMP_FILES_PATH}`;
console.log(tempPath);
const imagesPath = `${process.cwd()}/tests/images`;
const tmpImagesPath = `${tempPath}/images`;

const coordinatesJSON = require(`${process.cwd()}/tests/jsons/coordinates.json`);
const emojiJSON = require(`${process.cwd()}/tests/jsons/grinning-face.json`);
const emojisFullPeopleJSON = require(`${process.cwd()}/tests/jsons/emojisFullForCategory.json`);
const themeMap = reduce(emojisFullPeopleJSON.people.emojis, (result, emoji) => ({
  ...result,
  [emoji.name]: `${tmpImagesPath}/apple/${emoji.category}/${emoji.name}.png`,
}), {});
const emojisNames = map(emojisFullPeopleJSON.people.emojis, e => e.name);

let imageDone;


describe('Generator', () => {
  beforeEach(() => {
    parseImageSuccessSpy.reset();
    generateSpriteSuccessSpy.reset();
    generateStyleSuccessSpy.reset();
  });
  before(() => {
    fs.copySync(
      imagesPath,
      tmpImagesPath,
    );
    try {
      fs.unlinkSync(`${process.cwd()}/tmp/emojis`);
    } catch (error) {

    }
  });

  after(() => {
    try {
      fse.removeSync(tmpImagesPath);
    } catch (error) {

    }
  });

  describe('generateImage', () => {
    before(() => {
      try {
        fs.unlinkSync(`${tmpImagesPath}/apple/people/grinning-face.png`);
      } catch (e) {

      }
    });

    it('generate the computed image from raw image', async () => {
      expect(parseImageSuccessSpy.callCount).to.equal(0);
      const result = await generator.generateImage(emojiJSON, 'apple');
      expect(parseImageSuccessSpy.callCount).to.equal(1);
      expect(() => {
        imageDone = fs.readFileSync(`${tmpImagesPath}/apple/people/grinning-face.png`);
      }).to.not.throw();
    });
  });

  describe('generateSprite', () => {
    before(() => {
      try {
        fs.unlinkSync(`${baseConfig.destination}/apple/apple.png`);
      } catch (e) {

      }
    });

    it('generate the computed image from raw image', async () => {
      expect(generateSpriteSuccessSpy.callCount).to.equal(0);
      const result = await generator.generateSprite('apple', themeMap);
      expect(generateSpriteSuccessSpy.callCount).to.equal(1);
      expect(() => {
        const sprite = fs.readFileSync(`${baseConfig.destination}/apple/apple.png`);
      }).to.not.throw();
      expect(generateSpriteSuccessSpy.args[0][0]).to.equal('apple');
      expect(generateSpriteSuccessSpy.args[0][1]).to.deep.equal(emojisNames);
      expect(generateSpriteSuccessSpy.args[0][2]).to.deep.equal({
        width: 144,
        height: 144,
      });
      expect(generateSpriteSuccessSpy.args[0][3]).to.deep.equal(coordinatesJSON);
    });
  });

  describe('generateStyle', () => {
    before(() => {
      try {
        fs.unlinkSync(`${baseConfig.destination}/apple/apple.scss`);
      } catch (e) {

      }
    });
    after(() => {
      try {
        fs.unlinkSync(`${baseConfig.destination}/apple/apple.scss`);
      } catch (e) {

      }
    });
    it('generate the stylesheet file', async () => {
      expect(generateStyleSuccessSpy.callCount).to.equal(0);
      const result = await generator.generateStyle('apple', emojisNames, {
          width: 144,
          height: 144,
        }, coordinatesJSON,
      );
      expect(generateStyleSuccessSpy.callCount).to.equal(1);
      expect(() => {
        const sprite = fs.readFileSync(`${baseConfig.destination}/apple/apple.scss`, 'utf8');
      }).to.not.throw();
      expect(generateStyleSuccessSpy.args[0][0]).to.deep.equal('apple');
      expect(generateStyleSuccessSpy.args[0][1]).to.deep.equal(emojisNames);
    });
  });
});