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
  aliasesToNames,
  toUTF8,
  utf8ToNames,
  namesToHTML,
  UTF8ToHTML,
} = Replacer(store);

const grinningFace = store.toUTF8('apple', 'grinning-face');
const specialEmoji = store.toUTF8('apple', 'couple-with-heart-woman-woman');
const specialEmoji2 = store.toUTF8('apple', 'father-christmas-type-3');

describe('Replacer', () => {
  describe('aliasesToNames', () => {
    it('replace an alias to shortname', () => {
      const newString = aliasesToNames('hello :)');
      expect(newString).to.equal('hello :slightly-smiling-face:');
    });

    it('should not detect aliases in words', () => {
      const newString = aliasesToNames('http://test.com/ :/\n<3\nhttp:/\n:\\n;brushed');
      expect(newString).to.equal('http://test.com/ :confused-face:\n:heavy-black-heart:\nhttp:/\n:\\n;brushed');
    });

    it('replace many aliases in string', () => {
      const newString = aliasesToNames('sorry :/ :-|');
      expect(newString).to.equal('sorry :confused-face: :neutral-face:');
    });
  });

  describe('toUTF8', () => {
    describe('simple shortname', () => {
      it('replace shortname with utf8', () => {
        const newString = toUTF8('apple', ':grinning-face:');
        expect(newString).to.equal(`${grinningFace}`);
      });
    });

    describe('string with multiple shortnames', () => {
      it('replace shortname with utf8', () => {
        const newString = toUTF8('apple', ':D :grinning-face: :couple-with-heart-woman-woman:');
        expect(newString).to.equal(`${grinningFace} ${grinningFace} ${specialEmoji}`);
      });
    });

    describe('string with multiple shortnames following each other', () => {
      it('replace shortname with utf8', () => {
        const newString = toUTF8('apple', ':grinning-face::couple-with-heart-woman-woman:');
        expect(newString).to.equal(`${grinningFace}${specialEmoji}`);
      });
    });

    describe('string with multiple aliases following each other', () => {
      it('dont replace aliases with utf8', () => {
        const newString = toUTF8('apple', ':D:D');
        expect(newString).to.equal(':D:D');
      });
    });

    describe('with chinese and japanese chars', () => {
      it('should not fail, or at least return the same string', () => {
        const str = '你好，找文章:grinning-face:';
        const str2 = '、パリ郊外のアニエールにあるルイ･:grinning-face:';

        expect(toUTF8('apple', str)).to.equal(`你好，找文章${grinningFace}`);
        expect(toUTF8('apple', str2)).to.equal(`、パリ郊外のアニエールにあるルイ･${grinningFace}`);
      });
    });
  });

  describe('#utf8ToNames', () => {
    describe('string with simple emoji', () => {
      it('replace utf8 emoji with shortname', () => {
        const newString = utf8ToNames('apple', grinningFace);
        expect(newString).to.equal(':grinning-face:');
      });
    });

    describe('do something', () => {
      it('do something', () => {
        const newString = utf8ToNames('apple', 'hey :)');
        expect(newString).to.equal('hey :)');
      });
    });

    describe('string with special emoji', () => {
      it('replace utf8 with shortname', () => {
        const newString = utf8ToNames('apple', specialEmoji);
        expect(newString).to.equal(':couple-with-heart-woman-woman:');
      });
    });

    describe('string with some special emojis and some text', () => {
      it('replace utf8 with shortnames', () => {
        const newString = utf8ToNames('apple', `bonjour ! ${specialEmoji} ça va ? ${specialEmoji2} hehe`);
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

        expect(utf8ToNames('apple', str)).to.equal('你好，找文章');
        expect(utf8ToNames('apple', str2)).to.equal('你好找文章');
        expect(utf8ToNames('apple', str3)).to.equal('、パリ郊外のアニエールにあるルイ');
        expect(utf8ToNames('apple', str4)).to.equal('、パリ郊外のアニエールにあるルイ･');
        expect(utf8ToNames('apple', str5)).to.equal('、パリ郊外のアニエールにあるルイ･:grinning-face:');
      });
    });
  });

  describe('namesToHTML', () => {
    it('replace emojis names to html', () => {
      let text = 'hello :grinning-face: how are you?';
      let result = namesToHTML('apple', text, (emoji) => {
        return `<span class="emoji-${emoji.name}"></span>`;
      });
      expect(result).to.equal('hello <span class="emoji-grinning-face"></span> how are you?');
    });
  });

  describe('UTF8ToHTML', () => {
    it('replace emojis names to html', () => {
      let text = 'hello 🙂 :grinning-face: how are you? :)';
      let result = UTF8ToHTML('apple', text, (emoji) => {
        return `<span class="emoji-${emoji.name}"></span>`;
      });
      expect(result).to.equal('hello <span class="emoji-slightly-smiling-face"></span> <span class="emoji-grinning-face"></span> how are you? :)');
    });
  });
});