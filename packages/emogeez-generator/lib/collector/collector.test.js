import {
  size,
} from 'lodash';
import {
  expect,
} from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import Collector from './collector';
import {
  PARSER_PARSE_EMOJI_SUCCESS,
  PARSER_PARSE_CATEGORIES_SUCCESS, PARSER_FOUND_THEME, COLLECTOR_COLLECT_DONE,
} from '../constants';

const baseConfig = {
  destination: `${process.cwd()}/emojis`,
  size: 48,
  fromCache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

const emitter = new EventEmitter();
let collector = Collector(baseConfig, emitter);

const collectDoneSpy = sinon.spy();

const emojiParsed = require(`${process.cwd()}/tests/jsons/grinning-face.json`);
emitter.on('COLLECTOR_COLLECT_DONE', collectDoneSpy);
describe('Collector', () => {
  describe('getStore', () => {
    it('returns the store state', () => {
      expect(collector.getStore()).to.deep.equal({
        emojisTotal: 0,
        emojisScrapped: 0,
        imagesTotal: 0,
        imagesComputed: 0,
        imagesFailedCount: 0,
        emojis: {},
        categories: {},
        emojisThemes: {},
      });
    });
  });

  describe('PARSER_FOUND_THEME', () => {
    it('increment images count', () => {
      expect(collector.getStore().imagesTotal).to.equal(0);
      emitter.emit('PARSER_FOUND_THEME');
      expect(collector.getStore().imagesTotal).to.equal(1);
    });
  });

  describe('PARSER_FOUND_MODIFIERS', () => {
    it('increment emojis count', () => {
      expect(collector.getStore().emojisTotal).to.equal(0);
      emitter.emit('PARSER_FOUND_MODIFIERS', {
        emoji1: {},
        emoji2: {},
      });
      expect(collector.getStore().emojisTotal).to.equal(2);
    });
  });

  describe('PARSER_PARSE_CATEGORY_SUCCESS', () => {
    it('increment emojis count', () => {
      expect(collector.getStore().emojisTotal).to.equal(2);
      emitter.emit('PARSER_PARSE_CATEGORY_SUCCESS', [{ name: 'emoji1' }, { name: 'emoji2' }]);
      expect(collector.getStore().emojisTotal).to.equal(4);
    });
  });

  describe('PARSER_PARSE_EMOJI_SUCCESS', () => {
    it('add the emoji newly parsed the store', () => {
      expect(collector.getStore().emojisScrapped).to.equal(0);
      emitter.emit(PARSER_PARSE_EMOJI_SUCCESS, emojiParsed);
      expect(collector.getStore().emojisScrapped).to.equal(1);
      expect(collector.getStore().emojis).to.deep.equal({
        'grinning-face': emojiParsed,
      });
    });
  });

  describe('PARSER_PARSE_CATEGORIES_SUCCESS', () => {
    it('add the categories newly parsed the store', () => {
      expect(collector.getStore().categories).to.deep.equal({});
      emitter.emit(PARSER_PARSE_CATEGORIES_SUCCESS, [
        {
          'fullName': 'Smileys & People',
          'name': 'people',
          'symbol': '😃',
          'url': 'https://emojipedia.org/people/',
        },
        {
          'fullName': 'Food',
          'name': 'food',
          'symbol': '🍟',
          'url': 'https://emojipedia.org/food/',
        },
      ]);
      expect(collector.getStore().categories).to.deep.equal({
        people: {
          'fullName': 'Smileys & People',
          'name': 'people',
          'symbol': '😃',
          'url': 'https://emojipedia.org/people/',
        },
        food: {
          'fullName': 'Food',
          'name': 'food',
          'symbol': '🍟',
          'url': 'https://emojipedia.org/food/',
        },
      });
    });
  });

  describe('PARSER_PARSE_IMAGE_SUCCESS', () => {
    it('updates images count and themes list', () => {
      expect(collector.getStore().imagesComputed).to.equal(0);
      expect(collector.getStore().emojisThemes).to.deep.equal({});
      emitter.emit('PARSER_PARSE_IMAGE_SUCCESS', emojiParsed, 'apple', 'path/to/image.png');
      expect(collector.getStore().imagesComputed).to.equal(1);
      expect(collector.getStore().emojisThemes).to.deep.equal({
        apple: {
          'path/to/image.png': emojiParsed.name,
        },
      });
    });
  });

  // describe('FETCHER_FETCH_IMAGE_ERROR', () => {
  //   it('handle image fetching error and remove related theme for the emoji', () => {
  //     expect(collector.getStore().imagesFailedCount).to.equal(0);
  //     emitter.emit('FETCHER_FETCH_IMAGE_ERROR', emojiParsed, 'apple', 'path/to/image.png');
  //     expect(collector.getStore().imagesFailedCount).to.equal(1);
  //   });
  // });

  describe('PARSER_PARSED_ALL_IMAGES', () => {
    it('handle image fetching error and remove related theme for the emoji', () => {
      expect(collectDoneSpy.callCount).to.equal(0);
      emitter.emit('PARSER_PARSED_ALL_IMAGES');
      expect(collectDoneSpy.callCount).to.equal(1);
      expect(collectDoneSpy.args[0][0]).to.deep.equal({
        apple: {
          [emojiParsed.name]: 'path/to/image.png',
        },
      });
    });
  });
});