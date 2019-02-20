import fs from 'fs-extra';
import Throttle from 'superagent-throttle/dist';
import { FETCHER_RETRY_COUNT } from './constants';

/**
 * format char unicode to something like this
 * "D83D-DC69-200D-2764-FE0F-200D-D83D-DC69"
 * @param char
 * @returns {string}
 */
/* eslint-disable */
export const getUnicode = (char) => {
  let i = 0;
  let c = 0;
  let p = 0;
  let r = [];
  while (i < char.length) {
    c = char.charCodeAt(i++);
    if (p) {
      r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join('-');
};
/* eslint-enable */

/**
 * save a file on a specified path
 * @param content
 * @param path
 * @param name
 */
export const saveFile = (content, path, name) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    fs.accessSync(path, fs.F_OK);
  } catch (error) {
    fs.mkdirpSync(path);
  }

  fs.writeFileSync(`${path}/${name}`, content);
};


const throttle = new Throttle({
  active: true, // set false to pause queue
  rate: 150, // how many requests can be sent every `ratePer`
  ratePer: 1000, // number of ms in which `rate` requests may be sent
  concurrent: 50, // how many requests can be sent concurrently
});
export const getRequest = (superagent, url) => superagent
  .get(url)
  .use(throttle.plugin())
  .retry(FETCHER_RETRY_COUNT);
