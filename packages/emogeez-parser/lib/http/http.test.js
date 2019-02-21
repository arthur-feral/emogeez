import {
  expect,
} from 'chai';
import apple from 'emogeez-generator/emojis/apple/apple.json';
import Config from '../config/config';
import Http from './http';

const fetchMock = require('fetch-mock');

const fetchMocked = fetchMock.get('*', apple);

const config = Config({});
const http = Http(config);

describe('http', () => {
  describe('get', () => {
    it('fetch the themeName json data', async () => {
      const result = await http.get('apple');
      expect(fetchMocked.lastCall()[0])
        .to.equal('https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@latest/packages/emogeez-generator/emojis/apple/apple.json');

      expect(result).to.deep.equal(apple);
    });
  });
});
