require('../../tests/bootstrap');
import {
  expect,
} from 'chai';
import Configurator from '../config/config';
import Replacer from './replacer';

const emojisData = require('../../tests/json/emojis.json');
const config1 = {
  blackList: [],
};
const configurator = Configurator(config1, emojisData);
const {
  aliasesToShortnames,
  shortnamesToUTF8,
} = Replacer(configurator);

const policeOfficer = emojisData.people.emojis['police-officer'].symbol;
describe('Replacer', () => {
  describe('aliasesToShortnames', () => {
    it('replace an alias to shortname', () => {
      const newString = aliasesToShortnames('hello :)');
      expect(newString).to.equal('hello :slightly-smiling-face:');
    });

    it('should not detect aliases in words', () => {
      const newString = aliasesToShortnames('http://test.com/ :/\n<3\nhttp:/\n:\\n;brushed');
      expect(newString).to.equal('http://test.com/ :confused:\n:heart:\nhttp:/\n:\\n;brushed');
    });

    it('replace many aliases in string', () => {
      const newString = aliasesToShortnames('sorry :/ :-|');
      expect(newString).to.equal('sorry :confused: :neutral-face:');
    });
  });

  describe('shortnamesToUTF8', () => {
    describe('alias begin like a shorname', () => {
      it('should not break the shortname', () => {
        const newString = shortnamesToUTF8('apple', ':police-officer:');
        expect(newString).to.equal(`${policeOfficer}`);
      });
    });

    describe('simple shortname', () => {
      it('replace shortname with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':grinning-face:');
        expect(newString).to.equal(`${simpleEmoji}`);
      });
    });

    describe('string with multiple shortnames', () => {
      it('replace shortname with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':D :grinning-face: :couple-with-heart-woman-woman:');
        expect(newString).to.equal(`${simpleEmoji} ${simpleEmoji} ${specialEmoji}`);
      });
    });

    describe('string with multiple shortnames following each other', () => {
      it('replace shortname with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':grinning-face::couple-with-heart-woman-woman:');
        expect(newString).to.equal(`${simpleEmoji}${specialEmoji}`);
      });
    });

    describe('string with multiple aliases following each other', () => {
      it('dont replace aliases with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':D:D');
        expect(newString).to.equal(':D:D');
      });
    });

    describe('with chinese and japanese chars', () => {
      it('should not fail, or at least return the same string', () => {
        const str = '你好，找文章:grinning-face:';
        const str2 = '、パリ郊外のアニエールにあるルイ･:grinning-face:';

        expect(shortnamesToUTF8('apple', str)).to.equal(`你好，找文章${simpleEmoji}`);
        expect(shortnamesToUTF8('apple', str2)).to.equal(`、パリ郊外のアニエールにあるルイ･${simpleEmoji}`);
      });
    });
  });
});