import {
  expect,
} from 'chai';
import * as constants from './constants';

describe('Constants', () => {
  it('should contains these vars', () => {
    expect(constants.DEFAULT_THEME_NAME).to.equal('apple');
    expect(constants.DEFAULT_THEMES_URL).to.equal('https://cdn.jsdelivr.net/gh/arthur-feral/emogeez@0.21.0/packages/emogeez-generator/emojis');
  });
});
