import {
  expect,
} from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import Configuration from './Configuration';
import Config from './config';
import { APP_READY } from '../constants';

const emitter = new EventEmitter();

let conf;
const appReadySpy = sinon.spy();
emitter.on(APP_READY, appReadySpy);

describe('Config', () => {
  it('returns default config if no custom param given', () => {
    conf = Config({
      preproc: 'sass',
    }, emitter);

    expect(conf).to.deep.equal({
      destination: 'emojis',
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
      size: 64,
      cache: true,
      prefix: 'prefix',
      preproc: 'less',
    }));
  });

  it('emit APP_READY', async () => {
    expect(appReadySpy.callCount).to.equal(0);
    conf = await Config({}, emitter);
    expect(appReadySpy.callCount).to.equal(1);
  });
});