import {
  expect,
} from 'chai';
import * as constants from './constants';

describe('Constants', () => {
  it('should contains these vars', () => {
    expect(constants.DEFAULT_THEME_NAME).to.equal('apple');
    expect(constants.DEFAULT_THEMES_URL).to.equal('//cdn.jsdelivr.net/gh/arthur-feral/emogeez-generator@{{version}}/emojis');
  });
});
