import {
  expect,
} from 'chai';
import Config from '../config/config';
import Http from './http';
import emojisData from '../../tests/json/apple.json';

const fetchMock = require('fetch-mock');

const fetchMocked = fetchMock.get('*', emojisData);

const config = Config({});
const http = Http(config);

describe('http', () => {
  describe('get', () => {
    it('fetch the themeName json data', async () => {
      const result = await http.get('apple');
      expect(fetchMocked.lastCall()[0])
        .to.equal('https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@latest/packages/emogeez-generator/emojis/apple/apple.json');

      expect(result).to.deep.equal(emojisData);
    });
  });
});
