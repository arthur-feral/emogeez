require('../../tests/bootstrap');

import {
  expect,
} from 'chai';
import sinon from 'sinon';
import {
  size,
} from 'lodash';
import Configurator from '../config/config';
import Store from './store';
import Http from '../http/http';

const emojisData = require('../../tests/json/apple.json');
const config = Configurator();
const http = Http(config);
let store;

const httpGetStub = sinon.stub();

describe('Store', () => {
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

  describe('parse', () => {
    describe('without blacklist', () => {
      it('store all emojis', () => {
        store = Store(config, http);
        store.parse('apple', emojisData);
        expect(size(store.getEmojis('apple'))).to.equal(1955);
        expect(size(store.getCategories('apple'))).to.equal(8);
        expect(store.getCodePoints('apple').length).to.equal(1955);
        expect(size(store.getCodePointsToEmojis('apple'))).to.equal(1955);
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
        store.parse('apple', emojisData);
        expect(size(store.getEmojis('apple'))).to.equal(1947);
        expect(size(store.getCategories('apple'))).to.equal(8);
        expect(store.getCodePoints('apple').length).to.equal(1947);
        expect(size(store.getCodePointsToEmojis('apple'))).to.equal(1947);
      });
    });
  });
});
