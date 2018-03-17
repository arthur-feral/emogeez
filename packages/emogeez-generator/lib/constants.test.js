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

    expect(constants.PARSER_PARSE_CATEGORIES_SUCCESS).to.equal('PARSER_PARSE_CATEGORIES_SUCCESS');
    expect(constants.PARSER_PARSE_CATEGORY_SUCCESS).to.equal('PARSER_PARSE_CATEGORY_SUCCESS');
    expect(constants.PARSER_FOUND_MODIFIERS).to.equal('PARSER_FOUND_MODIFIERS');
    expect(constants.PARSER_FOUND_THEME).to.equal('PARSER_FOUND_THEME');


    expect(constants.EXTENTIONS).to.deep.equal({
      sass: 'scss',
      less: 'less',
    });
  });
});
