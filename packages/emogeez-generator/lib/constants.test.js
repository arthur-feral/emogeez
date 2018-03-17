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
    
    expect(constants.EXTENTIONS).to.deep.equal({
      sass: 'scss',
      less: 'less',
    });
  });
});
