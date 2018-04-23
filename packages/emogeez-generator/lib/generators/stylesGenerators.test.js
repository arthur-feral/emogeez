require('../../tests/bootstrap');

import {
  map,
} from 'lodash';
import {
  expect,
} from 'chai';
import fs from 'fs-extra';
import EventEmitter from 'eventemitter3';
import StylesGenerator from './stylesGenerators';

const emitter = new EventEmitter();
const stylesGenerator = StylesGenerator({
  destination: 'emojis',
  themesUrl: 'emojis',
  size: 48,
  cache: false,
  prefix: 'emojis',
  preproc: 'sass',
}, emitter);
const coordinatesJSON = require(`${process.cwd()}/tests/jsons/coordinates.json`);
const emojisFullPeopleJSON = require(`${process.cwd()}/tests/jsons/emojisFullForCategory.json`);
const emojisNames = map(emojisFullPeopleJSON.people.emojis, e => e.name);
const sassResult = fs.readFileSync(`tests/styles/apple_.scss`, 'utf8');
const cssResult = fs.readFileSync(`tests/styles/apple_.css`, 'utf8');

describe('StylesGenerator', () => {
  describe('generateStyle', () => {
    it('generate the stylesheet file', async () => {
      const result = await stylesGenerator('apple', emojisNames, {
        width: 144,
        height: 144,
      }, coordinatesJSON);

      expect(result).to.deep.equal({
        css: cssResult,
        sass: sassResult,
      });
    });
  });
});
