require('../../tests/bootstrap');

import {
  expect,
  assert,
} from 'chai';
import Config from './config';

const config1 = Config({
  blackList: [],
}, '0.1.0');

const config2 = Config({
  blackList: [
    'grinning-face',
    'kiss',
    'reversed-hand-with-middle-finger-extended',
  ],
}, '0.1.0');

describe('Config', () => {
  it('get a default config', () => {
    expect(Config(config1)).to.deep.equal({
      blackList: [],
      theme: 'apple',
      themesUrl: `https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@0.1.0/packages/emogeez-generator/emojis`,
    });
  });

  describe('custom config', () => {
    it('returns custom config', () => {
      expect(Config(config2)).to.deep.equal({
        blackList: [
          'grinning-face',
          'kiss',
          'reversed-hand-with-middle-finger-extended',
        ],
        theme: 'apple',
        themesUrl: `https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@0.1.0/packages/emogeez-generator/emojis`,
      });

      expect(Config({
        blackList: [
          'grinning-face',
          'reversed-hand-with-middle-finger-extended',
        ],
        theme: 'themeName',
        themesUrl: `urlToCustomThemes`,
      })).to.deep.equal({
        blackList: [
          'grinning-face',
          'reversed-hand-with-middle-finger-extended',
        ],
        theme: 'themeName',
        themesUrl: `urlToCustomThemes`,
      });
    });
  });
});