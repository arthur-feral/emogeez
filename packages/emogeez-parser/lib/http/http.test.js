import {
  expect,
  assert,
} from 'chai';

const fetchMock = require('fetch-mock');
import emojisData from '../../tests/json/apple.json';

const packageJSON = require('../../package.json');

const fetchMocked = fetchMock.get('*', emojisData);

import Config from '../config/config';
import Http from './http';

const config = Config();
const http = Http(config);

describe('http', () => {
  describe('get', () => {
    it('fetch the themeName json data', async () => {
      const result = await http.get('apple');
      expect(fetchMocked.lastCall()[0])
        .to.equal(`//cdn.jsdelivr.net/gh/arthur-feral/emogeez-generator@${packageJSON.version}/emojis/apple/apple.json`);

      expect(result).to.deep.equal(emojisData);
    });
  });
});