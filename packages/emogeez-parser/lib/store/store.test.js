import {
  expect,
  assert,
} from 'chai';
import sinon from 'sinon';
import {
  size,
  keys,
} from 'lodash';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import Configurator from '../config/config';
import Store from './store';
import Http from '../http/http';

const config = Configurator();
const http = Http(config);
let store = Store(config, http);
store.setTheme('apple', apple);

const httpGetStub = sinon.stub();

describe('Store', () => {
  describe('getters', () => {
    describe('getEmojis', () => {
      it('returns the emojis list for a theme', () => {
        const emojis = store.getEmojis('apple');
        const emojisNames = keys(emojis);
        expect(size(emojisNames))
          .to
          .deep
          .equal(2486);
      });
    });

    describe('hasEmoji', () => {
      it('returns the emojis list for a theme', () => {
        assert.isTrue(store.hasEmoji('apple', 'grinning-face'));
        assert.isFalse(store.hasEmoji('apple', 'not-an-emoji'));
      });
    });

    describe('getEmojiByName', () => {
      it('returns the emoji named name', () => {
        const emoji = store.getEmojiByName('apple', 'grinning-face');
        expect(emoji)
          .to
          .deep
          .equal({
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
        const emoji2 = store.getEmojiByName('apple', 'unknown-emoji');
        assert.isUndefined(emoji2);
      });
    });

    describe('getCategories', () => {
      it('returns the categories indexed in the store', () => {
        expect(keys(store.getCategories()))
          .to
          .deep
          .equal([
            'people',
            'nature',
            'food-drink',
            'activity',
            'travel-places',
            'objects',
            'symbols',
            'flags',
          ]);
      });
    });

    describe('getNameFromCodepoint', () => {
      it('returns the emoji name from a codepoint', () => {
        const name = store.getNameFromCodepoint('apple', '1f600');
        expect(name)
          .to
          .equal('grinning-face');
      });
    });

    describe('toUTF8', () => {
      it('returns the emoji utf8 from a name', () => {
        const utf8 = store.toUTF8('apple', 'grinning-face');
        expect(utf8)
          .to
          .deep
          .equal(apple.people.emojis['grinning-face'].symbol);
      });
    });
  });

  describe('fetchTheme', () => {
    it('fetch the data', () => {
      store = Store(config, {
        get: httpGetStub.resolves({}),
      });
      store.fetchTheme('themeName');
      expect(httpGetStub.callCount)
        .to
        .equal(1);
      expect(httpGetStub.args[0][0])
        .to
        .equal('themeName');
    });
  });

  describe('setTheme', () => {
    describe('without blacklist', () => {
      it('store all emojis', () => {
        store = Store(config, http);
        store.setTheme('apple', apple);

        const emojis = store.getEmojis('apple');
        expect(size(emojis))
          .to
          .equal(2486);
        expect(size(store.getCategories('apple')))
          .to
          .equal(8);
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
        store.setTheme('apple', apple);
        expect(size(store.getEmojis('apple')))
          .to
          .equal(2478);
        expect(size(store.getCategories('apple')))
          .to
          .equal(8);
      });
    });
  });
});
