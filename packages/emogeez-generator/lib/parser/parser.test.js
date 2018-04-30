import {
  expect,
} from 'chai';
import sinon from 'sinon';
import {
  map,
} from 'lodash';
import fs from 'fs';
import EventEmitter from 'eventemitter3';
import Parser from './parser';

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
  describe('parseCategories', () => {
    it('parse categories data from main page', () => {
      expect(parseCategoriesSuccessSpy.callCount).to.equal(0);
      parser.parseCategories(indexHTML);

      expect(parseCategoriesSuccessSpy.callCount).to.equal(1);
      expect(parseCategoriesSuccessSpy.args[0][0]).to.deep.equal([
        {
          fullName: 'Smileys & People',
          name: 'people',
          symbol: '😃',
          unicode: '1f603',
          url: 'https://emojipedia.org/people/',
        },
      ]);
    });
  });

  describe('parseCategory', () => {
    it('parse category data from category page', () => {
      expect(parseCategorySuccessSpy.callCount).to.equal(0);
      parser.parseCategory(categoriesJSON.people, categoryHTML);

      expect(parseCategorySuccessSpy.callCount).to.equal(1);
      expect(parseCategorySuccessSpy.args[0][0]).to.deep.equal(map(categoryEmojis.people.emojis, emoji => emoji));
    });
  });

  describe('parseEmoji', () => {
    beforeEach(() => {
      parseEmojiSuccessSpy.reset();
      foundThemeForEmoji.reset();
    });

    describe('simple emoji', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount).to.equal(0);
        parser.parseEmoji(categoryEmojis.people.emojis[0], emojiHTML1);

        expect(parseEmojiSuccessSpy.callCount).to.equal(1);
        expect(foundThemeForEmoji.callCount).to.equal(1);
        expect(foundThemeForEmoji.args[0][1]).to.equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0]).to.deep.equal(emojiJSON1);
      });
    });

    describe('emoji with long shortname', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount).to.equal(0);
        parser.parseEmoji({
          symbol: '😙',
          name: 'kissing-face-with-smiling-eyes',
          fullName: 'Kissing Face With Smiling Eyes',
          category: 'people',
        }, emojiHTML2);

        expect(parseEmojiSuccessSpy.callCount).to.equal(1);
        expect(foundThemeForEmoji.callCount).to.equal(1);
        expect(foundThemeForEmoji.args[0][1]).to.equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0]).to.deep.equal(emojiJSON2);
      });
    });

    describe('emoji with long shortname', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount).to.equal(0);
        parser.parseEmoji({
          symbol: '😙',
          name: 'kissing-face-with-smiling-eyes',
          fullName: 'Kissing Face With Smiling Eyes',
          category: 'people',
        }, emojiHTML2);

        expect(parseEmojiSuccessSpy.callCount).to.equal(1);
        expect(foundThemeForEmoji.callCount).to.equal(1);
        expect(foundThemeForEmoji.args[0][1]).to.equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0]).to.deep.equal(emojiJSON2);
      });
    });

    describe('emoji with no shortname', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount).to.equal(0);
        parser.parseEmoji({
          symbol: '🤩',
          name: 'grinning-face-with-star-eyes',
          fullName: 'Star-Struck',
          category: 'people',
        }, emojiHTML3);

        expect(parseEmojiSuccessSpy.callCount).to.equal(1);
        expect(foundThemeForEmoji.callCount).to.equal(1);
        expect(foundThemeForEmoji.args[0][1]).to.equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0]).to.deep.equal(emojiJSON3);
      });
    });

    describe('emoji with modifiers', () => {
      it('parses the emoji page', () => {
        expect(parseEmojiSuccessSpy.callCount).to.equal(0);
        parser.parseEmoji({
          symbol: '🎅',
          name: 'father-christmas',
          fullName: 'Santa Claus',
          category: 'people',
        }, emojiHTML4);

        expect(parseEmojiSuccessSpy.callCount).to.equal(1);
        expect(foundThemeForEmoji.callCount).to.equal(1);
        expect(foundThemeForEmoji.args[0][1]).to.equal('apple');
        expect(parseEmojiSuccessSpy.args[0][0]).to.deep.equal(emojiJSON4);
      });
    });
  });
});
