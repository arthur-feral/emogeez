require('../../tests/bootstrap');

import {
  expect,
} from 'chai';
import sinon from 'sinon';
import {
  size,
  keys,
} from 'lodash';
import Configurator from '../config/config';
import Store from './store';
import Http from '../http/http';

const emojisData = require('../../tests/json/apple.json');
const config = Configurator();
const http = Http(config);
let store = Store(config, http);
store.setTheme('apple', emojisData);

const httpGetStub = sinon.stub();

describe('Store', () => {
  describe('getters', () => {
    describe('getThemeEmojis', () => {
      it('returns the emojis list for a theme', () => {
        const emojis = store.getThemeEmojis('apple');
        const emojisNames = keys(emojis);
        expect(size(emojisNames)).to.deep.equal(1955);
      });
    });

    describe('getEmojiByName', () => {
      it('returns the emoji named name', () => {
        const emoji = store.getEmojiByName('apple', 'grinning-face');
        expect(emoji).to.not.be.undefined;
      });
    });

    describe('getCategories', () => {
      it('returns the categories indexed in the store', () => {
        expect(keys(store.getCategories())).to.deep.equal([
          'people',
          'activity',
          'nature',
          'symbols',
          'food-drink',
          'travel-places',
          'objects',
          'flags',
        ]);
      });
    });

    describe('getCodePoints', () => {
      it('returns the codepoints list for a theme', () => {
        const codepoints = store.getCodePoints('apple');
        expect(size(codepoints)).to.deep.equal(1955);
      });
    });

    describe('getShortnameToName', () => {
      it('returns the emoji name from a shortname', () => {
        const name = store.getShortnameToName('apple')['grinning'];
        expect(name).to.deep.equal('grinning-face');
      });
    });

    describe('getShortnameToUtf8', () => {
      it('returns the emoji utf8 from a shortname', () => {
        const utf8 = store.getShortnameToUtf8('apple')['grinning'];
        expect(utf8).to.deep.equal(emojisData['people']['emojis'][0].symbol);
      });
    });

    describe('getNameToUtf8', () => {
      it('returns the emoji utf8 from a name', () => {
        const utf8 = store.getNameToUtf8('apple', 'grinning-face');
        expect(utf8).to.deep.equal(emojisData['people']['emojis'][0].symbol);
      });
    });

    describe('getCodepointToName', () => {
      it('returns the emoji name from a codepoint', () => {
        const utf8 = store.getCodepointToName('apple')['1f600'];
        expect(utf8).to.deep.equal('grinning-face');
      });
    });

    describe('getEmojiByShortname', () => {
      it('returns the emoji by  shortname', () => {
        expect(store.getEmojiByShortname('apple', 'grinning'))
          .to.deep.equal({
          category: 'people',
          fullName: 'Grinning Face',
          name: 'grinning-face',
          shortname: 'grinning',
          shortnames: [
            'grinning',
          ],
          symbol: '😀',
          unicode: '1f600',
        });
      });
    });
  });

  describe('fetchTheme', () => {
    it('fetch the data', () => {
      store = Store(config, {
        get: httpGetStub.resolves({}),
      });
      store.fetchTheme('themeName');
      expect(httpGetStub.callCount).to.equal(1);
      expect(httpGetStub.args[0][0]).to.equal('themeName');
    });
  });

  describe('setTheme', () => {
    describe('without blacklist', () => {
      it('store all emojis', () => {
        store = Store(config, http);
        store.setTheme('apple', emojisData);

        const emojis = store.getThemeEmojis('apple');
        expect(size(emojis)).to.equal(1955);
        expect(size(store.getCategories('apple'))).to.equal(8);
        expect(store.getCodePoints('apple').length).to.equal(1955);
        expect(size(store.getCodepointToName('apple'))).to.equal(1955);
      });
    });

    describe('with blacklist', () => {
      it('store  blacklisted emojis', () => {
        store = Store({
          blackList: [
            'grinning-face',
            'kiss',
            'reversed-hand-with-middle-finger-extended',
          ],
        }, http);
        store.setTheme('apple', emojisData);
        expect(size(store.getThemeEmojis('apple'))).to.equal(1947);
        expect(size(store.getCategories('apple'))).to.equal(8);
        expect(store.getCodePoints('apple').length).to.equal(1947);
        expect(size(store.getCodepointToName('apple'))).to.equal(1947);
      });
    });
  });

});
