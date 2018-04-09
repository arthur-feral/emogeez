import {
  expect,
} from 'chai';
import * as constants from './constants';

describe('Constants', () => {
  it('should contains these vars', () => {
    expect(constants.DEFAULT_THEME_NAME).to.equal('apple');
    expect(constants.DEFAULT_THEMES_URL).to.equal('https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@{{version}}/packages/emogeez-generator/emojis');
  });
});
