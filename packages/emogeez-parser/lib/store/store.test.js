require('../../tests/bootstrap');

import {
  expect,
} from 'chai';
import {
  size,
} from 'lodash';
import Configurator from '../config/config';

const emojisData = require('../../tests/json/emojis.json');

const config1 = {
  blackList: [],
};
const configurator1 = Configurator(config1);

const config2 = {
  blackList: [
    'grinning-face',
    'kiss',
    'reversed-hand-with-middle-finger-extended',
  ],
};
const configurator2 = Configurator(config2, emojisData);

describe('Configurator', () => {
  describe('no blackList', () => {
    it('map data', () => {
      expect(size(configurator1.emojis)).to.equal(2022);
      expect(configurator1.codePoints.length).to.equal(2022);
      expect(size(configurator1.codePointEmoji)).to.equal(2022);
    });
  });

  describe('with blackList', () => {
    it('map data', () => {
      expect(size(configurator2.emojis)).to.equal(2009);
      expect(configurator2.codePoints.length).to.equal(2009);
      expect(size(configurator2.codePointEmoji)).to.equal(2009);
    });
  });
});