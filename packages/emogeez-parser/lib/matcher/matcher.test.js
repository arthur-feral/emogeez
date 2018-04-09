require('../../tests/bootstrap');

import {
  expect,
  assert,
} from 'chai';
import {
  find,
} from 'lodash';
import Config from '../config/config';
import Store from '../store/store';
import Http from '../http/http';
import Matcher from './matcher';

const emojisData = require('../../tests/json/apple.json');
const config = Config();
const http = Http(config);
const store = Store(config, http);
store.setTheme('apple', emojisData);

const {
  getNames,
  hasEmojis,
} = Matcher(store);

const grinning = store.toUTF8('apple', 'grinning-face');
const grin = store.toUTF8('apple', 'grinning-face-with-smiling-eyes');
const thumbsup = store.toUTF8('apple', 'thumbs-up-sign');
const thumbsupWhite = store.toUTF8('apple', 'thumbs-up-sign-type-1-2');
const kiss = store.toUTF8('apple', 'kiss-mark');
const womanWithBunnyEars = store.toUTF8('apple', 'woman-with-bunny-ears');
const family = store.toUTF8('apple', 'family-man-woman-girl-boy');

const simpleText1 = '';
const simpleText2 = 'hello!';
const simpleText3 = 'hello!\n';
const simpleText4 = `hello!
`;
const simpleText5 = 'hello!¶';

const emojisText1 = `${grinning}`;
const emojisText2 = `${grinning}${grin}`;
const emojisText3 = `${thumbsup}`;
const emojisText4 = `${thumbsupWhite}`;
const emojisText5 = `${kiss}`;
const emojisText6 = `hello! ${womanWithBunnyEars}`;
const emojisText7 = `${family}`;

describe('Matcher', () => {
  describe('getNames', () => {
    it('return emojis names from the text', () => {
      expect(getNames('apple', emojisText1)).to.deep.equal(['grinning-face']);
      expect(getNames('apple', emojisText2)).to.deep.equal([
        'grinning-face',
        'grinning-face-with-smiling-eyes',
      ]);
      expect(getNames('apple', emojisText3)).to.deep.equal(['thumbs-up-sign']);
      expect(getNames('apple', emojisText4)).to.deep.equal(['thumbs-up-sign-type-1-2']);
      expect(getNames('apple', emojisText5)).to.deep.equal(['kiss-mark']);
      expect(getNames('apple', emojisText6)).to.deep.equal(['woman-with-bunny-ears']);
      expect(getNames('apple', emojisText7)).to.deep.equal(['family-man-woman-girl-boy']);
    });
  });

  describe('hasEmojis', () => {
    it('return false for a text without emojis', () => {
      assert.isFalse(hasEmojis('apple', simpleText1));
      assert.isFalse(hasEmojis('apple', simpleText2));
      assert.isFalse(hasEmojis('apple', simpleText3));
      assert.isFalse(hasEmojis('apple', simpleText4));
      assert.isFalse(hasEmojis('apple', simpleText5));
    });

    it('return true for a text with emojis', () => {
      assert.isTrue(hasEmojis('apple', emojisText1));
      assert.isTrue(hasEmojis('apple', emojisText2));
      assert.isTrue(hasEmojis('apple', emojisText3));
      assert.isTrue(hasEmojis('apple', emojisText4));
      assert.isTrue(hasEmojis('apple', emojisText5));
      assert.isTrue(hasEmojis('apple', emojisText6));
      assert.isTrue(hasEmojis('apple', emojisText7));
    });
  });
});