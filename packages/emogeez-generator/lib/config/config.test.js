import {
  expect,
} from 'chai';
import EventEmitter from 'eventemitter3';
import Configuration from './Configuration';
import Config from './config';

const emitter = new EventEmitter();

let conf;

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
});