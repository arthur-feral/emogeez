import {
  expect,
} from 'chai';
import sinon from 'sinon';
import superagent from 'superagent';
import {
  map,
} from 'lodash';
import fs from 'fs';
import EventEmitter from 'eventemitter3';
import Parser from './parser';
import { BASE_URL } from '../constants';

const baseConfig = {
  destination: `${process.cwd()}/emojis`,
  size: 24,
  fromCache: false,
  prefix: 'emojis',
  preproc: 'sass',
};

const emitter = new EventEmitter();
const parser = Parser(baseConfig, emitter);

const parseCategoriesSuccessSpy = sinon.spy();
const parseCategorySuccessSpy = sinon.spy();
const parseEmojiSuccessSpy = sinon.spy();
const parseImageSuccessSpy = sinon.spy();
const foundThemeForEmoji = sinon.spy();

emitter.on('PARSER_PARSE_CATEGORIES_SUCCESS', parseCategoriesSuccessSpy);
emitter.on('PARSER_PARSE_CATEGORY_SUCCESS', parseCategorySuccessSpy);
emitter.on('PARSER_PARSE_EMOJI_SUCCESS', parseEmojiSuccessSpy);
emitter.on('PARSER_PARSE_IMAGE_SUCCESS', parseImageSuccessSpy);
emitter.on('PARSER_FOUND_THEME', foundThemeForEmoji);

const indexHTML = fs.readFileSync(`${process.cwd()}/tests/html/index.html`, 'utf8');
const categoriesJSON = require(`${process.cwd()}/tests/jsons/categories.json`);//eslint-disable-line
const categoryHTML = fs.readFileSync(`${process.cwd()}/tests/html/people.html`, 'utf8');
const categoryEmojis = require(`${process.cwd()}/tests/jsons/emojisForCategory.json`);//eslint-disable-line

// grinning-face
// with shortname
const emojiHTML1 = fs.readFileSync(`${process.cwd()}/tests/html/grinning-face.html`, 'utf8');
const emojiJSON1 = require(`${process.cwd()}/tests/jsons/grinning-face.json`);//eslint-disable-line

// Kissing Face With Smiling Eyes
// with snake case shortname
const emojiHTML2 = fs.readFileSync(`${process.cwd()}/tests/html/kissing-face-with-smiling-eyes.html`, 'utf8');
const emojiJSON2 = require(`${process.cwd()}/tests/jsons/kissing-face-with-smiling-eyes.json`);//eslint-disable-line

// emoji with no shortnames
const emojiHTML3 = fs.readFileSync(`${process.cwd()}/tests/html/grinning-face-with-star-eyes.html`, 'utf8');
const emojiJSON3 = require(`${process.cwd()}/tests/jsons/grinning-face-with-star-eyes.json`);//eslint-disable-line

// emoji with modifiers
const emojiHTML4 = fs.readFileSync(`${process.cwd()}/tests/html/father-christmas.html`, 'utf8');
const emojiJSON4 = require(`${process.cwd()}/tests/jsons/father-christmas.json`);//eslint-disable-line

describe('Parser', () => {
  describe('homepage', () => {
    it('should find categories', async () => {
      const response = await superagent.get(`${BASE_URL}`);
      const categories = parser.parseCategories(response.text);
      expect(categories)
        .to
        .deep
        .equal([
          {
            fullName: 'Smileys & People',
            name: 'people',
            symbol: '😃',
            unicode: '1f603',
            url: 'https://emojipedia.org/people/',
          },
          {
            fullName: 'Animals & Nature',
            name: 'nature',
            symbol: '🐻',
            unicode: '1f43b',
            url: 'https://emojipedia.org/nature/',
          },
          {
            fullName: 'Food & Drink',
            name: 'food-drink',
            symbol: '🍔',
            unicode: '1f354',
            url: 'https://emojipedia.org/food-drink/',
          },
          {
            fullName: 'Activity',
            name: 'activity',
            symbol: '⚽',
            unicode: '26bd',
            url: 'https://emojipedia.org/activity/',
          },
          {
            fullName: 'Travel & Places',
            name: 'travel-places',
            symbol: '🌇',
            unicode: '1f307',
            url: 'https://emojipedia.org/travel-places/',
          },
          {
            fullName: 'Objects',
            name: 'objects',
            symbol: '💡',
            unicode: '1f4a1',
            url: 'https://emojipedia.org/objects/',
          },
          {
            fullName: 'Symbols',
            name: 'symbols',
            symbol: '🔣',
            unicode: '1f523',
            url: 'https://emojipedia.org/symbols/',
          },
          {
            fullName: 'Flags',
            name: 'flags',
            symbol: '🎌',
            unicode: '1f38c',
            url: 'https://emojipedia.org/flags/',
          },
        ]);
    });
  });

  describe('category', () => {
    it('should list all category emojis', async () => {
      const response = await superagent.get(`${BASE_URL}/people`);
      const emojis = parser.parseCategory(
        {
          fullName: 'Smileys & People',
          name: 'people',
          symbol: '😃',
          unicode: '1f603',
          url: 'https://emojipedia.org/people/',
        },
        response.text,
      );
      expect(emojis)
        .to
        .have
        .length(390);
      expect(emojis[0])
        .to
        .deep
        .equal({
          category: 'people',
          fullName: 'Grinning Face',
          name: 'grinning-face',
          symbol: '😀',
          url: 'https://emojipedia.org/grinning-face/',
        });
    });
  });

  describe('emoji', () => {
    it('should retrive all emojis infos', async () => {
      const response = await superagent.get(`${BASE_URL}/father-christmas/`);
      const emoji = parser.parseEmoji(
        {
          category: 'people',
          fullName: 'Santa Claus',
          name: 'father-christmas',
          symbol: '🎅',
          url: 'https://emojipedia.org/father-christmas/',
        },
        response.text,
      );
      expect(emoji)
        .to
        .deep
        .equal({
          category: 'people',
          fullName: 'Santa Claus',
          modifiers: {
            'father-christmas-type-1-2': {
              category: 'people',
              fullName: 'Santa Claus: Light Skin Tone',
              name: 'father-christmas-type-1-2',
              parent: 'father-christmas',
              symbol: '🎅🏻',
              url: 'https://emojipedia.org/father-christmas-type-1-2/',
            },
            'father-christmas-type-3': {
              category: 'people',
              fullName: 'Santa Claus: Medium-Light Skin Tone',
              name: 'father-christmas-type-3',
              parent: 'father-christmas',
              symbol: '🎅🏼',
              url: 'https://emojipedia.org/father-christmas-type-3/',
            },
            'father-christmas-type-4': {
              category: 'people',
              fullName: 'Santa Claus: Medium Skin Tone',
              name: 'father-christmas-type-4',
              parent: 'father-christmas',
              symbol: '🎅🏽',
              url: 'https://emojipedia.org/father-christmas-type-4/',
            },
            'father-christmas-type-5': {
              category: 'people',
              fullName: 'Santa Claus: Medium-Dark Skin Tone',
              name: 'father-christmas-type-5',
              parent: 'father-christmas',
              symbol: '🎅🏾',
              url: 'https://emojipedia.org/father-christmas-type-5/',
            },
            'father-christmas-type-6': {
              category: 'people',
              fullName: 'Santa Claus: Dark Skin Tone',
              name: 'father-christmas-type-6',
              parent: 'father-christmas',
              symbol: '🎅🏿',
              url: 'https://emojipedia.org/father-christmas-type-6/',
            },
          },
          name: 'father-christmas',
          shortname: 'santa',
          shortnames: [
            'santa',
          ],
          symbol: '🎅',
          themes: {
            apple: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/father-christmas_1f385.png',
            emojidex: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojidex/112/father-christmas_1f385.png',
            emojione: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/emojione/178/father-christmas_1f385.png',
            facebook: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/158/father-christmas_1f385.png',
            google: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/146/father-christmas_1f385.png',
            htc: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/father-christmas_1f385.png',
            lg: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/lg/57/father-christmas_1f385.png',
            messenger: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/father-christmas_1f385.png',
            microsoft: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/153/father-christmas_1f385.png',
            mozilla: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/father-christmas_1f385.png',
            samsung: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/148/father-christmas_1f385.png',
            softbank: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/softbank/145/father-christmas_1f385.png',
            twitter: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/180/father-christmas_1f385.png',
            whatsapp: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/whatsapp/160/father-christmas_1f385.png',
          },
          unicode: '1f385',
          url: 'https://emojipedia.org/father-christmas/',
        });
    });
  });

  describe('parseEmoji', () => {
    beforeEach(() => {
      parseEmojiSuccessSpy.reset();
      foundThemeForEmoji.reset();
    });

    describe('simple emoji', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(0);
        parser.parseEmoji(categoryEmojis.people.emojis[0], emojiHTML1);

        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.args[0][1])
          .to
          .equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0])
          .to
          .deep
          .equal(emojiJSON1);
      });
    });

    describe('emoji with long shortname', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(0);
        parser.parseEmoji({
          symbol: '😙',
          name: 'kissing-face-with-smiling-eyes',
          fullName: 'Kissing Face With Smiling Eyes',
          category: 'people',
        }, emojiHTML2);

        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.args[0][1])
          .to
          .equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0])
          .to
          .deep
          .equal(emojiJSON2);
      });
    });

    describe('emoji with long shortname', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(0);
        parser.parseEmoji({
          symbol: '😙',
          name: 'kissing-face-with-smiling-eyes',
          fullName: 'Kissing Face With Smiling Eyes',
          category: 'people',
        }, emojiHTML2);

        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.args[0][1])
          .to
          .equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0])
          .to
          .deep
          .equal(emojiJSON2);
      });
    });

    describe('emoji with no shortname', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(0);
        parser.parseEmoji({
          symbol: '🤩',
          name: 'grinning-face-with-star-eyes',
          fullName: 'Star-Struck',
          category: 'people',
        }, emojiHTML3);

        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.args[0][1])
          .to
          .equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0])
          .to
          .deep
          .equal(emojiJSON3);
      });
    });

    describe('emoji with modifiers', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(0);
        parser.parseEmoji({
          symbol: '🎅',
          name: 'father-christmas',
          fullName: 'Santa Claus',
          category: 'people',
        }, emojiHTML4);

        expect(parseEmojiSuccessSpy.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.callCount)
          .to
          .equal(1);
        expect(foundThemeForEmoji.args[0][1])
          .to
          .equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0])
          .to
          .deep
          .equal(emojiJSON4);
      });
    });
  });
});
