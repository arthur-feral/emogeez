require('../../tests/bootstrap');
import {
  expect,
} from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import Configuration from './Configuration';
import Config from './config';
import {
  APP_READY,
  APP_START,
  DEFAULT_THEMES_URL,
} from '../constants';

const emitter = new EventEmitter();

let conf;
const appReadySpy = sinon.spy();
emitter.on(APP_READY, appReadySpy);

describe('Config', () => {
  beforeEach(() => {
    emitter.removeListener(APP_START);
    appReadySpy.reset();
  });
  it('returns default config if no custom param given', () => {
    conf = Config({
      preproc: 'sass',
    }, emitter);

    expect(conf).to.deep.equal({
      destination: 'emojis',
      themesUrl: DEFAULT_THEMES_URL,
      size: 48,
      cache: false,
      prefix: 'emojis',
      preproc: 'sass',
    });
  });

  it('should use custom config', () => {
    conf = Config({
      size: '64',
      cache: true,
      prefix: 'prefix',
      preproc: 'less',
    }, emitter);
    expect(conf).to.deep.equal(new Configuration({
      destination: 'emojis',
      themesUrl: DEFAULT_THEMES_URL,
      size: 64,
      cache: true,
      prefix: 'prefix',
      preproc: 'less',
    }));
  });

  it('emit APP_READY', (done) => {
    expect(appReadySpy.callCount).to.equal(0);
    conf = Config({}, emitter);
    emitter.emit(APP_START);
    setTimeout(() => {
      expect(appReadySpy.callCount).to.equal(1);
      done();
    }, 1000);
  });
});