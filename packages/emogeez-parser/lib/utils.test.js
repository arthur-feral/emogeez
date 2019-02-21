import {
  expect,
} from 'chai';
import emojis from 'emogeez-generator/emojis/emojis.json';
import {
  getUnicode,
} from './utils';

const grinning = emojis.people.emojis['grinning-face'].symbol;
const grin = emojis.people.emojis['grinning-face-with-smiling-eyes'].symbol;
const thumbsup = emojis.people.emojis['thumbs-up-sign'].symbol;
const thumbsupWhite = emojis.people.emojis['thumbs-up-sign-type-1-2'].symbol;
const kiss = emojis.people.emojis['kiss'].symbol; // eslint-disable-line
const womanWithBunnyEars = emojis.people.emojis['woman-with-bunny-ears'].symbol;
const family = emojis.people.emojis['family'].symbol; // eslint-disable-line
const familyAndStuff = emojis.people.emojis['family-man-woman-girl-boy'].symbol;

describe('Utils', () => {
  describe('getUnicode', () => {
    it('returns the correct unicode', () => {
      expect(getUnicode(grinning))
        .to
        .equal('1f600');
      expect(getUnicode(grin))
        .to
        .equal('1f601');
      expect(getUnicode(thumbsup))
        .to
        .equal('1f44d');
      expect(getUnicode(thumbsupWhite))
        .to
        .equal('1f44d-1f3fb');
      expect(getUnicode(kiss))
        .to
        .equal('1f48f');
      expect(getUnicode(womanWithBunnyEars))
        .to
        .equal('1f46f');
      expect(getUnicode(family))
        .to
        .equal('1f46a');
      expect(getUnicode(familyAndStuff))
        .to
        .equal('1f468-200d-1f469-200d-1f467-200d-1f466');
    });
  });
});
