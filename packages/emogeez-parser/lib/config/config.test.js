import {
  expect,
} from 'chai';
import Config from './config';

require('../../tests/bootstrap');

const config1 = Config({
  blackList: [],
});

const config2 = Config({
  blackList: [
    'grinning-face',
    'kiss',
    'reversed-hand-with-middle-finger-extended',
  ],
});

describe('Config', () => {
  it('get a default config', () => {
    expect(Config(config1)).to.deep.equal({
      blackList: [],
      theme: 'apple',
      themesUrl: 'https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@0.21.1/packages/emogeez-generator/emojis',
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
        themesUrl: 'https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@0.21.1/packages/emogeez-generator/emojis',
      });

      expect(Config({
        blackList: [
          'grinning-face',
          'reversed-hand-with-middle-finger-extended',
        ],
        theme: 'themeName',
        themesUrl: 'urlToCustomThemes',
      })).to.deep.equal({
        blackList: [
          'grinning-face',
          'reversed-hand-with-middle-finger-extended',
        ],
        theme: 'themeName',
        themesUrl: 'urlToCustomThemes',
      });
    });
  });
});
