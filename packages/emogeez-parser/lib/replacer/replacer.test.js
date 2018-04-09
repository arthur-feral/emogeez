require('../../tests/bootstrap');
import {
  expect,
} from 'chai';
import Config from '../config/config';
import Store from '../store/store';
import Http from '../http/http';
import Replacer from './replacer';

const emojisData = require('../../tests/json/apple.json');
const config = Config();
const http = Http(config);
const store = Store(config, http);
store.setTheme('apple', emojisData);

const {
  aliasesToShortnames,
  shortnamesToUTF8,
  utf8ToShortnames,
} = Replacer(store);

const grinningFace = store.getNameToUtf8('apple', 'grinning-face');
const specialEmoji = store.getNameToUtf8('apple', 'couple-with-heart-woman-woman');
const specialEmoji2 = store.getNameToUtf8('apple', 'father-christmas-type-3');

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
        const newString = shortnamesToUTF8('apple', ':grinning:');
        expect(newString).to.equal(`${grinningFace}`);
      });
    });

    describe('simple shortname', () => {
      it('replace shortname with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':grinning:');
        expect(newString).to.equal(`${grinningFace}`);
      });
    });

    describe('string with multiple shortnames', () => {
      it('replace shortname with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':D :grinning: :couple-with-heart-woman-woman:');
        expect(newString).to.equal(`${grinningFace} ${grinningFace} ${specialEmoji}`);
      });
    });

    describe('string with multiple shortnames following each other', () => {
      it('replace shortname with utf8', () => {
        const newString = shortnamesToUTF8('apple', ':grinning::couple-with-heart-woman-woman:');
        expect(newString).to.equal(`${grinningFace}${specialEmoji}`);
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
        const str = '你好，找文章:grinning:';
        const str2 = '、パリ郊外のアニエールにあるルイ･:grinning:';

        expect(shortnamesToUTF8('apple', str)).to.equal(`你好，找文章${grinningFace}`);
        expect(shortnamesToUTF8('apple', str2)).to.equal(`、パリ郊外のアニエールにあるルイ･${grinningFace}`);
      });
    });
  });

  describe('#utf8ToShortnames', () => {
    describe('string with simple emoji', () => {
      it('replace utf8 emoji with shortname', () => {
        const newString = utf8ToShortnames('apple', grinningFace);
        expect(newString).to.equal(':grinning:');
      });
    });

    describe('string with special emoji', () => {
      it('replace utf8 with shortname', () => {
        const newString = utf8ToShortnames('apple', specialEmoji);
        expect(newString).to.equal(':couple-with-heart-woman-woman:');
      });
    });

    describe('string with some special emojis and some text', () => {
      it('replace utf8 with shortnames', () => {
        const newString = utf8ToShortnames('apple', `bonjour ! ${specialEmoji} ça va ? ${specialEmoji2} hehe`);
        const expectedString = [
          'bonjour !',
          ':couple-with-heart-woman-woman:',
          'ça va ?',
          ':father-christmas-type-3:',
          'hehe',
        ].join(' ');
        expect(newString).to.equal(expectedString);
      });
    });

    describe('with chinese and japanese chars', () => {
      it('should not fail, or at least return the same string', () => {
        const str = '你好，找文章';
        const str2 = '你好找文章';
        const str3 = '、パリ郊外のアニエールにあるルイ';
        const str4 = '、パリ郊外のアニエールにあるルイ･';
        const str5 = `、パリ郊外のアニエールにあるルイ･${grinningFace}`;

        expect(utf8ToShortnames('apple', str)).to.equal('你好，找文章');
        expect(utf8ToShortnames('apple', str2)).to.equal('你好找文章');
        expect(utf8ToShortnames('apple', str3)).to.equal('、パリ郊外のアニエールにあるルイ');
        expect(utf8ToShortnames('apple', str4)).to.equal('、パリ郊外のアニエールにあるルイ･');
        expect(utf8ToShortnames('apple', str5)).to.equal('、パリ郊外のアニエールにあるルイ･:grinning:');
      });
    });
  });
});