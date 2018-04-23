import {
  expect,
} from 'chai';
import * as constants from './constants';

describe('Constants', () => {
  it('should contains these vars', () => {
    expect(constants.BASE_URL).to.equal('https://emojipedia.org');
    expect(constants.APP_START).to.equal('APP_START');
    expect(constants.APP_DONE).to.equal('APP_DONE');
    expect(constants.APP_READY).to.equal('APP_READY');
    expect(constants.ERROR).to.equal('ERROR');

    expect(constants.FETCHER_FETCH_CATEGORIES_ERROR).to.equal('FETCHER_FETCH_CATEGORIES_ERROR');
    expect(constants.FETCHER_FETCH_CATEGORIES_SUCCESS).to.equal('FETCHER_FETCH_CATEGORIES_SUCCESS');
    expect(constants.FETCHER_FETCH_CATEGORY_ERROR).to.equal('FETCHER_FETCH_CATEGORY_ERROR');
    expect(constants.FETCHER_FETCH_CATEGORY_SUCCESS).to.equal('FETCHER_FETCH_CATEGORY_SUCCESS');
    expect(constants.FETCHER_FETCH_EMOJI_ERROR).to.equal('FETCHER_FETCH_EMOJI_ERROR');
    expect(constants.FETCHER_FETCH_EMOJI_SUCCESS).to.equal('FETCHER_FETCH_EMOJI_SUCCESS');
    expect(constants.FETCHER_FETCH_IMAGE_ERROR).to.equal('FETCHER_FETCH_IMAGE_ERROR');
    expect(constants.FETCHER_FETCH_IMAGE_SUCCESS).to.equal('FETCHER_FETCH_IMAGE_SUCCESS');

    expect(constants.PARSER_PARSE_CATEGORIES_ERROR).to.equal('PARSER_PARSE_CATEGORIES_ERROR');
    expect(constants.PARSER_PARSE_CATEGORIES_SUCCESS).to.equal('PARSER_PARSE_CATEGORIES_SUCCESS');
    expect(constants.PARSER_PARSE_CATEGORY_ERROR).to.equal('PARSER_PARSE_CATEGORY_ERROR');
    expect(constants.PARSER_PARSE_CATEGORY_SUCCESS).to.equal('PARSER_PARSE_CATEGORY_SUCCESS');
    expect(constants.PARSER_PARSE_EMOJI_ERROR).to.equal('PARSER_PARSE_EMOJI_ERROR');
    expect(constants.PARSER_PARSE_EMOJI_SUCCESS).to.equal('PARSER_PARSE_EMOJI_SUCCESS');
    expect(constants.PARSER_PARSE_IMAGE_SUCCESS).to.equal('PARSER_PARSE_IMAGE_SUCCESS');
    expect(constants.PARSER_PARSE_IMAGE_ERROR).to.equal('PARSER_PARSE_IMAGE_ERROR');
    expect(constants.PARSER_FOUND_MODIFIERS).to.equal('PARSER_FOUND_MODIFIERS');
    expect(constants.PARSER_FOUND_THEME).to.equal('PARSER_FOUND_THEME');
    expect(constants.PARSER_PARSED_ALL_IMAGES).to.equal('PARSER_PARSED_ALL_IMAGES');

    expect(constants.COLLECTOR_COLLECT_DONE).to.equal('COLLECTOR_COLLECT_DONE');

    expect(constants.GENERATOR_GENERATE_SPRITE_SUCCESS).to.equal('GENERATOR_GENERATE_SPRITE_SUCCESS');
    expect(constants.GENERATOR_GENERATE_SPRITE_ERROR).to.equal('GENERATOR_GENERATE_SPRITE_ERROR');
    expect(constants.GENERATOR_GENERATE_STYLE_SUCCESS).to.equal('GENERATOR_GENERATE_STYLE_SUCCESS');
    expect(constants.GENERATOR_GENERATE_STYLE_ERROR).to.equal('GENERATOR_GENERATE_STYLE_ERROR');
    expect(constants.GENERATOR_GENERATE_THEMES_SUCCESS).to.equal('GENERATOR_GENERATE_THEMES_SUCCESS');
    expect(constants.GENERATOR_GENERATE_THEMES_ERROR).to.equal('GENERATOR_GENERATE_THEMES_ERROR');

    expect(constants.HTML_CATEGORIES_SELECTOR).to.equal('body div.container div.sidebar div.block:first-child');
    expect(constants.HTML_EMOJIS_SELECTOR).to.equal('body div.container div.content ul.emoji-list');
    expect(constants.HTML_EMOJI_SHORTNAMES).to.equal('body div.container div.content article ul.shortcodes li');
    expect(constants.HTML_EMOJI_MODIFIERS).to.equal('body div.container div.content article section.modifiers ul li');
    expect(constants.HTML_EMOJI_THEMES).to.equal('body div.container div.content article section.vendor-list ul li .vendor-rollout-target');
    expect(constants.DEFAULT_THEMES_URL).to.equal('https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@latest/packages/emogeez-generator/emojis');

    expect(constants.EXTENTIONS).to.deep.equal({
      sass: 'scss',
      less: 'less',
    });
  });
});
