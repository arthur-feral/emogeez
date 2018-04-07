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

const emojisData = require('../../tests/json/apple.json');
const config = Config();
const http = Http(config);
const store = Store(config, http);
store.setTheme('apple', emojisData);
import Matcher from './matcher';

const {
  getNames,
  hasEmojis,
} = Matcher(store);

const grinning = store.getEmojis('apple')['grinning-face'].symbol;
const grin = store.getEmojis('apple')['grinning-face-with-smiling-eyes'].symbol;
const $thumbsup = find(store.getEmojis('apple'), e => e.name === 'thumbs-up-sign');
const thumbsup = $thumbsup.symbol;
const thumbsupWhite = $thumbsup.modifiers['thumbs-up-sign-type-1-2'].symbol;
const kiss = find(store.getEmojis('apple'), e => e.name === 'kiss').symbol;
const womanWithBunnyEars = find(store.getEmojis('apple'), e => e.name === 'woman-with-bunny-ears').symbol;
const family = find(store.getEmojis('apple'), e => e.name === 'family-man-woman-girl-boy').symbol;

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
      expect(getNames('apple', emojisText5)).to.deep.equal(['kiss']);
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