import {
  expect,
} from 'chai';
import {
  find,
} from 'lodash';
import {
  getUnicode,
} from './utils';

require('../tests/bootstrap');

const emojis = require('../tests/json/emojis.json');

const grinning = emojis.people.emojis['grinning-face'].symbol;
const grin = emojis.people.emojis['grinning-face-with-smiling-eyes'].symbol;
const $thumbsup = find(emojis.people.emojis, e => e.name === 'thumbs-up-sign');
const thumbsup = $thumbsup.symbol;
const thumbsupWhite = $thumbsup.modifiers['thumbs-up-sign-type-1-2'].symbol;
const kiss = find(emojis.people.emojis, e => e.name === 'kiss').symbol;
const womanWithBunnyEars = find(emojis.people.emojis, e => e.name === 'woman-with-bunny-ears').symbol;
const family = find(emojis.people.emojis, e => e.name === 'family').symbol;
const familyAndStuff = find(emojis.people.emojis, e => e.name === 'family-man-woman-girl-boy').symbol;

describe('Utils', () => {
  describe('getUnicode', () => {
    it('returns the correct unicode', () => {
      expect(getUnicode(grinning)).to.equal('1f600');
      expect(getUnicode(grin)).to.equal('1f601');
      expect(getUnicode(thumbsup)).to.equal('1f44d');
      expect(getUnicode(thumbsupWhite)).to.equal('1f44d-1f3fb');
      expect(getUnicode(kiss)).to.equal('1f48f');
      expect(getUnicode(womanWithBunnyEars)).to.equal('1f46f');
      expect(getUnicode(family)).to.equal('1f46a');
      expect(getUnicode(familyAndStuff)).to.equal('1f468-200d-1f469-200d-1f467-200d-1f466');
    });
  });
});
