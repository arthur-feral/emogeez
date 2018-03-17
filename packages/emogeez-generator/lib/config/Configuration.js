import {
  assign,
} from 'lodash';

/**
 * @typedef Config
 * @property {String} destination
 * @property {String|Integer} size
 * @property {Boolean} cache
 * @property {String} prefix
 * @property {String} preproc
 */
/**
 * @param {String} destination
 * @param {String|Integer} size
 * @param {Boolean} cache
 * @param {String} prefix
 * @param {String} preproc
 * @constructor
 */
export default class Configuration {
  constructor({
    destination,
    size,
    cache,
    prefix,
    preproc,
  }) {
    assign(this, {
      destination,
      size: parseInt(size, 10),
      cache,
      prefix,
      preproc,
    });
  }
}
