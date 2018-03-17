import {
  expect,
} from 'chai';
import {
  map,
} from 'lodash';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import superagent from 'superagent';
import fs from 'fs-extra';
import Fetcher from './fetcher';

const superagentMockConfig = require('../../tests/superagent-mock.config.js');
const superagentMocked = require('superagent-mock')(superagent, superagentMockConfig);
const emitter = new EventEmitter();

import {
  APP_READY,
} from '../constants';

const baseConfig = {
  destination: `${process.cwd()}/emojis`,
  size: 24,
  fromCache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

const fetcher = Fetcher(superagent, baseConfig, emitter);
const fetchCategoriesSuccessSpy = sinon.spy();
const fetchCategorySuccessSpy = sinon.spy();
const fetchEmojiSuccessSpy = sinon.spy();
const fetchImageSuccessSpy = sinon.spy();

const indexHTML = fs.readFileSync(`${process.cwd()}/tests/html/index.html`, 'utf8');
const indexJSON = map(require(`${process.cwd()}/tests/jsons/categories.json`), category => category);
const categoryHTML = fs.readFileSync(`${process.cwd()}/tests/html/people.html`, 'utf8');
const categoryEmojis = require(`${process.cwd()}/tests/jsons/emojisForCategory.json`).people.emojis;
const emojiHTML1 = fs.readFileSync(`${process.cwd()}/tests/html/grinning-face.html`, 'utf8');
const emojiJSON1 = require(`${process.cwd()}/tests/jsons/grinning-face.json`);
const emojiHTML2 = fs.readFileSync(`${process.cwd()}/tests/html/winking-face.html`, 'utf8');
const emojiHTML3 = fs.readFileSync(`${process.cwd()}/tests/html/father-christmas.html`, 'utf8');

emitter.on('FETCHER_FETCH_CATEGORIES_SUCCESS', fetchCategoriesSuccessSpy);
emitter.on('FETCHER_FETCH_CATEGORY_SUCCESS', fetchCategorySuccessSpy);
emitter.on('FETCHER_FETCH_EMOJI_SUCCESS', fetchEmojiSuccessSpy);
emitter.on('FETCHER_FETCH_IMAGE_SUCCESS', fetchImageSuccessSpy);

describe('Fetcher', () => {
  beforeEach(() => {
    fetchCategoriesSuccessSpy.reset();
    fetchCategorySuccessSpy.reset();
    fetchEmojiSuccessSpy.reset();
    fetchImageSuccessSpy.reset();
  });
  after(() => {
    superagentMocked.unset();
  });

  describe('APP_READY', () => {
    it('calls fetchCategories', async () => {
      const result = await fetcher.fetchCategories();
      expect(fetchCategoriesSuccessSpy.callCount).to.equal(1);
      expect(fetchCategoriesSuccessSpy.args[0][0]).to.equal(indexHTML);
    });
  });

  describe('fetchCategory', () => {
    it('fetch emojis list from a category', async () => {
      expect(fetchCategorySuccessSpy.callCount).to.equal(0);
      const result = await fetcher.fetchCategory(indexJSON[0]);
      expect(fetchCategorySuccessSpy.callCount).to.equal(1);
      expect(fetchCategorySuccessSpy.args[0][0]).to.deep.equal({
        'symbol': '😃',
        'url': 'https://emojipedia.org/people/',
        'name': 'people',
        'fullName': 'Smileys & People',
      });
      expect(fetchCategorySuccessSpy.args[0][1]).to.equal(categoryHTML);
    });
  });

  describe('fetchEmoji', () => {
    it('calls fetchEmoji', async () => {
      let result = await fetcher.fetchEmoji(categoryEmojis[0]);
      expect(fetchEmojiSuccessSpy.callCount).to.equal(1);
      expect(fetchEmojiSuccessSpy.args[0][0]).to.deep.equal({
        'category': 'people',
        'symbol': '😀',
        'fullName': 'Grinning Face',
        'name': 'grinning-face',
        'url': 'https://emojipedia.org/grinning-face/',
      });
      expect(fetchEmojiSuccessSpy.args[0][1]).to.equal(emojiHTML1);

      result = await fetcher.fetchEmoji(categoryEmojis[1]);
      expect(fetchEmojiSuccessSpy.callCount).to.equal(2);
      expect(fetchEmojiSuccessSpy.args[1][0]).to.deep.equal({
        'category': 'people',
        'symbol': '😉',
        'fullName': 'Winking Face',
        'name': 'winking-face',
        'url': 'https://emojipedia.org/winking-face/',
      });
      expect(fetchEmojiSuccessSpy.args[1][1]).to.equal(emojiHTML2);

      result = await fetcher.fetchEmoji(categoryEmojis[2]);
      expect(fetchEmojiSuccessSpy.callCount).to.equal(3);
      expect(fetchEmojiSuccessSpy.args[2][0]).to.deep.equal({
        'symbol': '🎅',
        'name': 'father-christmas',
        'fullName': 'Santa Claus',
        'category': 'people',
        'url': 'https://emojipedia.org/father-christmas/',
      });
      expect(fetchEmojiSuccessSpy.args[2][1]).to.equal(emojiHTML3);
    });
  });

  describe('fetchImage', () => {
    it('fetches all the themes images', async () => {
      const result = await fetcher.fetchImage(emojiJSON1, 'apple', 'https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/118/grinning-face_1f600.png');
      expect(fetchImageSuccessSpy.callCount).to.equal(1);
      expect(fetchImageSuccessSpy.args[0][0]).to.equal(emojiJSON1);
      expect(fetchImageSuccessSpy.args[0][1]).to.equal('apple');
    });
  });
});