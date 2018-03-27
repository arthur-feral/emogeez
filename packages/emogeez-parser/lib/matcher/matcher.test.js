require('../../tests/bootstrap');

import {
  expect,
  assert,
} from 'chai';
import {
  find,
} from 'lodash';
import Matcher from './matcher';
import Configurator from '../config/config';

const config = {
  blackList: [],
};
const emojis = require('../../tests/json/emojis.json');
const configurator = Configurator(config, emojis);
const {
  getNames,
  hasEmojis,
} = Matcher(configurator);

const grinning = emojis.people.emojis['grinning-face'].symbol;
const grin = emojis.people.emojis['grinning-face-with-smiling-eyes'].symbol;
const $thumbsup = find(emojis.people.emojis, e => e.name === 'thumbs-up-sign');
const thumbsup = $thumbsup.symbol;
const thumbsupWhite = $thumbsup.modifiers['thumbs-up-sign-type-1-2'].symbol;
const kiss = find(emojis.people.emojis, e => e.name === 'kiss').symbol;
const womanWithBunnyEars = find(emojis.people.emojis, e => e.name === 'woman-with-bunny-ears').symbol;
const family = find(emojis.people.emojis, e => e.name === 'family-man-woman-girl-boy').symbol;

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
      expect(getNames(emojisText1)).to.deep.equal(['grinning-face']);
      expect(getNames(emojisText2)).to.deep.equal([
        'grinning-face',
        'grinning-face-with-smiling-eyes',
      ]);
      expect(getNames(emojisText3)).to.deep.equal(['thumbs-up-sign']);
      expect(getNames(emojisText4)).to.deep.equal(['thumbs-up-sign-type-1-2']);
      expect(getNames(emojisText5)).to.deep.equal(['kiss']);
      expect(getNames(emojisText6)).to.deep.equal(['woman-with-bunny-ears']);
      expect(getNames(emojisText7)).to.deep.equal(['family-man-woman-girl-boy']);
    });
  });

  describe('hasEmojis', () => {
    it('return false for a text without emojis', () => {
      assert.isFalse(hasEmojis(simpleText1));
      assert.isFalse(hasEmojis(simpleText2));
      assert.isFalse(hasEmojis(simpleText3));
      assert.isFalse(hasEmojis(simpleText4));
      assert.isFalse(hasEmojis(simpleText5));
    });

    it('return true for a text with emojis', () => {
      assert.isTrue(hasEmojis(emojisText1));
      assert.isTrue(hasEmojis(emojisText2));
      assert.isTrue(hasEmojis(emojisText3));
      assert.isTrue(hasEmojis(emojisText4));
      assert.isTrue(hasEmojis(emojisText5));
      assert.isTrue(hasEmojis(emojisText6));
      assert.isTrue(hasEmojis(emojisText7));
    });
  });
});